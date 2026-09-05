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
      const sql = `
        INSERT INTO SMY_AUDITORIA_ACCESOS (
            ID_USUARIO,
            DIRECCION_IP,
            DISPOSITIVO_INFO,
            EXITOSO,
            DETALLE,
            FECHA_CREACION
        ) VALUES (
            :userId,
            :ip,
            :deviceInfo,
            :successChar,
            :detail,
            CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE)
        )
      `;
      await connection.execute(
        sql,
        {
          userId,
          ip: ip.substring(0, 45),
          deviceInfo: deviceInfo.substring(0, 255),
          successChar: success ? 'S' : 'N',
          detail: detail ? detail.substring(0, 255) : null
        },
        { autoCommit: true }
      );
    });
  }
}
