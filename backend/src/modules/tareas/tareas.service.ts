import oracledb from 'oracledb';
import { withConnection } from '../../config/oracle.js';

export class TareasService {
  async listarTareas() {
    return withConnection(async (connection) => {
      const sql = `
        SELECT 
          t.ID,
          TO_CHAR(t.FECHA_PROGRAMADA, 'YYYY-MM-DD') AS FECHA,
          t.HORA_PROGRAMADA,
          t.TITULO,
          t.DESCRIPCION,
          t.ID_TIPO_TAREA,
          tt.NOMBRE_TIPO_TAREA,
          t.ID_ALCANCE_TAREA,
          at.NOMBRE_ALCANCE_TAREA,
          t.ID_ESTADO_TAREA,
          et.NOMBRE_ESTADO_TAREA,
          t.ID_RESIDENTE,
          r.NOMBRES || ' ' || r.APELLIDOS AS RESIDENTE_NOMBRE,
          t.CANTIDAD_RESIDENTES,
          t.COMPLETADO_EL
        FROM SMY_TAREAS_OPERATIVAS t
        LEFT JOIN SMY_TIPOS_TAREAS tt ON t.ID_TIPO_TAREA = tt.ID
        LEFT JOIN SMY_ALCANCES_TAREAS at ON t.ID_ALCANCE_TAREA = at.ID
        LEFT JOIN SMY_ESTADOS_TAREAS et ON t.ID_ESTADO_TAREA = et.ID
        LEFT JOIN SMY_RESIDENTES r ON t.ID_RESIDENTE = r.ID
        ORDER BY t.HORA_PROGRAMADA ASC
      `;

      const result = await connection.execute(sql, [], {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      });

      const rows = (result.rows || []) as any[];
      return rows.map((t) => {
        let taskType = 'actividad';
        const combined = `${t.NOMBRE_TIPO_TAREA || ''} ${t.TITULO || ''}`.toLowerCase();
        if (combined.includes('signo') || combined.includes('tensi') || combined.includes('gluco')) taskType = 'signos_vitales';
        else if (combined.includes('alimen') || combined.includes('desayun') || combined.includes('almuerz') || combined.includes('cena')) taskType = 'alimentacion';
        else if (combined.includes('medic')) taskType = 'medicacion';
        else if (combined.includes('fisio')) taskType = 'fisioterapia';
        else if (combined.includes('aseo') || combined.includes('higien') || combined.includes('baño')) taskType = 'higiene';
        else taskType = 'actividad';

        let status = 'pendiente';
        if (t.ID_ESTADO_TAREA === 3) status = 'completada';
        else if (t.ID_ESTADO_TAREA === 2) status = 'en_curso';

        return {
          id: String(t.ID),
          time: t.HORA_PROGRAMADA || '08:00',
          title: t.TITULO,
          description: t.DESCRIPCION || '',
          type: taskType,
          scope: t.ID_ALCANCE_TAREA === 1 ? 'grupal' : 'individual',
          status,
          residentCount: t.CANTIDAD_RESIDENTES || 1,
          residentId: t.ID_RESIDENTE ? String(t.ID_RESIDENTE) : undefined,
          residentName: t.RESIDENTE_NOMBRE || undefined
        };
      });
    });
  }

  async completarTarea(idTarea: number, idUsuario: number) {
    return withConnection(async (connection) => {
      const plsql = `
        UPDATE SMY_TAREAS_OPERATIVAS
        SET ID_ESTADO_TAREA = 3,
            ID_USUARIO_COMPLETO = :idUsuario,
            COMPLETADO_EL = CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE),
            ID_USUARIO_ULTIMA_MODIFICACION = :idUsuario
        WHERE ID = :idTarea
      `;

      await connection.execute(plsql, {
        idTarea,
        idUsuario
      });

      await connection.commit();
      return { success: true, message: 'Tarea marcada como completada en Oracle DB' };
    });
  }
}
