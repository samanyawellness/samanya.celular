import oracledb from 'oracledb';
import { withConnection } from '../../config/oracle.js';

export class NotificacionesService {
  async listarNotificaciones(idUsuario: number) {
    return withConnection(async (connection) => {
      const sql = `
        SELECT 
          n.ID,
          n.TITULO,
          n.MENSAJE,
          TO_CHAR(n.FECHA_CREACION, 'YYYY-MM-DD HH24:MI') AS FECHA_ENVIO,
          n.LEIDO,
          tn.NOMBRE_TIPO_NOTIFICACION
        FROM SMY_NOTIFICACIONES_SISTEMA n
        LEFT JOIN SMY_TIPOS_NOTIFICACIONES tn ON n.ID_TIPO_NOTIFICACION = tn.ID
        ORDER BY n.FECHA_CREACION DESC
      `;

      const result = await connection.execute(sql, [], {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      });

      const rows = (result.rows || []) as any[];
      return rows.map((n) => {
        let type: 'alerta' | 'consentimiento' | 'mensaje' | 'sistema' = 'sistema';
        const tNom = (n.NOMBRE_TIPO_NOTIFICACION || '').toLowerCase();
        if (tNom.includes('alert') || tNom.includes('urgente')) type = 'alerta';
        else if (tNom.includes('cons')) type = 'consentimiento';
        else if (tNom.includes('chat') || tNom.includes('mensaj')) type = 'mensaje';

        return {
          id: String(n.ID),
          title: n.TITULO,
          message: n.MENSAJE,
          time: n.FECHA_ENVIO || 'Hoy',
          type,
          isRead: n.LEIDO === 'S'
        };
      });
    });
  }
}
