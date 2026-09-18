import oracledb from 'oracledb';
import { withConnection } from '../../config/oracle.js';

// Lista blanca de tablas maestras autorizadas pertenecientes a cada organización
const TABLAS_MAESTRAS_ORGANIZACION = new Set([
  'SMY_ESTADOS_ROLES',
  'SMY_TIPOS_USUARIOS',
  'SMY_ESTADOS_USUARIOS',
  'SMY_CANALES_NOTIFICACION',
  'SMY_AREAS_EMPLEADOS',
  'SMY_CARGOS_EMPLEADOS',
  'SMY_ESTADOS_EMPLEADOS',
  'SMY_TIPOS_DOCUMENTO_EMP',
  'SMY_TIPOS_IDENTIFICACION',
  'SMY_GENEROS',
  'SMY_ESTADOS_CIVILES',
  'SMY_REGIMENES_SALUD',
  'SMY_ESTADOS_RESIDENTES',
  'SMY_NIVELES_MOVILIDAD',
  'SMY_TIPOS_DIETAS',
  'SMY_NIVELES_ALERTA',
  'SMY_TIPOS_HABITACION',
  'SMY_GRUPOS_SANGUINEOS',
  'SMY_FACTORES_RH',
  'SMY_PARENTESCOS',
  'SMY_TIPOS_TURNO',
  'SMY_ESTADOS_TURNO',
  'SMY_VIAS_ADMINISTRACION',
  'SMY_FRECUENCIAS_MEDICACION',
  'SMY_UNIDADES_MEDIDA',
  'SMY_ESTADOS_REG_MED',
  'SMY_CATEGORIAS_BITACORA',
  'SMY_TIPOS_CONSENTIMIENTO',
  'SMY_ESTADOS_CONSENTIMIENTO',
  'SMY_ESTADOS_CONSENT_DEST',
  'SMY_TIPOS_TAREAS',
  'SMY_PERIODICIDADES_TAREA',
  'SMY_ESTADOS_TAREAS',
  'SMY_ESTADOS_TAREA_RESIDENTE',
  'SMY_TIPOS_INCIDENTES',
  'SMY_SEVERIDADES_INCIDENTE',
  'SMY_ESTADOS_INCIDENTES',
  'SMY_ROLES_INCIDENTE_RES',
  'SMY_CATEGORIAS_EVENTOS',
  'SMY_ESTADOS_EVENTOS',
  'SMY_TIPOS_CONVERSACION',
  'SMY_ESTADOS_MENSAJES',
  'SMY_TIPOS_NOTIFICACION',
  'SMY_CLASES_ARCHIVOS',
  'SMY_TIPOS_ARCHIVOS',
  'SMY_ESTADOS_ARCHIVOS',
  'SMY_SERVICIOS_ALMACENAMIENTO',
  'SMY_ESTADOS_SOLICITUD_ADM',
  'SMY_NIVELES_LOG'
]);

export class MaestrasService {
  /**
   * Consulta los registros de una tabla maestra filtrando obligatoriamente por ID_ORGANIZACION
   */
  async consultarTablaMaestra(nombreTabla: string, idOrganizacion: number) {
    const tablaUpper = nombreTabla.toUpperCase().trim();

    if (!TABLAS_MAESTRAS_ORGANIZACION.has(tablaUpper)) {
      throw new Error(`Tabla maestra no válida o no autorizada para consulta multi-tenant: ${nombreTabla}`);
    }

    if (!idOrganizacion || isNaN(idOrganizacion)) {
      throw new Error('Debe especificar un ID_ORGANIZACION válido para consultar tablas maestras.');
    }

    return withConnection(async (connection) => {
      const sql = `
        SELECT *
          FROM ${tablaUpper}
         WHERE ID_ORGANIZACION = :idOrganizacion
         ORDER BY ID ASC
      `;

      const result = await connection.execute(
        sql,
        { idOrganizacion },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      return result.rows || [];
    });
  }

  /**
   * Retorna el catálogo completo de tablas maestras disponibles
   */
  obtenerTablasPermitidas(): string[] {
    return Array.from(TABLAS_MAESTRAS_ORGANIZACION);
  }
}
