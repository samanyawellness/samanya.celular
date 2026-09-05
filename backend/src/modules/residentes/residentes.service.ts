import oracledb from 'oracledb';
import { withConnection } from '../../config/oracle.js';

export interface ResidenteResumenDTO {
  id: number;
  codigoExpediente?: string;
  identificacion: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  edad: number;
  habitacion: string;
  cama: string;
  fotoUrl?: string;
  nivelMovilidad?: string;
  tipoDieta?: string;
  alertasClinicas?: string;
  estado: string;
}

export class ResidentesService {
  /**
   * Obtiene listado general de residentes activos vía cursor Oracle
   */
  async listarResidentes(idUsuario: number): Promise<ResidenteResumenDTO[]> {
    return withConnection(async (connection) => {
      // Si existe el paquete pkgca_residentes se invoca, o consulta relacional directa
      const sql = `
        SELECT 
          r.ID,
          r.CODIGO_EXPEDIENTE,
          r.IDENTIFICACION,
          r.NOMBRES,
          r.APELLIDOS,
          TRUNC(MONTHS_BETWEEN(SYSDATE, r.FECHA_NACIMIENTO) / 12) AS EDAD,
          r.HABITACION,
          r.CAMA,
          r.FOTO_URL,
          m.NOMBRE_NIVEL_MOVILIDAD AS NIVEL_MOVILIDAD,
          d.NOMBRE_TIPO_DIETA AS TIPO_DIETA,
          r.ALERTAS_CLINICAS,
          e.NOMBRE_ESTADO_RESIDENTE AS ESTADO
        FROM SMY_RESIDENTES r
        INNER JOIN SMY_ESTADOS_RESIDENTES e ON r.ID_ESTADO_RESIDENTE = e.ID
        LEFT JOIN SMY_NIVELES_MOVILIDAD m ON r.ID_NIVEL_MOVILIDAD = m.ID
        LEFT JOIN SMY_TIPOS_DIETAS d ON r.ID_TIPO_DIETA = d.ID
        ORDER BY r.HABITACION, r.CAMA
      `;

      const result = await connection.execute(sql, [], {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      });

      const rows = (result.rows || []) as any[];
      return rows.map((r) => ({
        id: r.ID,
        codigoExpediente: r.CODIGO_EXPEDIENTE,
        identificacion: r.IDENTIFICACION,
        nombres: r.NOMBRES,
        apellidos: r.APELLIDOS,
        nombreCompleto: `${r.NOMBRES} ${r.APELLIDOS}`,
        edad: Number(r.EDAD) || 0,
        habitacion: r.HABITACION,
        cama: r.CAMA,
        fotoUrl: r.FOTO_URL,
        nivelMovilidad: r.NIVEL_MOVILIDAD,
        tipoDieta: r.TIPO_DIETA,
        alertasClinicas: r.ALERTAS_CLINICAS,
        estado: r.ESTADO
      }));
    });
  }

  /**
   * Detalle clínico completo por ID de residente
   */
  async obtenerDetalle(idResidente: number) {
    return withConnection(async (connection) => {
      const sql = `
        SELECT 
          r.ID,
          r.CODIGO_EXPEDIENTE,
          r.IDENTIFICACION,
          r.NOMBRES,
          r.APELLIDOS,
          TO_CHAR(r.FECHA_NACIMIENTO, 'YYYY-MM-DD') AS FECHA_NACIMIENTO,
          TRUNC(MONTHS_BETWEEN(SYSDATE, r.FECHA_NACIMIENTO) / 12) AS EDAD,
          r.HABITACION,
          r.CAMA,
          r.FOTO_URL,
          r.EPS,
          r.PLAN_COMPLEMENTARIO,
          r.TIPO_SANGRE,
          m.NOMBRE_NIVEL_MOVILIDAD AS NIVEL_MOVILIDAD,
          d.NOMBRE_TIPO_DIETA AS TIPO_DIETA,
          r.ALERTAS_CLINICAS,
          e.NOMBRE_ESTADO_RESIDENTE AS ESTADO,
          TO_CHAR(r.FECHA_INGRESO, 'YYYY-MM-DD') AS FECHA_INGRESO
        FROM SMY_RESIDENTES r
        INNER JOIN SMY_ESTADOS_RESIDENTES e ON r.ID_ESTADO_RESIDENTE = e.ID
        LEFT JOIN SMY_NIVELES_MOVILIDAD m ON r.ID_NIVEL_MOVILIDAD = m.ID
        LEFT JOIN SMY_TIPOS_DIETAS d ON r.ID_TIPO_DIETA = d.ID
        WHERE r.ID = :idResidente
      `;

      const result = await connection.execute(sql, { idResidente }, {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      });

      if (!result.rows || result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    });
  }

  /**
   * Obtiene la bitácora asistencial del residente
   */
  async obtenerBitacora(idResidente: number) {
    return withConnection(async (connection) => {
      const sql = `
        SELECT 
          b.ID,
          b.ID_RESIDENTE,
          TO_CHAR(b.FECHA, 'YYYY-MM-DD') AS FECHA,
          b.HORA,
          c.NOMBRE_CATEGORIA_BITACORA AS CATEGORIA,
          b.CONTENIDO,
          b.GRABADO_POR_VOZ,
          b.AUDIO_URL,
          b.FOTO_ADJUNTA_URL,
          u.NOMBRE_COMPLETO AS AUTOR
        FROM SMY_BITACORA_RESIDENTE b
        INNER JOIN SMY_CATEGORIAS_BITACORA c ON b.ID_CATEGORIA_BITACORA = c.ID
        INNER JOIN SMY_USUARIOS u ON b.ID_USUARIO = u.ID
        WHERE b.ID_RESIDENTE = :idResidente
        ORDER BY b.FECHA DESC, b.HORA DESC
      `;

      const result = await connection.execute(sql, { idResidente }, {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      });

      return result.rows || [];
    });
  }
}
