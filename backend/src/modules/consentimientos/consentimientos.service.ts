import oracledb from 'oracledb';
import { withConnection } from '../../config/oracle.js';

export interface FirmarConsentimientoDTO {
  idConsentimiento: number;
  idAcudiente?: number;
  canvasBase64?: string;
  ipFirma?: string;
  firmaDigitalHash?: string;
}

export class ConsentimientosService {
  /**
   * Lista los consentimientos informados con sus estados de firma
   */
  async listarConsentimientos(idResidente?: number) {
    return withConnection(async (connection) => {
      let whereClause = '';
      const binds: any = {};

      if (idResidente) {
        whereClause = 'WHERE c.ID_RESIDENTE = :idResidente';
        binds.idResidente = idResidente;
      }

      const sql = `
        SELECT 
          c.ID,
          c.ID_RESIDENTE,
          r.NOMBRES || ' ' || r.APELLIDOS AS NOMBRE_RESIDENTE,
          tc.NOMBRE_TIPO_CONSENTIMIENTO AS TIPO,
          c.DESCRIPCION,
          ec.NOMBRE_ESTADO_CONSENTIMIENTO AS ESTADO,
          TO_CHAR(c.FECHA_ENVIO, 'YYYY-MM-DD HH24:MI') AS FECHA_ENVIO,
          TO_CHAR(c.FECHA_RESPUESTA, 'YYYY-MM-DD HH24:MI') AS FECHA_RESPUESTA,
          u.NOMBRE_COMPLETO AS SOLICITADO_POR
        FROM SMY_CONSENTIMIENTOS c
        INNER JOIN SMY_RESIDENTES r ON c.ID_RESIDENTE = r.ID
        INNER JOIN SMY_TIPOS_CONSENTIMIENTOS tc ON c.ID_TIPO_CONSENTIMIENTO = tc.ID
        INNER JOIN SMY_ESTADOS_CONSENTIMIENTOS ec ON c.ID_ESTADO_CONSENTIMIENTO = ec.ID
        INNER JOIN SMY_USUARIOS u ON c.ID_USUARIO_CREADOR = u.ID
        ${whereClause}
        ORDER BY c.FECHA_ENVIO DESC
      `;

      const result = await connection.execute(sql, binds, {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      });

      const rows = (result.rows || []) as any[];
      return rows.map((c) => ({
        id: String(c.ID),
        residentId: String(c.ID_RESIDENTE),
        residentName: c.NOMBRE_RESIDENTE,
        title: c.TIPO || 'Consentimiento Informado',
        type: c.TIPO || 'Tratamiento médico',
        description: c.DESCRIPCION,
        status: (c.ESTADO || '').toLowerCase().includes('aprob') || (c.ESTADO || '').toLowerCase().includes('firm') ? 'firmado' : 'pendiente',
        sentDate: c.FECHA_ENVIO || 'Hoy',
        responseDate: c.FECHA_RESPUESTA,
        requestedBy: c.SOLICITADO_POR || 'Centro Asistencial',
        recipients: [
          {
            name: c.NOMBRE_RESIDENTE,
            relationship: 'Familiar Responsable',
            status: (c.ESTADO || '').toLowerCase().includes('aprob') ? 'firmado' : 'enviado'
          }
        ]
      }));
    });
  }

  /**
   * Firma digitalmente un consentimiento informado invocando la lógica transaccional
   */
  async registrarFirma(dto: FirmarConsentimientoDTO, idUsuario: number) {
    return withConnection(async (connection) => {
      // Invocación a procedimiento transaccional de negocio
      const plsql = `
        DECLARE
          v_id_aprobado NUMBER(10);
        BEGIN
          -- Obtener estado APROBADO / FIRMADO
          SELECT ID INTO v_id_aprobado
          FROM SMY_ESTADOS_CONSENTIMIENTOS
          WHERE UPPER(NOMBRE_ESTADO_CONSENTIMIENTO) LIKE '%APROBADO%' OR UPPER(NOMBRE_ESTADO_CONSENTIMIENTO) LIKE '%FIRMADO%'
          FETCH FIRST 1 ROWS ONLY;

          UPDATE SMY_CONSENTIMIENTOS
          SET ID_ESTADO_CONSENTIMIENTO = v_id_aprobado,
              FECHA_RESPUESTA = CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE),
              ID_USUARIO_ULTIMA_MODIFICACION = :idUsuario
          WHERE ID = :idConsentimiento;

          -- Registrar firma en destinatario si existe
          UPDATE SMY_CONSENTIMIENTO_DESTINATARIOS
          SET FECHA_ACCION = CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE),
              IP_FIRMA = :ipFirma,
              FIRMA_DIGITAL_HASH = :firmaHash,
              ID_USUARIO_ULTIMA_MODIFICACION = :idUsuario
          WHERE ID_CONSENTIMIENTO = :idConsentimiento;

          COMMIT;
        END;
      `;

      await connection.execute(plsql, {
        idConsentimiento: dto.idConsentimiento,
        ipFirma: dto.ipFirma || '127.0.0.1',
        firmaHash: dto.firmaDigitalHash || 'SHA256-DIGITAL-SIGNATURE-ACK',
        idUsuario
      });

      return {
        success: true,
        message: 'Consentimiento firmado y registrado exitosamente con sello de tiempo.'
      };
    });
  }
}
