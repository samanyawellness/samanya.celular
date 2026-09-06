import oracledb from 'oracledb';
import { withConnection } from '../../config/oracle.js';

export interface ResidenteResumenDTO {
  id: string;
  codigoExpediente?: string;
  identificacion: string;
  nombres: string;
  apellidos: string;
  name: string;
  age: number;
  room: string;
  bed: string;
  avatar: string;
  mobility: string;
  diet: string;
  alerts: string[];
  status: string;
  birthDate: string;
  responsible: {
    name: string;
    relationship: string;
    phone?: string;
    email?: string;
  }[];
  medications?: {
    id: string;
    drugName: string;
    time: string;
    dose: string;
    route: string;
    frequency?: string;
    status: 'pendiente' | 'administrado';
  }[];
}

export class ResidentesService {
  /**
   * Obtiene listado general de residentes activos desde Oracle DB
   * Si el usuario es FAMILIAR, filtra únicamente los residentes vinculados
   */
  async listarResidentes(idUsuario: number, role?: string): Promise<ResidenteResumenDTO[]> {
    return withConnection(async (connection) => {
      let residentFilterSql = '';
      const filterBinds: any = {};

      if (role === 'FAMILIAR') {
        residentFilterSql = `
          WHERE r.ID IN (
            SELECT ra.ID_RESIDENTE 
              FROM SMY_RESIDENTE_ACUDIENTE ra
              JOIN SMY_ACUDIENTES a ON a.ID = ra.ID_ACUDIENTE
             WHERE a.ID_USUARIO = :idUsuario
          )
        `;
        filterBinds.idUsuario = idUsuario;
      }

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
          NVL(m.NOMBRE_NIVEL_MOVILIDAD, 'Independiente') AS NIVEL_MOVILIDAD,
          NVL(d.NOMBRE_TIPO_DIETA, 'Normal / General') AS TIPO_DIETA,
          r.ALERTAS_CLINICAS,
          NVL(e.NOMBRE_ESTADO_RESIDENTE, 'Activo') AS ESTADO
        FROM SMY_RESIDENTES r
        INNER JOIN SMY_ESTADOS_RESIDENTES e ON r.ID_ESTADO_RESIDENTE = e.ID
        LEFT JOIN SMY_NIVELES_MOVILIDAD m ON r.ID_NIVEL_MOVILIDAD = m.ID
        LEFT JOIN SMY_TIPOS_DIETAS d ON r.ID_TIPO_DIETA = d.ID
        ${residentFilterSql}
        ORDER BY r.HABITACION, r.CAMA
      `;

      const result = await connection.execute(sql, filterBinds, {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      });

      const rows = (result.rows || []) as any[];

      // Consultar todos los acudientes vinculados
      const acudientesSql = `
        SELECT 
          ra.ID_RESIDENTE,
          a.NOMBRES || ' ' || a.APELLIDOS AS NOMBRE_COMPLETO,
          p.NOMBRE_PARENTESCO AS PARENTESCO,
          a.TELEFONO_PRINCIPAL,
          a.EMAIL
        FROM SMY_RESIDENTE_ACUDIENTE ra
        JOIN SMY_ACUDIENTES a ON a.ID = ra.ID_ACUDIENTE
        JOIN SMY_PARENTESCOS p ON p.ID = ra.ID_PARENTESCO
      `;
      const acudientesResult = await connection.execute(acudientesSql, [], {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      });
      const acudientesRows = (acudientesResult.rows || []) as any[];

      // Consultar medicamentos prescritos
      const medsSql = `
        SELECT 
          m.ID,
          m.ID_RESIDENTE,
          m.NOMBRE_MEDICAMENTO,
          m.DOSIS,
          m.HORARIOS_FIJOS,
          m.FRECUENCIA_HORAS,
          v.NOMBRE_VIA_ADMINISTRACION
        FROM SMY_MEDICAMENTOS_PRESCRITOS m
        LEFT JOIN SMY_VIAS_ADMINISTRACION v ON v.ID = m.ID_VIA_ADMINISTRACION
        WHERE m.ID_ESTADO_MEDICAMENTO = 1
      `;
      const medsResult = await connection.execute(medsSql, [], {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      });
      const medsRows = (medsResult.rows || []) as any[];

      return rows.map((r) => {
        const idStr = String(r.ID);
        const alertsList = r.ALERTAS_CLINICAS
          ? r.ALERTAS_CLINICAS.split('.').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
          : [];

        const responsible = acudientesRows
          .filter((a) => String(a.ID_RESIDENTE) === idStr)
          .map((a) => ({
            name: a.NOMBRE_COMPLETO,
            relationship: a.PARENTESCO,
            phone: a.TELEFONO_PRINCIPAL,
            email: a.EMAIL
          }));

        const medications = medsRows
          .filter((m) => String(m.ID_RESIDENTE) === idStr)
          .map((m) => ({
            id: String(m.ID),
            drugName: m.NOMBRE_MEDICAMENTO,
            time: m.HORARIOS_FIJOS ? m.HORARIOS_FIJOS.split(',')[0].trim() : '08:00',
            dose: m.DOSIS,
            route: m.NOMBRE_VIA_ADMINISTRACION || 'Oral',
            frequency: m.FRECUENCIA_HORAS ? `Cada ${m.FRECUENCIA_HORAS}h` : undefined,
            status: 'pendiente' as const
          }));

        return {
          id: idStr,
          codigoExpediente: r.CODIGO_EXPEDIENTE,
          identificacion: r.IDENTIFICACION,
          nombres: r.NOMBRES,
          apellidos: r.APELLIDOS,
          name: `${r.NOMBRES} ${r.APELLIDOS}`,
          age: Number(r.EDAD) || 0,
          room: r.HABITACION,
          bed: r.CAMA,
          birthDate: r.FECHA_NACIMIENTO,
          avatar: r.FOTO_URL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          mobility: r.NIVEL_MOVILIDAD,
          diet: r.TIPO_DIETA,
          alerts: alertsList,
          status: r.ESTADO,
          responsible,
          medications
        };
      });
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
   * Obtiene la bitácora asistencial de residentes
   */
  async obtenerBitacora(idResidente?: number) {
    return withConnection(async (connection) => {
      let whereClause = '';
      const binds: any = {};
      if (idResidente) {
        whereClause = 'WHERE b.ID_RESIDENTE = :idResidente';
        binds.idResidente = idResidente;
      }

      const sql = `
        SELECT 
          b.ID,
          b.ID_RESIDENTE,
          r.NOMBRES || ' ' || r.APELLIDOS AS RESIDENTE_NOMBRE,
          TO_CHAR(b.FECHA, 'YYYY-MM-DD') AS FECHA,
          b.HORA,
          NVL(c.NOMBRE_CATEGORIA_BITACORA, 'general') AS CATEGORIA,
          b.CONTENIDO,
          b.GRABADO_POR_VOZ,
          b.AUDIO_URL,
          b.FOTO_ADJUNTA_URL,
          u.NOMBRE_COMPLETO AS AUTOR
        FROM SMY_BITACORA_RESIDENTE b
        LEFT JOIN SMY_RESIDENTES r ON b.ID_RESIDENTE = r.ID
        LEFT JOIN SMY_CATEGORIAS_BITACORA c ON b.ID_CATEGORIA_BITACORA = c.ID
        LEFT JOIN SMY_USUARIOS u ON b.ID_USUARIO = u.ID
        ${whereClause}
        ORDER BY b.FECHA DESC, b.HORA DESC
      `;

      const result = await connection.execute(sql, binds, {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      });

      const rows = (result.rows || []) as any[];
      return rows.map((b) => {
        let cat = (b.CATEGORIA || 'general').toLowerCase();
        if (cat.includes('alimen')) cat = 'alimentacion';
        else if (cat.includes('medic')) cat = 'medicacion';
        else if (cat.includes('activid') || cat.includes('taller')) cat = 'actividad';
        else if (cat.includes('higien') || cat.includes('aseo')) cat = 'higiene';
        else if (cat.includes('fisio')) cat = 'fisioterapia';
        else if (cat.includes('incid') || cat.includes('caida')) cat = 'incidente';
        else cat = 'general';

        return {
          id: String(b.ID),
          residentId: String(b.ID_RESIDENTE),
          residentName: b.RESIDENTE_NOMBRE,
          date: b.FECHA,
          time: b.HORA || '08:00',
          category: cat,
          text: b.CONTENIDO,
          author: b.AUTOR || 'Personal Asistencial',
          authorRole: 'cuidador',
          isVoiceNote: b.GRABADO_POR_VOZ === 'S',
          audioUrl: b.AUDIO_URL,
          photoUrl: b.FOTO_ADJUNTA_URL
        };
      });
    });
  }

  /**
   * Registrar nueva entrada en bitácora
   */
  async registrarBitacora(dto: {
    residentId: number;
    categoria?: string;
    contenido: string;
    grabadoPorVoz?: boolean;
    audioUrl?: string;
    fotoAdjuntaUrl?: string;
  }, idUsuario: number) {
    return withConnection(async (connection) => {
      const plsql = `
        INSERT INTO SMY_BITACORA_RESIDENTE (
          ID, ID_RESIDENTE, ID_USUARIO, FECHA, HORA,
          ID_CATEGORIA_BITACORA, CONTENIDO, GRABADO_POR_VOZ,
          AUDIO_URL, FOTO_ADJUNTA_URL, VISIBLE_ACUDIENTES, FECHA_CREACION
        ) VALUES (
          SMY_BITACORA_RESIDENTE_SEQ.NEXTVAL,
          :residentId,
          :idUsuario,
          CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE),
          TO_CHAR(CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE), 'HH24:MI'),
          1, -- Categoría general
          :contenido,
          :grabadoPorVoz,
          :audioUrl,
          :fotoAdjuntaUrl,
          'S',
          CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE)
        )
      `;

      await connection.execute(plsql, {
        residentId: dto.residentId,
        idUsuario,
        contenido: dto.contenido,
        grabadoPorVoz: dto.grabadoPorVoz ? 'S' : 'N',
        audioUrl: dto.audioUrl || null,
        fotoAdjuntaUrl: dto.fotoAdjuntaUrl || null
      });

      await connection.commit();
      return { success: true, message: 'Entrada registrada en bitácora exitosamente' };
    });
  }

  /**
   * Obtiene signos vitales
   */
  async obtenerSignosVitales(idResidente?: number) {
    return withConnection(async (connection) => {
      let whereClause = '';
      const binds: any = {};
      if (idResidente) {
        whereClause = 'WHERE sv.ID_RESIDENTE = :idResidente';
        binds.idResidente = idResidente;
      }

      const sql = `
        SELECT 
          sv.ID,
          sv.ID_RESIDENTE,
          r.NOMBRES || ' ' || r.APELLIDOS AS RESIDENTE_NOMBRE,
          TO_CHAR(sv.FECHA, 'YYYY-MM-DD') AS FECHA,
          sv.HORA,
          sv.PRESION_SISTOLICA,
          sv.PRESION_DIASTOLICA,
          sv.FRECUENCIA_CARDIACA,
          sv.SATURACION_OXIGENO,
          sv.TEMPERATURA,
          sv.GLUCOMETRIA,
          sv.PESO_KG,
          sv.OBSERVACIONES,
          sv.ES_ALERTA_RANGO,
          u.NOMBRE_COMPLETO AS REGISTRADO_POR
        FROM SMY_SIGNOS_VITALES sv
        JOIN SMY_RESIDENTES r ON r.ID = sv.ID_RESIDENTE
        JOIN SMY_USUARIOS u ON u.ID = sv.ID_USUARIO_REGISTRO
        ${whereClause}
        ORDER BY sv.FECHA DESC, sv.HORA DESC
      `;

      const result = await connection.execute(sql, binds, {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      });

      const rows = (result.rows || []) as any[];
      return rows.map((v) => ({
        id: String(v.ID),
        residentId: String(v.ID_RESIDENTE),
        residentName: v.RESIDENTE_NOMBRE,
        date: v.FECHA,
        time: v.HORA || '08:00',
        bloodPressure: v.PRESION_SISTOLICA && v.PRESION_DIASTOLICA ? `${v.PRESION_SISTOLICA}/${v.PRESION_DIASTOLICA}` : '120/80',
        heartRate: Number(v.FRECUENCIA_CARDIACA) || 72,
        temperature: Number(v.TEMPERATURA) || 36.5,
        oxygenSaturation: Number(v.SATURACION_OXIGENO) || 97,
        glucose: v.GLUCOMETRIA ? Number(v.GLUCOMETRIA) : undefined,
        weight: v.PESO_KG ? Number(v.PESO_KG) : undefined,
        isAlert: v.ES_ALERTA_RANGO === 'S',
        notes: v.OBSERVACIONES || '',
        takenBy: v.REGISTRADO_POR || 'Enfermería'
      }));
    });
  }

  /**
   * Registrar nueva toma de signos vitales
   */
  async registrarSignosVitales(dto: {
    residentId: number;
    bloodPressure?: string;
    systolic?: number;
    diastolic?: number;
    heartRate: number;
    temperature: number;
    oxygenSaturation: number;
    glucose?: number;
    weight?: number;
    notes?: string;
  }, idUsuario: number) {
    return withConnection(async (connection) => {
      let sys = dto.systolic;
      let dia = dto.diastolic;
      if (!sys && dto.bloodPressure && dto.bloodPressure.includes('/')) {
        const parts = dto.bloodPressure.split('/');
        sys = parseInt(parts[0], 10);
        dia = parseInt(parts[1], 10);
      }

      const isAlert = (sys && (sys > 140 || sys < 90)) ||
                      (dto.oxygenSaturation && dto.oxygenSaturation < 92) ||
                      (dto.temperature && dto.temperature > 37.8);

      const plsql = `
        INSERT INTO SMY_SIGNOS_VITALES (
          ID, ID_RESIDENTE, ID_USUARIO_REGISTRO, FECHA, HORA,
          PRESION_SISTOLICA, PRESION_DIASTOLICA, FRECUENCIA_CARDIACA,
          SATURACION_OXIGENO, TEMPERATURA, GLUCOMETRIA, PESO_KG,
          OBSERVACIONES, ES_ALERTA_RANGO, FECHA_CREACION
        ) VALUES (
          SMY_SIGNOS_VITALES_SEQ.NEXTVAL,
          :residentId,
          :idUsuario,
          CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE),
          TO_CHAR(CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE), 'HH24:MI'),
          :sys,
          :dia,
          :heartRate,
          :ox,
          :temp,
          :glucose,
          :weight,
          :notes,
          :isAlert,
          CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE)
        )
      `;

      await connection.execute(plsql, {
        residentId: dto.residentId,
        idUsuario,
        sys: sys || 120,
        dia: dia || 80,
        heartRate: dto.heartRate || 75,
        ox: dto.oxygenSaturation || 98,
        temp: dto.temperature || 36.5,
        glucose: dto.glucose || null,
        weight: dto.weight || null,
        notes: dto.notes || 'Signos vitales registrados en sistema.',
        isAlert: isAlert ? 'S' : 'N'
      });

      await connection.commit();
      return { success: true, message: 'Signos vitales registrados exitosamente en Oracle DB' };
    });
  }
}
