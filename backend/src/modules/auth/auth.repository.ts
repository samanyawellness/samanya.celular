import { withConnection } from '../../config/oracle.js';
import oracledb from 'oracledb';

export interface UserDbRow {
  ID: number;
  USERNAME: string;
  EMAIL: string;
  PASSWORD_HASH: string;
  NOMBRE_COMPLETO: string;
  TELEFONO?: string;
  AVATAR_URL?: string;
  ID_ESTADO_USUARIO: number;
  CODIGO_ROL: 'ADMIN' | 'CUIDADOR' | 'FAMILIAR';
  NOMBRE_ROL: string;
  NOMBRE_ESTADO_USUARIO: string;
}

export class AuthRepository {
  async findByUsernameOrEmail(identifier: string): Promise<UserDbRow | null> {
    return withConnection(async (connection) => {
      const sql = `
        SELECT u.ID,
               u.USERNAME,
               u.EMAIL,
               u.PASSWORD_HASH,
               u.NOMBRE_COMPLETO,
               u.TELEFONO,
               u.AVATAR_URL,
               u.ID_ESTADO_USUARIO,
               r.CODIGO AS CODIGO_ROL,
               r.NOMBRE AS NOMBRE_ROL,
               e.NOMBRE_ESTADO_USUARIO
          FROM SMY_USUARIOS u
          JOIN SMY_ROLES r ON r.ID = u.ID_ROL
          JOIN SMY_ESTADOS_USUARIOS e ON e.ID = u.ID_ESTADO_USUARIO
         WHERE LOWER(u.USERNAME) = LOWER(:identifier)
            OR LOWER(u.EMAIL) = LOWER(:identifier)
      `;

      const result = await connection.execute<UserDbRow>(
        sql,
        { identifier: identifier.trim() },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (!result.rows || result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    });
  }

  async findById(id: number): Promise<UserDbRow | null> {
    return withConnection(async (connection) => {
      const sql = `
        SELECT u.ID,
               u.USERNAME,
               u.EMAIL,
               u.PASSWORD_HASH,
               u.NOMBRE_COMPLETO,
               u.TELEFONO,
               u.AVATAR_URL,
               u.ID_ESTADO_USUARIO,
               r.CODIGO AS CODIGO_ROL,
               r.NOMBRE AS NOMBRE_ROL,
               e.NOMBRE_ESTADO_USUARIO
          FROM SMY_USUARIOS u
          JOIN SMY_ROLES r ON r.ID = u.ID_ROL
          JOIN SMY_ESTADOS_USUARIOS e ON e.ID = u.ID_ESTADO_USUARIO
         WHERE u.ID = :id
      `;

      const result = await connection.execute<UserDbRow>(
        sql,
        { id },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (!result.rows || result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    });
  }

  async updateLastAccess(userId: number): Promise<void> {
    return withConnection(async (connection) => {
      const sql = `
        UPDATE SMY_USUARIOS
           SET ULTIMO_ACCESO = CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE)
         WHERE ID = :userId
      `;
      await connection.execute(sql, { userId }, { autoCommit: true });
    });
  }

  async recordAccessLog(
    userId: number | null,
    ip: string,
    deviceInfo: string,
    success: boolean,
    detail?: string
  ): Promise<void> {
    return withConnection(async (connection) => {
      try {
        const sql = `
          INSERT INTO SMY_AUDITORIA_ACCESOS (
              ID_USUARIO,
              ACCION,
              DIRECCION_IP,
              DETALLES,
              FECHA_CREACION
          ) VALUES (
              :userId,
              :accion,
              :ip,
              :detalles,
              CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE)
          )
        `;
        const detalles = `Dispositivo: ${deviceInfo.substring(0, 200)}${detail ? ' | ' + detail : ''}`;
        await connection.execute(
          sql,
          {
            userId,
            accion: success ? 'LOGIN_EXITOSO' : 'LOGIN_FALLIDO',
            ip: ip.substring(0, 45),
            detalles
          },
          { autoCommit: true }
        );
      } catch (err) {
        // En caso de que userId sea null y la restricción NOT NULL de ID_USUARIO impida registrar intento fallido
        console.warn('Advertencia registrando auditoría de acceso:', err);
      }
    });
  }

  async findCentrosByUserId(userId: number): Promise<UserCentroDbRow[]> {
    return withConnection(async (connection) => {
      // 1. Consultar asignación directa en SMY_CENTRO_USUARIOS
      const sqlDirect = `
        SELECT cu.ID_CENTRO,
               c.CODIGO_CENTRO,
               c.NOMBRE_CENTRO,
               c.CIUDAD,
               c.DIRECCION,
               c.ID_ORGANIZACION,
               o.CODIGO_ORGANIZACION,
               o.NOMBRE_COMERCIAL AS NOMBRE_ORGANIZACION,
               cu.ID_ROL,
               r.CODIGO AS CODIGO_ROL,
               r.NOMBRE AS NOMBRE_ROL,
               cu.ES_SEDE_PRINCIPAL
          FROM SMY_CENTRO_USUARIOS cu
          JOIN SMY_CENTROS c ON c.ID = cu.ID_CENTRO
          JOIN SMY_ORGANIZACIONES o ON o.ID = c.ID_ORGANIZACION
          JOIN SMY_ROLES r ON r.ID = cu.ID_ROL
         WHERE cu.ID_USUARIO = :userId
           AND cu.ESTADO_ACTIVO = 'S'
         ORDER BY cu.ES_SEDE_PRINCIPAL DESC, c.NOMBRE_CENTRO ASC
      `;

      const result = await connection.execute<UserCentroDbRow>(
        sqlDirect,
        { userId },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (result.rows && result.rows.length > 0) {
        return result.rows;
      }

      // 2. Si es familiar/acudiente sin asignación explícita previa, consultar las sedes de sus residentes vinculados
      const sqlFamiliar = `
        SELECT DISTINCT
               c.ID AS ID_CENTRO,
               c.CODIGO_CENTRO,
               c.NOMBRE_CENTRO,
               c.CIUDAD,
               c.DIRECCION,
               c.ID_ORGANIZACION,
               o.CODIGO_ORGANIZACION,
               o.NOMBRE_COMERCIAL AS NOMBRE_ORGANIZACION,
               r.ID AS ID_ROL,
               r.CODIGO AS CODIGO_ROL,
               r.NOMBRE AS NOMBRE_ROL,
               'S' AS ES_SEDE_PRINCIPAL
          FROM SMY_RESIDENTES res
          JOIN SMY_RESIDENTE_ACUDIENTE ra ON ra.ID_RESIDENTE = res.ID
          JOIN SMY_ACUDIENTES a ON a.ID = ra.ID_ACUDIENTE
          JOIN SMY_CENTROS c ON c.ID = res.ID_CENTRO
          JOIN SMY_ORGANIZACIONES o ON o.ID = c.ID_ORGANIZACION
          JOIN SMY_ROLES r ON r.CODIGO = 'FAMILIAR'
         WHERE a.ID_USUARIO = :userId
         ORDER BY c.NOMBRE_CENTRO ASC
      `;

      const resultFam = await connection.execute<UserCentroDbRow>(
        sqlFamiliar,
        { userId },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      return resultFam.rows || [];
    });
  }
}

export interface UserCentroDbRow {
  ID_CENTRO: number;
  CODIGO_CENTRO: string;
  NOMBRE_CENTRO: string;
  CIUDAD: string;
  DIRECCION?: string;
  ID_ORGANIZACION: number;
  CODIGO_ORGANIZACION: string;
  NOMBRE_ORGANIZACION: string;
  ID_ROL: number;
  CODIGO_ROL: string;
  NOMBRE_ROL: string;
  ES_SEDE_PRINCIPAL: string;
}

