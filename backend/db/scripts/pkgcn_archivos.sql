-- =============================================================================
-- ESPECIFICACIÓN Y CUERPO: PKGCN_ARCHIVOS
-- FAMILIA: pkgcn_ (Transacciones atómicas de negocio, orquestación, COMMIT/ROLLBACK)
-- ESTÁNDAR ARQUITECTÓNICO: oracle-plsql-architecture
-- LOGGING: Registro persistente en SMY_ERRORES vía uti_ge_excepciones_pkg.p_grabar_log
-- =============================================================================

CREATE OR REPLACE PACKAGE PKGCN_ARCHIVOS
AS
    /*
    || =========================================================================
    || Paquete: PKGCN_ARCHIVOS
    || Propósito: Lógica de negocio transaccional y orquestación de operaciones
    ||            sobre archivos: reserva de identificadores, registro definitivo,
    ||            borrado lógico (estado no visible), renombrado, clonación
    ||            y consultas optimizadas en JSON / SYS_REFCURSOR.
    || =========================================================================
    */

    /**
     * 1. Reserva un identificador único de la secuencia SEQ_SMY_ARCHIVOS,
     *    valida la existencia de la sede y el residente, y genera el
     *    nombre de archivo almacenado con el hash SHA-256 del ID reservado,
     *    junto con los nombres jerárquicos de carpetas para Google Drive.
     */
    PROCEDURE pr_preparar_carga_archivo (
        p_id_centro               IN  smy_centros.id%TYPE,
        p_id_residente            IN  smy_residentes.id%TYPE,
        p_nombre_original         IN  smy_archivos.nombre_archivo%TYPE,
        p_id_clase_archivo        IN  smy_clases_archivos.id%TYPE DEFAULT 1,
        p_id_reserva              OUT smy_archivos.id%TYPE,
        p_nombre_almacenado       OUT smy_archivos.nombre_archivo_almacenado%TYPE,
        p_nombre_carpeta_sede     OUT VARCHAR2,
        p_nombre_carpeta_residente OUT VARCHAR2,
        p_ruta_relativa           OUT smy_archivos.ruta_relativa%TYPE,
        p_extension               OUT smy_archivos.extension%TYPE,
        p_tipo_mime               OUT smy_archivos.tipo_mime%TYPE
    );

    /**
     * 2. Registra de manera definitiva un archivo cargado exitosamente en Google Drive,
     *    insertando en SMY_ARCHIVOS con estado Activo (ID_ESTADO_ARCHIVO = 1).
     */
    PROCEDURE pr_registrar_archivo (
        p_id                         IN  smy_archivos.id%TYPE,
        p_nombre_archivo             IN  smy_archivos.nombre_archivo%TYPE,
        p_nombre_archivo_almacenado  IN  smy_archivos.nombre_archivo_almacenado%TYPE,
        p_hash_archivo               IN  smy_archivos.hash_archivo%TYPE,
        p_ruta_relativa              IN  smy_archivos.ruta_relativa%TYPE,
        p_ruta_completa_almacenamiento IN smy_archivos.ruta_completa_almacenamiento%TYPE,
        p_extension                  IN  smy_archivos.extension%TYPE,
        p_tipo_mime                  IN  smy_archivos.tipo_mime%TYPE,
        p_tamano_bytes               IN  smy_archivos.tamano_bytes%TYPE,
        p_id_clase_archivo           IN  smy_archivos.id_clase_archivo%TYPE,
        p_id_centro                  IN  smy_archivos.id_centro%TYPE,
        p_id_residente               IN  smy_archivos.id_residente%TYPE,
        p_tabla_origen               IN  smy_archivos.tabla_origen%TYPE DEFAULT NULL,
        p_id_registro_origen         IN  smy_archivos.id_registro_origen%TYPE DEFAULT NULL,
        p_metadatos_json             IN  CLOB DEFAULT NULL,
        p_id_usuario_creacion        IN  smy_usuarios.id%TYPE DEFAULT NULL,
        p_mensaje_resultado          OUT VARCHAR2
    );

    /**
     * 3. Borrado lógico de un archivo: cambia el estado para que NO sea visible
     *    (ID_ESTADO_ARCHIVO = 2: Eliminado / Papelera), registrando fecha y usuario.
     */
    PROCEDURE pr_borrar_archivo (
        p_id_archivo                 IN  smy_archivos.id%TYPE,
        p_id_usuario                 IN  smy_usuarios.id%TYPE,
        p_motivo                     IN  VARCHAR2 DEFAULT NULL,
        p_mensaje_resultado          OUT VARCHAR2
    );

    /**
     * 4. Renombra lógicamente el archivo (columna NOMBRE_ARCHIVO)
     *    conservando intacto el nombre almacenado físico y registrando auditoría.
     */
    PROCEDURE pr_renombrar_archivo (
        p_id_archivo                 IN  smy_archivos.id%TYPE,
        p_nuevo_nombre               IN  smy_archivos.nombre_archivo%TYPE,
        p_id_usuario                 IN  smy_usuarios.id%TYPE,
        p_mensaje_resultado          OUT VARCHAR2
    );

    /**
     * 5. Clona la referencia lógica de un archivo hacia otro residente o centro,
     *    generando un nuevo registro con nuevo ID y nuevo nombre almacenado hasheado,
     *    pero referenciando el mismo recurso en Google Drive o storage.
     */
    PROCEDURE pr_copiar_archivo (
        p_id_archivo_origen          IN  smy_archivos.id%TYPE,
        p_nuevo_id_residente         IN  smy_residentes.id%TYPE DEFAULT NULL,
        p_nuevo_id_centro            IN  smy_centros.id%TYPE DEFAULT NULL,
        p_nuevo_nombre               IN  smy_archivos.nombre_archivo%TYPE DEFAULT NULL,
        p_id_usuario                 IN  smy_usuarios.id%TYPE,
        p_id_nuevo_archivo           OUT smy_archivos.id%TYPE,
        p_mensaje_resultado          OUT VARCHAR2
    );

    /**
     * 6. Restaura un archivo previamente borrado lógicamente,
     *    restituyendo su visibilidad (ID_ESTADO_ARCHIVO = 1: Activo / Disponible).
     */
    PROCEDURE pr_restaurar_archivo (
        p_id_archivo                 IN  smy_archivos.id%TYPE,
        p_id_usuario                 IN  smy_usuarios.id%TYPE,
        p_mensaje_resultado          OUT VARCHAR2
    );

    /**
     * 7. Consulta multi-fila: Retorna cursor SYS_REFCURSOR con los archivos
     *    de un residente. Por defecto filtra únicamente los archivos visibles (activos).
     */
    FUNCTION fn_consultar_archivos_residente (
        p_id_residente  IN smy_residentes.id%TYPE,
        p_solo_visibles IN NUMBER DEFAULT 1
    ) RETURN SYS_REFCURSOR;

    /**
     * 8. Retorna la información completa de un archivo en formato JSON nativo CLOB.
     */
    FUNCTION fn_obtener_archivo_json (
        p_id_archivo IN smy_archivos.id%TYPE
    ) RETURN CLOB;

END PKGCN_ARCHIVOS;
/

CREATE OR REPLACE PACKAGE BODY PKGCN_ARCHIVOS
AS
    vro_error smy_errores%ROWTYPE;

    -- 1. Preparar carga de archivo (Reserva ID + Hash + Jerarquía de carpetas)
    PROCEDURE pr_preparar_carga_archivo (
        p_id_centro               IN  smy_centros.id%TYPE,
        p_id_residente            IN  smy_residentes.id%TYPE,
        p_nombre_original         IN  smy_archivos.nombre_archivo%TYPE,
        p_id_clase_archivo        IN  smy_clases_archivos.id%TYPE DEFAULT 1,
        p_id_reserva              OUT smy_archivos.id%TYPE,
        p_nombre_almacenado       OUT smy_archivos.nombre_archivo_almacenado%TYPE,
        p_nombre_carpeta_sede     OUT VARCHAR2,
        p_nombre_carpeta_residente OUT VARCHAR2,
        p_ruta_relativa           OUT smy_archivos.ruta_relativa%TYPE,
        p_extension               OUT smy_archivos.extension%TYPE,
        p_tipo_mime               OUT smy_archivos.tipo_mime%TYPE
    )
    IS
        vro_centro    smy_centros%ROWTYPE;
        vro_residente smy_residentes%ROWTYPE;
        v_ext         VARCHAR2(30);
    BEGIN
        -- Validar parámetro de nombre original
        IF p_nombre_original IS NULL OR TRIM(p_nombre_original) IS NULL THEN
            RAISE_APPLICATION_ERROR(-20001, 'El nombre original del archivo es obligatorio.');
        END IF;

        -- Validar existencia de la sede / centro
        vro_centro := PKGSMY_CENTROS_DAO.f_traer(p_id_centro);
        IF vro_centro.id IS NULL THEN
            RAISE_APPLICATION_ERROR(-20002, 'La sede o centro geriátrico especificado (ID: ' || p_id_centro || ') no existe en el sistema.');
        END IF;

        -- Validar existencia del residente
        vro_residente := PKGSMY_RESIDENTES_DAO.f_traer(p_id_residente);
        IF vro_residente.id IS NULL THEN
            RAISE_APPLICATION_ERROR(-20003, 'El residente especificado (ID: ' || p_id_residente || ') no existe en el sistema.');
        END IF;

        -- Normalizar extensión y deducir MIME
        v_ext := PKGLN_ARCHIVOS.fn_normalizar_extension(p_nombre_original);
        p_extension := v_ext;
        p_tipo_mime := PKGLN_ARCHIVOS.fn_resolver_mime_type(v_ext);

        -- Validar que la extensión sea permitida
        IF NOT PKGLN_ARCHIVOS.fn_validar_extension(v_ext) THEN
            RAISE_APPLICATION_ERROR(-20004, 'La extensión de archivo ' || v_ext || ' no está permitida.');
        END IF;

        -- Obtener siguiente valor de la secuencia para ID reservado
        SELECT SEQ_SMY_ARCHIVOS.NEXTVAL INTO p_id_reserva FROM DUAL;

        -- Generar nombre almacenado: Hash SHA-256 del ID + extensión
        p_nombre_almacenado := PKGLN_ARCHIVOS.fn_generar_nombre_almacenado(p_id_reserva, v_ext);

        -- Construir nombres de carpetas para Google Drive y storage
        p_nombre_carpeta_sede := PKGLN_ARCHIVOS.fn_construir_ruta_sede(vro_centro.id, vro_centro.nombre_centro);
        p_nombre_carpeta_residente := PKGLN_ARCHIVOS.fn_construir_ruta_residente(vro_residente.id, vro_residente.identificacion);

        -- Construir ruta relativa jerárquica: {sede}/{residente}/Documentos
        p_ruta_relativa := PKGLN_ARCHIVOS.fn_construir_ruta_documentos(
            vro_centro.id,
            vro_centro.nombre_centro,
            vro_residente.id,
            vro_residente.identificacion
        );

    EXCEPTION
        WHEN OTHERS THEN
            IF SQLCODE BETWEEN -20999 AND -20001 THEN
                RAISE;
            END IF;
            vro_error.nombre_programa := 'PKGCN_ARCHIVOS';
            vro_error.nombre_metodo   := 'PR_PREPARAR_CARGA_ARCHIVO';
            vro_error.parametros      := 'p_id_centro: ' || p_id_centro || ', p_id_residente: ' || p_id_residente || ', p_nombre_original: ' || p_nombre_original;
            uti_ge_excepciones_pkg.p_grabar_log(vro_error);
            RAISE_APPLICATION_ERROR(-20000, 'Se presento un error comunicarse con soporte. Número error: ' || vro_error.id || ' - ' || SQLERRM);
    END pr_preparar_carga_archivo;

    -- 2. Registrar archivo de manera definitiva en SMY_ARCHIVOS
    PROCEDURE pr_registrar_archivo (
        p_id                         IN  smy_archivos.id%TYPE,
        p_nombre_archivo             IN  smy_archivos.nombre_archivo%TYPE,
        p_nombre_archivo_almacenado  IN  smy_archivos.nombre_archivo_almacenado%TYPE,
        p_hash_archivo               IN  smy_archivos.hash_archivo%TYPE,
        p_ruta_relativa              IN  smy_archivos.ruta_relativa%TYPE,
        p_ruta_completa_almacenamiento IN smy_archivos.ruta_completa_almacenamiento%TYPE,
        p_extension                  IN  smy_archivos.extension%TYPE,
        p_tipo_mime                  IN  smy_archivos.tipo_mime%TYPE,
        p_tamano_bytes               IN  smy_archivos.tamano_bytes%TYPE,
        p_id_clase_archivo           IN  smy_archivos.id_clase_archivo%TYPE,
        p_id_centro                  IN  smy_archivos.id_centro%TYPE,
        p_id_residente               IN  smy_archivos.id_residente%TYPE,
        p_tabla_origen               IN  smy_archivos.tabla_origen%TYPE DEFAULT NULL,
        p_id_registro_origen         IN  smy_archivos.id_registro_origen%TYPE DEFAULT NULL,
        p_metadatos_json             IN  CLOB DEFAULT NULL,
        p_id_usuario_creacion        IN  smy_usuarios.id%TYPE DEFAULT NULL,
        p_mensaje_resultado          OUT VARCHAR2
    )
    IS
        vro_archivo smy_archivos%ROWTYPE;
    BEGIN
        -- Validaciones de integridad
        IF p_id IS NULL THEN
            RAISE_APPLICATION_ERROR(-20001, 'El ID de archivo es obligatorio.');
        END IF;
        IF p_nombre_archivo IS NULL THEN
            RAISE_APPLICATION_ERROR(-20002, 'El nombre del archivo es obligatorio.');
        END IF;
        IF p_nombre_archivo_almacenado IS NULL THEN
            RAISE_APPLICATION_ERROR(-20003, 'El nombre de archivo almacenado (hash) es obligatorio.');
        END IF;

        -- Poblar el registro completo
        vro_archivo.id                           := p_id;
        vro_archivo.nombre_archivo               := p_nombre_archivo;
        vro_archivo.nombre_archivo_almacenado    := p_nombre_archivo_almacenado;
        vro_archivo.hash_archivo                 := NVL(p_hash_archivo, 'PENDIENTE');
        vro_archivo.nombre_directorio_bd         := NULL;
        vro_archivo.ruta_relativa                := p_ruta_relativa;
        vro_archivo.ruta_completa_almacenamiento := p_ruta_completa_almacenamiento;
        vro_archivo.extension                    := p_extension;
        vro_archivo.tipo_mime                    := p_tipo_mime;
        vro_archivo.tamano_bytes                 := NVL(p_tamano_bytes, 0);
        vro_archivo.id_clase_archivo             := NVL(p_id_clase_archivo, 1);
        vro_archivo.id_centro                    := p_id_centro;
        vro_archivo.id_residente                 := p_id_residente;
        vro_archivo.id_estado_archivo            := 1; -- 1 = Activo / Disponible
        vro_archivo.tabla_origen                 := p_tabla_origen;
        vro_archivo.id_registro_origen           := p_id_registro_origen;
        vro_archivo.metadatos_json               := p_metadatos_json;
        vro_archivo.fecha_eliminacion            := NULL;
        vro_archivo.id_usuario_eliminacion       := NULL;
        vro_archivo.fecha_creacion               := CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE);
        vro_archivo.fecha_ultima_modificacion    := CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE);
        vro_archivo.id_usuario_ultima_modificacion := p_id_usuario_creacion;

        -- Inserción exclusiva a través del DAO
        PKGSMY_ARCHIVOS_DAO.p_insertar(vro_archivo);

        -- Control transaccional atómico
        COMMIT;

        p_mensaje_resultado := 'Archivo registrado y respaldado exitosamente con ID ' || p_id;
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            IF SQLCODE BETWEEN -20999 AND -20001 THEN
                RAISE;
            END IF;
            vro_error.nombre_programa     := 'PKGCN_ARCHIVOS';
            vro_error.nombre_metodo       := 'PR_REGISTRAR_ARCHIVO';
            vro_error.parametros          := 'p_id: ' || p_id || ', p_nombre_archivo: ' || p_nombre_archivo || ', p_nombre_almacenado: ' || p_nombre_archivo_almacenado;
            vro_error.id_usuario_creacion := p_id_usuario_creacion;
            uti_ge_excepciones_pkg.p_grabar_log(vro_error);
            RAISE_APPLICATION_ERROR(-20000, 'Se presento un error comunicarse con soporte. Número error: ' || vro_error.id || ' - ' || SQLERRM);
    END pr_registrar_archivo;

    -- 3. Borrado lógico (marcar archivo con estado no visible)
    PROCEDURE pr_borrar_archivo (
        p_id_archivo        IN  smy_archivos.id%TYPE,
        p_id_usuario        IN  smy_usuarios.id%TYPE,
        p_motivo            IN  VARCHAR2 DEFAULT NULL,
        p_mensaje_resultado OUT VARCHAR2
    )
    IS
        vro_archivo smy_archivos%ROWTYPE;
    BEGIN
        vro_archivo := PKGSMY_ARCHIVOS_DAO.f_traer(p_id_archivo);
        IF vro_archivo.id IS NULL THEN
            RAISE_APPLICATION_ERROR(-20001, 'El archivo solicitado (ID: ' || p_id_archivo || ') no existe.');
        END IF;

        IF vro_archivo.id_estado_archivo = 2 THEN
            p_mensaje_resultado := 'El archivo ya se encontraba marcado como no visible / eliminado.';
            RETURN;
        END IF;

        -- Actualizar a estado 2 (Eliminado / Papelera / No visible)
        vro_archivo.id_estado_archivo            := 2;
        vro_archivo.fecha_eliminacion            := CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE);
        vro_archivo.id_usuario_eliminacion       := p_id_usuario;
        vro_archivo.fecha_ultima_modificacion    := CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE);
        vro_archivo.id_usuario_ultima_modificacion := p_id_usuario;

        -- Actualizar vía DAO
        PKGSMY_ARCHIVOS_DAO.p_actualizar(vro_archivo);

        COMMIT;

        p_mensaje_resultado := 'Archivo ID ' || p_id_archivo || ' marcado como no visible exitosamente.';
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            IF SQLCODE BETWEEN -20999 AND -20001 THEN
                RAISE;
            END IF;
            vro_error.nombre_programa     := 'PKGCN_ARCHIVOS';
            vro_error.nombre_metodo       := 'PR_BORRAR_ARCHIVO';
            vro_error.parametros          := 'p_id_archivo: ' || p_id_archivo || ', p_id_usuario: ' || p_id_usuario || ', p_motivo: ' || p_motivo;
            vro_error.id_usuario_creacion := p_id_usuario;
            uti_ge_excepciones_pkg.p_grabar_log(vro_error);
            RAISE_APPLICATION_ERROR(-20000, 'Se presento un error comunicarse con soporte. Número error: ' || vro_error.id || ' - ' || SQLERRM);
    END pr_borrar_archivo;

    -- 4. Renombrar archivo lógicamente
    PROCEDURE pr_renombrar_archivo (
        p_id_archivo        IN  smy_archivos.id%TYPE,
        p_nuevo_nombre      IN  smy_archivos.nombre_archivo%TYPE,
        p_id_usuario        IN  smy_usuarios.id%TYPE,
        p_mensaje_resultado OUT VARCHAR2
    )
    IS
        vro_archivo smy_archivos%ROWTYPE;
    BEGIN
        IF p_nuevo_nombre IS NULL OR TRIM(p_nuevo_nombre) IS NULL THEN
            RAISE_APPLICATION_ERROR(-20001, 'El nuevo nombre del archivo no puede ser nulo o vacío.');
        END IF;

        vro_archivo := PKGSMY_ARCHIVOS_DAO.f_traer(p_id_archivo);
        IF vro_archivo.id IS NULL THEN
            RAISE_APPLICATION_ERROR(-20002, 'El archivo solicitado (ID: ' || p_id_archivo || ') no existe.');
        END IF;

        -- Actualizar nombre lógico y auditoría
        vro_archivo.nombre_archivo               := TRIM(p_nuevo_nombre);
        vro_archivo.fecha_ultima_modificacion    := CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE);
        vro_archivo.id_usuario_ultima_modificacion := p_id_usuario;

        PKGSMY_ARCHIVOS_DAO.p_actualizar(vro_archivo);

        COMMIT;

        p_mensaje_resultado := 'Archivo ID ' || p_id_archivo || ' renombrado exitosamente a "' || vro_archivo.nombre_archivo || '".';
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            IF SQLCODE BETWEEN -20999 AND -20001 THEN
                RAISE;
            END IF;
            vro_error.nombre_programa     := 'PKGCN_ARCHIVOS';
            vro_error.nombre_metodo       := 'PR_RENOMBRAR_ARCHIVO';
            vro_error.parametros          := 'p_id_archivo: ' || p_id_archivo || ', p_nuevo_nombre: ' || p_nuevo_nombre;
            vro_error.id_usuario_creacion := p_id_usuario;
            uti_ge_excepciones_pkg.p_grabar_log(vro_error);
            RAISE_APPLICATION_ERROR(-20000, 'Se presento un error comunicarse con soporte. Número error: ' || vro_error.id || ' - ' || SQLERRM);
    END pr_renombrar_archivo;

    -- 5. Copiar archivo (clonar referencia con nuevo ID y nuevo hash de ID)
    PROCEDURE pr_copiar_archivo (
        p_id_archivo_origen  IN  smy_archivos.id%TYPE,
        p_nuevo_id_residente IN  smy_residentes.id%TYPE DEFAULT NULL,
        p_nuevo_id_centro    IN  smy_centros.id%TYPE DEFAULT NULL,
        p_nuevo_nombre       IN  smy_archivos.nombre_archivo%TYPE DEFAULT NULL,
        p_id_usuario         IN  smy_usuarios.id%TYPE,
        p_id_nuevo_archivo   OUT smy_archivos.id%TYPE,
        p_mensaje_resultado  OUT VARCHAR2
    )
    IS
        vro_orig  smy_archivos%ROWTYPE;
        vro_nuevo smy_archivos%ROWTYPE;
    BEGIN
        vro_orig := PKGSMY_ARCHIVOS_DAO.f_traer(p_id_archivo_origen);
        IF vro_orig.id IS NULL THEN
            RAISE_APPLICATION_ERROR(-20001, 'El archivo origen a copiar (ID: ' || p_id_archivo_origen || ') no existe.');
        END IF;

        -- Obtener nuevo ID desde la secuencia
        SELECT SEQ_SMY_ARCHIVOS.NEXTVAL INTO p_id_nuevo_archivo FROM DUAL;

        -- Copiar metadatos base
        vro_nuevo := vro_orig;
        vro_nuevo.id                        := p_id_nuevo_archivo;
        vro_nuevo.nombre_archivo            := NVL(p_nuevo_nombre, 'Copia_' || vro_orig.nombre_archivo);
        -- El nombre almacenado DEBE ser el hash del nuevo ID + extensión
        vro_nuevo.nombre_archivo_almacenado := PKGLN_ARCHIVOS.fn_generar_nombre_almacenado(p_id_nuevo_archivo, vro_orig.extension);
        
        IF p_nuevo_id_residente IS NOT NULL THEN
            vro_nuevo.id_residente := p_nuevo_id_residente;
        END IF;
        IF p_nuevo_id_centro IS NOT NULL THEN
            vro_nuevo.id_centro := p_nuevo_id_centro;
        END IF;

        vro_nuevo.id_estado_archivo            := 1; -- Activo
        vro_nuevo.fecha_eliminacion            := NULL;
        vro_nuevo.id_usuario_eliminacion       := NULL;
        vro_nuevo.fecha_creacion               := CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE);
        vro_nuevo.fecha_ultima_modificacion    := CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE);
        vro_nuevo.id_usuario_ultima_modificacion := p_id_usuario;

        PKGSMY_ARCHIVOS_DAO.p_insertar(vro_nuevo);

        COMMIT;

        p_mensaje_resultado := 'Copia generada exitosamente con nuevo ID ' || p_id_nuevo_archivo;
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            IF SQLCODE BETWEEN -20999 AND -20001 THEN
                RAISE;
            END IF;
            vro_error.nombre_programa     := 'PKGCN_ARCHIVOS';
            vro_error.nombre_metodo       := 'PR_COPIAR_ARCHIVO';
            vro_error.parametros          := 'p_id_archivo_origen: ' || p_id_archivo_origen || ', p_nuevo_id_residente: ' || p_nuevo_id_residente;
            vro_error.id_usuario_creacion := p_id_usuario;
            uti_ge_excepciones_pkg.p_grabar_log(vro_error);
            RAISE_APPLICATION_ERROR(-20000, 'Se presento un error comunicarse con soporte. Número error: ' || vro_error.id || ' - ' || SQLERRM);
    END pr_copiar_archivo;

    -- 6. Restaurar archivo (revertir estado no visible a visible)
    PROCEDURE pr_restaurar_archivo (
        p_id_archivo        IN  smy_archivos.id%TYPE,
        p_id_usuario        IN  smy_usuarios.id%TYPE,
        p_mensaje_resultado OUT VARCHAR2
    )
    IS
        vro_archivo smy_archivos%ROWTYPE;
    BEGIN
        vro_archivo := PKGSMY_ARCHIVOS_DAO.f_traer(p_id_archivo);
        IF vro_archivo.id IS NULL THEN
            RAISE_APPLICATION_ERROR(-20001, 'El archivo solicitado (ID: ' || p_id_archivo || ') no existe.');
        END IF;

        vro_archivo.id_estado_archivo            := 1; -- 1 = Activo / Disponible
        vro_archivo.fecha_eliminacion            := NULL;
        vro_archivo.id_usuario_eliminacion       := NULL;
        vro_archivo.fecha_ultima_modificacion    := CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE);
        vro_archivo.id_usuario_ultima_modificacion := p_id_usuario;

        PKGSMY_ARCHIVOS_DAO.p_actualizar(vro_archivo);

        COMMIT;

        p_mensaje_resultado := 'Archivo ID ' || p_id_archivo || ' restaurado a visible exitosamente.';
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            IF SQLCODE BETWEEN -20999 AND -20001 THEN
                RAISE;
            END IF;
            vro_error.nombre_programa     := 'PKGCN_ARCHIVOS';
            vro_error.nombre_metodo       := 'PR_RESTAURAR_ARCHIVO';
            vro_error.parametros          := 'p_id_archivo: ' || p_id_archivo || ', p_id_usuario: ' || p_id_usuario;
            vro_error.id_usuario_creacion := p_id_usuario;
            uti_ge_excepciones_pkg.p_grabar_log(vro_error);
            RAISE_APPLICATION_ERROR(-20000, 'Se presento un error comunicarse con soporte. Número error: ' || vro_error.id || ' - ' || SQLERRM);
    END pr_restaurar_archivo;

    -- 7. Consultar archivos del residente (Cursor multi-fila)
    FUNCTION fn_consultar_archivos_residente (
        p_id_residente  IN smy_residentes.id%TYPE,
        p_solo_visibles IN NUMBER DEFAULT 1
    ) RETURN SYS_REFCURSOR
    IS
        l_cursor SYS_REFCURSOR;
    BEGIN
        OPEN l_cursor FOR
            SELECT a.id,
                   a.nombre_archivo,
                   a.nombre_archivo_almacenado,
                   a.hash_archivo,
                   a.ruta_relativa,
                   a.ruta_completa_almacenamiento,
                   a.extension,
                   a.tipo_mime,
                   a.tamano_bytes,
                   a.id_clase_archivo,
                   c.nombre_clase,
                   a.id_centro,
                   a.id_residente,
                   a.id_estado_archivo,
                   e.nombre_estado_archivo,
                   a.tabla_origen,
                   a.id_registro_origen,
                   a.metadatos_json,
                   a.fecha_creacion,
                   a.fecha_ultima_modificacion
              FROM smy_archivos a
              LEFT JOIN smy_clases_archivos c ON c.id = a.id_clase_archivo
              LEFT JOIN smy_estados_archivos e ON e.id = a.id_estado_archivo
             WHERE a.id_residente = p_id_residente
               AND (p_solo_visibles = 0 OR a.id_estado_archivo = 1)
             ORDER BY a.fecha_creacion DESC;

        RETURN l_cursor;
    END fn_consultar_archivos_residente;

    -- 8. Obtener archivo en formato JSON nativo CLOB
    FUNCTION fn_obtener_archivo_json (
        p_id_archivo IN smy_archivos.id%TYPE
    ) RETURN CLOB
    IS
        v_json CLOB;
    BEGIN
        SELECT JSON_OBJECT(
                   'id' VALUE a.id,
                   'nombre_archivo' VALUE a.nombre_archivo,
                   'nombre_archivo_almacenado' VALUE a.nombre_archivo_almacenado,
                   'hash_archivo' VALUE a.hash_archivo,
                   'ruta_relativa' VALUE a.ruta_relativa,
                   'ruta_completa_almacenamiento' VALUE a.ruta_completa_almacenamiento,
                   'extension' VALUE a.extension,
                   'tipo_mime' VALUE a.tipo_mime,
                   'tamano_bytes' VALUE a.tamano_bytes,
                   'id_clase_archivo' VALUE a.id_clase_archivo,
                   'id_centro' VALUE a.id_centro,
                   'id_residente' VALUE a.id_residente,
                   'id_estado_archivo' VALUE a.id_estado_archivo,
                   'tabla_origen' VALUE a.tabla_origen,
                   'id_registro_origen' VALUE a.id_registro_origen,
                   'metadatos_json' VALUE a.metadatos_json FORMAT JSON,
                   'fecha_eliminacion' VALUE TO_CHAR(a.fecha_eliminacion, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'fecha_creacion' VALUE TO_CHAR(a.fecha_creacion, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'id_usuario_ultima_modificacion' VALUE a.id_usuario_ultima_modificacion
                   RETURNING CLOB
               )
          INTO v_json
          FROM smy_archivos a
         WHERE a.id = p_id_archivo;

        RETURN v_json;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN NULL;
    END fn_obtener_archivo_json;

END PKGCN_ARCHIVOS;
/
