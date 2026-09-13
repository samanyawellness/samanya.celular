import crypto from 'crypto';
import { Readable } from 'stream';
import oracledb from 'oracledb';
import { withConnection } from '../../config/oracle.js';
import { googleDriveService } from './gdrive.service.js';
import { readResultSet } from '../../utils/oracle-cursor.js';

export interface SubirArchivoParams {
  idCentro: number;
  idResidente: number;
  nombreOriginal: string;
  buffer: Buffer;
  tipoMime?: string;
  idClaseArchivo?: number;
  tablaOrigen?: string;
  idRegistroOrigen?: number;
  idUsuario?: number;
}

export interface ArchivoDTO {
  id: number;
  nombreArchivo: string;
  nombreArchivoAlmacenado: string;
  hashArchivo: string;
  rutaRelativa: string;
  rutaCompletaAlmacenamiento: string;
  enlaceVisualizacion?: string;
  enlaceDescarga?: string;
  extension: string;
  tipoMime: string;
  tamanoBytes: number;
  idClaseArchivo: number;
  nombreClase?: string;
  idCentro: number;
  idResidente: number;
  idEstadoArchivo: number;
  nombreEstadoArchivo?: string;
  tablaOrigen?: string;
  idRegistroOrigen?: number;
  metadatosJson?: any;
  fechaCreacion: string;
}

export class ArchivosService {
  /**
   * Orquesta el flujo completo de carga:
   * 1. Reserva ID en BD y genera nombre hasheado: hash(ID) + extension
   * 2. Sube archivo a Google Drive en la jerarquía: {id_sede}_{sede}/{id_residente}_{identificacion}/Documentos
   * 3. Registra atómicamente el archivo en la tabla SMY_ARCHIVOS
   */
  async subirArchivo(params: SubirArchivoParams): Promise<ArchivoDTO> {
    return withConnection(async (connection) => {
      // 1. Calcular hash SHA-256 del contenido binario del archivo
      const hashContenido = crypto.createHash('sha256').update(params.buffer).digest('hex');

      // 2. Invocar PKGLN_ARCHIVOS.pr_preparar_carga_archivo para reservar ID y calcular rutas
      const prepBinds: any = {
        p_id_centro: params.idCentro,
        p_id_residente: params.idResidente,
        p_nombre_original: params.nombreOriginal,
        p_id_clase_archivo: params.idClaseArchivo || 1,
        p_id_reserva: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        p_nombre_almacenado: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 255 },
        p_nombre_carpeta_sede: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 255 },
        p_nombre_carpeta_residente: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 255 },
        p_ruta_relativa: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 1000 },
        p_extension: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 20 },
        p_tipo_mime: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 }
      };

      const prepResult = await connection.execute(
        `BEGIN
           PKGLN_ARCHIVOS.pr_preparar_carga_archivo(
             p_id_centro               => :p_id_centro,
             p_id_residente            => :p_id_residente,
             p_nombre_original         => :p_nombre_original,
             p_id_clase_archivo        => :p_id_clase_archivo,
             p_id_reserva              => :p_id_reserva,
             p_nombre_almacenado       => :p_nombre_almacenado,
             p_nombre_carpeta_sede     => :p_nombre_carpeta_sede,
             p_nombre_carpeta_residente=> :p_nombre_carpeta_residente,
             p_ruta_relativa           => :p_ruta_relativa,
             p_extension               => :p_extension,
             p_tipo_mime               => :p_tipo_mime
           );
         END;`,
        prepBinds
      );

      const out = prepResult.outBinds as any;
      const idReserva = out.p_id_reserva;
      const nombreAlmacenado = out.p_nombre_almacenado;
      const carpetaSede = out.p_nombre_carpeta_sede;
      const carpetaResidente = out.p_nombre_carpeta_residente;
      const rutaRelativa = out.p_ruta_relativa;
      const extension = out.p_extension;
      const tipoMime = params.tipoMime || out.p_tipo_mime;

      // 3. Subir archivo a Google Drive con el nombre hasheado (hash del ID)
      const gdriveRes = await googleDriveService.subirArchivo({
        nombreCarpetaSede: carpetaSede,
        nombreCarpetaResidente: carpetaResidente,
        nombreArchivoAlmacenado: nombreAlmacenado,
        buffer: params.buffer,
        tipoMime
      });

      // 4. Preparar metadatos enriquecidos en formato JSON
      const metadatos = {
        gdriveFileId: gdriveRes.fileId,
        webViewLink: gdriveRes.webViewLink,
        webContentLink: gdriveRes.webContentLink,
        gdriveFolderId: gdriveRes.folderId,
        nombreOriginal: params.nombreOriginal,
        hashContenidoSha256: hashContenido,
        tamanoBytes: gdriveRes.sizeBytes,
        subidoPorUsuario: params.idUsuario || null,
        timestampCarga: new Date().toISOString()
      };

      const rutaCompleta = gdriveRes.webViewLink || `https://drive.google.com/file/d/${gdriveRes.fileId}/view`;

      // 5. Registrar archivo en SMY_ARCHIVOS invocando PKGLN_ARCHIVOS.pr_registrar_archivo
      const regBinds: any = {
        p_id: idReserva,
        p_nombre_archivo: params.nombreOriginal,
        p_nombre_archivo_almacenado: nombreAlmacenado,
        p_hash_archivo: hashContenido,
        p_ruta_relativa: rutaRelativa,
        p_ruta_completa_almacenamiento: rutaCompleta,
        p_extension: extension,
        p_tipo_mime: tipoMime,
        p_tamano_bytes: gdriveRes.sizeBytes || params.buffer.length,
        p_id_clase_archivo: params.idClaseArchivo || 1,
        p_id_centro: params.idCentro,
        p_id_residente: params.idResidente,
        p_tabla_origen: params.tablaOrigen || null,
        p_id_registro_origen: params.idRegistroOrigen || null,
        p_metadatos_json: JSON.stringify(metadatos),
        p_id_usuario_creacion: params.idUsuario || null,
        p_mensaje_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 }
      };

      await connection.execute(
        `BEGIN
           PKGLN_ARCHIVOS.pr_registrar_archivo(
             p_id                         => :p_id,
             p_nombre_archivo             => :p_nombre_archivo,
             p_nombre_archivo_almacenado  => :p_nombre_archivo_almacenado,
             p_hash_archivo               => :p_hash_archivo,
             p_ruta_relativa              => :p_ruta_relativa,
             p_ruta_completa_almacenamiento => :p_ruta_completa_almacenamiento,
             p_extension                  => :p_extension,
             p_tipo_mime                  => :p_tipo_mime,
             p_tamano_bytes               => :p_tamano_bytes,
             p_id_clase_archivo           => :p_id_clase_archivo,
             p_id_centro                  => :p_id_centro,
             p_id_residente               => :p_id_residente,
             p_tabla_origen               => :p_tabla_origen,
             p_id_registro_origen         => :p_id_registro_origen,
             p_metadatos_json             => :p_metadatos_json,
             p_id_usuario_creacion        => :p_id_usuario_creacion,
             p_mensaje_resultado          => :p_mensaje_resultado
           );
         END;`,
        regBinds
      );

      return {
        id: idReserva,
        nombreArchivo: params.nombreOriginal,
        nombreArchivoAlmacenado: nombreAlmacenado,
        hashArchivo: hashContenido,
        rutaRelativa,
        rutaCompletaAlmacenamiento: rutaCompleta,
        enlaceVisualizacion: `/api/v1/archivos/${idReserva}/ver`,
        enlaceDescarga: `/api/v1/archivos/${idReserva}/descargar`,
        extension,
        tipoMime,
        tamanoBytes: gdriveRes.sizeBytes || params.buffer.length,
        idClaseArchivo: params.idClaseArchivo || 1,
        idCentro: params.idCentro,
        idResidente: params.idResidente,
        idEstadoArchivo: 1,
        tablaOrigen: params.tablaOrigen,
        idRegistroOrigen: params.idRegistroOrigen,
        metadatosJson: metadatos,
        fechaCreacion: new Date().toISOString()
      };
    });
  }

  /**
   * Borrado lógico: cambia el estado del archivo a no visible (ID_ESTADO_ARCHIVO = 2)
   */
  async borrarArchivoLogico(idArchivo: number, idUsuario: number, motivo?: string): Promise<string> {
    return withConnection(async (connection) => {
      // 1. Obtener registro para verificar ID de Google Drive si existe
      const fileRes = await connection.execute<any>(
        `SELECT METADATOS_JSON FROM SMY_ARCHIVOS WHERE ID = :id`,
        { id: idArchivo }
      );

      // 2. Invocar procedimiento transaccional PKGLN_ARCHIVOS.pr_borrar_archivo
      const binds: any = {
        p_id_archivo: idArchivo,
        p_id_usuario: idUsuario,
        p_motivo: motivo || null,
        p_mensaje_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 }
      };

      const result = await connection.execute(
        `BEGIN
           PKGLN_ARCHIVOS.pr_borrar_archivo(
             p_id_archivo        => :p_id_archivo,
             p_id_usuario        => :p_id_usuario,
             p_motivo            => :p_motivo,
             p_mensaje_resultado => :p_mensaje_resultado
           );
         END;`,
        binds
      );

      // 3. Enviar a papelera en Drive de manera no bloqueante
      if (fileRes.rows && fileRes.rows.length > 0 && fileRes.rows[0].METADATOS_JSON) {
        try {
          const meta = typeof fileRes.rows[0].METADATOS_JSON === 'string'
            ? JSON.parse(fileRes.rows[0].METADATOS_JSON)
            : fileRes.rows[0].METADATOS_JSON;
          if (meta.gdriveFileId) {
            googleDriveService.enviarAPapelera(meta.gdriveFileId).catch(() => {});
          }
        } catch (_) {}
      }

      return (result.outBinds as any).p_mensaje_resultado;
    });
  }

  /**
   * Renombra lógicamente el archivo (columna NOMBRE_ARCHIVO)
   */
  async renombrarArchivo(idArchivo: number, nuevoNombre: string, idUsuario: number): Promise<string> {
    return withConnection(async (connection) => {
      const binds: any = {
        p_id_archivo: idArchivo,
        p_nuevo_nombre: nuevoNombre,
        p_id_usuario: idUsuario,
        p_mensaje_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 }
      };

      const result = await connection.execute(
        `BEGIN
           PKGLN_ARCHIVOS.pr_renombrar_archivo(
             p_id_archivo        => :p_id_archivo,
             p_nuevo_nombre      => :p_nuevo_nombre,
             p_id_usuario        => :p_id_usuario,
             p_mensaje_resultado => :p_mensaje_resultado
           );
         END;`,
        binds
      );

      return (result.outBinds as any).p_mensaje_resultado;
    });
  }

  /**
   * Clona un archivo hacia otro residente o centro
   */
  async copiarArchivo(params: {
    idArchivoOrigen: number;
    nuevoIdResidente?: number;
    nuevoIdCentro?: number;
    nuevoNombre?: string;
    idUsuario: number;
  }): Promise<{ idNuevoArchivo: number; mensaje: string }> {
    return withConnection(async (connection) => {
      const binds: any = {
        p_id_archivo_origen: params.idArchivoOrigen,
        p_nuevo_id_residente: params.nuevoIdResidente || null,
        p_nuevo_id_centro: params.nuevoIdCentro || null,
        p_nuevo_nombre: params.nuevoNombre || null,
        p_id_usuario: params.idUsuario,
        p_id_nuevo_archivo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        p_mensaje_resultado: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 }
      };

      const result = await connection.execute(
        `BEGIN
           PKGLN_ARCHIVOS.pr_copiar_archivo(
             p_id_archivo_origen  => :p_id_archivo_origen,
             p_nuevo_id_residente => :p_nuevo_id_residente,
             p_nuevo_id_centro    => :p_nuevo_id_centro,
             p_nuevo_nombre       => :p_nuevo_nombre,
             p_id_usuario         => :p_id_usuario,
             p_id_nuevo_archivo   => :p_id_nuevo_archivo,
             p_mensaje_resultado  => :p_mensaje_resultado
           );
         END;`,
        binds
      );

      const out = result.outBinds as any;
      return {
        idNuevoArchivo: out.p_id_nuevo_archivo,
        mensaje: out.p_mensaje_resultado
      };
    });
  }

  /**
   * Consulta archivos de un residente usando SYS_REFCURSOR de PKGLN_ARCHIVOS
   */
  async listarArchivosResidente(idResidente: number, soloVisibles: boolean = true): Promise<ArchivoDTO[]> {
    return withConnection(async (connection) => {
      const binds: any = {
        p_id_residente: idResidente,
        p_solo_visibles: soloVisibles ? 1 : 0,
        p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      };

      const result = await connection.execute(
        `BEGIN
           :p_cursor := PKGLN_ARCHIVOS.fn_consultar_archivos_residente(
             p_id_residente  => :p_id_residente,
             p_solo_visibles => :p_solo_visibles
           );
         END;`,
        binds
      );

      const cursor = (result.outBinds as any).p_cursor;
      const rows = await readResultSet(cursor);

      return rows.map((r: any) => ({
        id: r.ID,
        nombreArchivo: r.NOMBRE_ARCHIVO,
        nombreArchivoAlmacenado: r.NOMBRE_ARCHIVO_ALMACENADO,
        hashArchivo: r.HASH_ARCHIVO,
        rutaRelativa: r.RUTA_RELATIVA,
        rutaCompletaAlmacenamiento: r.RUTA_COMPLETA_ALMACENAMIENTO,
        enlaceVisualizacion: `/api/v1/archivos/${r.ID}/ver`,
        enlaceDescarga: `/api/v1/archivos/${r.ID}/descargar`,
        extension: r.EXTENSION,
        tipoMime: r.TIPO_MIME,
        tamanoBytes: r.TAMANO_BYTES,
        idClaseArchivo: r.ID_CLASE_ARCHIVO,
        nombreClase: r.NOMBRE_CLASE,
        idCentro: r.ID_CENTRO,
        idResidente: r.ID_RESIDENTE,
        idEstadoArchivo: r.ID_ESTADO_ARCHIVO,
        nombreEstadoArchivo: r.NOMBRE_ESTADO_ARCHIVO,
        tablaOrigen: r.TABLA_ORIGEN,
        idRegistroOrigen: r.ID_REGISTRO_ORIGEN,
        metadatosJson: r.METADATOS_JSON ? (typeof r.METADATOS_JSON === 'string' ? JSON.parse(r.METADATOS_JSON) : r.METADATOS_JSON) : null,
        fechaCreacion: r.FECHA_CREACION
      }));
    });
  }

  /**
   * Obtiene el stream de lectura y metadatos de un archivo registrado en SMY_ARCHIVOS
   */
  async obtenerStreamArchivo(idArchivo: number): Promise<{
    stream: Readable;
    tipoMime: string;
    nombreArchivo: string;
    tamanoBytes: number;
    gdriveFileId: string;
  }> {
    return withConnection(async (connection) => {
      const res = await connection.execute<any>(
        `SELECT ID, NOMBRE_ARCHIVO, TIPO_MIME, TAMANO_BYTES, METADATOS_JSON
         FROM SMY_ARCHIVOS
         WHERE ID = :id AND ID_ESTADO_ARCHIVO = 1`,
        { id: idArchivo }
      );

      if (!res.rows || res.rows.length === 0) {
        throw new Error(`Archivo con ID ${idArchivo} no encontrado o inactivo.`);
      }

      const row = res.rows[0];
      let fileId = '';
      if (row.METADATOS_JSON) {
        try {
          const meta = typeof row.METADATOS_JSON === 'string' ? JSON.parse(row.METADATOS_JSON) : row.METADATOS_JSON;
          fileId = meta.gdriveFileId;
        } catch (e) {
          console.error('Error parseando METADATOS_JSON:', e);
        }
      }

      if (!fileId) {
        throw new Error(`El archivo ${idArchivo} no tiene ID de Google Drive asociado.`);
      }

      const stream = await googleDriveService.obtenerStreamArchivo(fileId);
      return {
        stream,
        tipoMime: row.TIPO_MIME || 'application/octet-stream',
        nombreArchivo: row.NOMBRE_ARCHIVO,
        tamanoBytes: Number(row.TAMANO_BYTES) || 0,
        gdriveFileId: fileId
      };
    });
  }
}

export const archivosService = new ArchivosService();
