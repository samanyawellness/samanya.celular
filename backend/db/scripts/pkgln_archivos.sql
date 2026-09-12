-- =============================================================================
-- ESPECIFICACIÓN Y CUERPO: PKGLN_ARCHIVOS
-- FAMILIA: pkgln_ (Lógica funcional pura, algoritmos, cálculos y formateo)
-- ESTÁNDAR ARQUITECTÓNICO: oracle-plsql-architecture
-- REGLA ESTRICTA: Cero dependencias de tablas de negocio y cero DML.
-- =============================================================================

CREATE OR REPLACE PACKAGE PKGLN_ARCHIVOS
AS
    /*
    || =========================================================================
    || Paquete: PKGLN_ARCHIVOS
    || Propósito: Lógica pura y utilidades para manipulación y estructuración de 
    ||            archivos y rutas de almacenamiento (Google Drive y File Server).
    || =========================================================================
    */

    /**
     * Genera el nombre del archivo almacenado a partir del hash SHA-256
     * calculado sobre el ID numérico de la tabla SMY_ARCHIVOS + extensión.
     * Ejemplo: id=142, ext='.pdf' -> 'c51ce410c124a10e...pdf'
     */
    FUNCTION fn_generar_nombre_almacenado (
        p_id        IN NUMBER,
        p_extension IN VARCHAR2
    ) RETURN VARCHAR2;

    /**
     * Sanitiza una cadena para su uso seguro en rutas de Google Drive y filesystems.
     * Convierte tildes a vocales simples, pasa a mayúsculas y reemplaza espacios
     * o caracteres no alfanuméricos por guiones.
     */
    FUNCTION fn_sanitizar_cadena (
        p_cadena IN VARCHAR2
    ) RETURN VARCHAR2;

    /**
     * Normaliza y extrae la extensión asegurando que empiece con punto y en minúsculas.
     * Ejemplo: 'pdf' -> '.pdf', 'documento.PDF' -> '.pdf'
     */
    FUNCTION fn_normalizar_extension (
        p_nombre_o_ext IN VARCHAR2
    ) RETURN VARCHAR2;

    /**
     * Construye el nombre de directorio para la Sede / Centro Geriátrico.
     * Estructura: {id_sede}_{Nombre de Sede Sanitizado}
     * Ejemplo: 1, 'SEDE CENTRAL' -> '1_SEDE-CENTRAL'
     */
    FUNCTION fn_construir_ruta_sede (
        p_id_sede     IN NUMBER,
        p_nombre_sede IN VARCHAR2
    ) RETURN VARCHAR2;

    /**
     * Construye el nombre de directorio para el Residente.
     * Estructura: {id_residente}_{identificacion}
     * Ejemplo: 1, '19234567' -> '1_19234567'
     */
    FUNCTION fn_construir_ruta_residente (
        p_id_residente   IN NUMBER,
        p_identificacion IN VARCHAR2
    ) RETURN VARCHAR2;

    /**
     * Construye la ruta relativa completa jerárquica:
     * {id_sede}_{nombre_sede}/{id_residente}_{identificacion}/Documentos
     * Ejemplo: '1_SEDE-CENTRAL/1_19234567/Documentos'
     */
    FUNCTION fn_construir_ruta_documentos (
        p_id_sede        IN NUMBER,
        p_nombre_sede    IN VARCHAR2,
        p_id_residente   IN NUMBER,
        p_identificacion IN VARCHAR2
    ) RETURN VARCHAR2;

    /**
     * Determina el tipo MIME estándar a partir de la extensión del archivo.
     */
    FUNCTION fn_resolver_mime_type (
        p_extension IN VARCHAR2
    ) RETURN VARCHAR2;

    /**
     * Valida si la extensión pertenece a la lista de extensiones permitidas.
     */
    FUNCTION fn_validar_extension (
        p_extension         IN VARCHAR2,
        p_lista_permitidas  IN VARCHAR2 DEFAULT 'pdf,jpg,jpeg,png,docx,xlsx,txt'
    ) RETURN BOOLEAN;

END PKGLN_ARCHIVOS;
/

CREATE OR REPLACE PACKAGE BODY PKGLN_ARCHIVOS
AS
    vro_error smy_errores%ROWTYPE;

    -- 1. Generar nombre de archivo almacenado con hash SHA-256 del ID + extensión
    FUNCTION fn_generar_nombre_almacenado (
        p_id        IN NUMBER,
        p_extension IN VARCHAR2
    ) RETURN VARCHAR2
    IS
        v_extension_norm VARCHAR2(30);
        v_hash_id        VARCHAR2(128);
    BEGIN
        IF p_id IS NULL THEN
            RAISE_APPLICATION_ERROR(-20001, 'El ID de archivo no puede ser nulo para generar el nombre almacenado.');
        END IF;

        v_extension_norm := fn_normalizar_extension(p_extension);
        -- Cálculo del hash SHA-256 estándar nativo de Oracle sobre el ID numérico convertido a texto
        v_hash_id := LOWER(STANDARD_HASH(TO_CHAR(p_id), 'SHA256'));

        RETURN v_hash_id || v_extension_norm;
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLCODE BETWEEN -20999 AND -20001 THEN
                RAISE;
            END IF;
            vro_error.nombre_programa     := 'PKGLN_ARCHIVOS';
            vro_error.nombre_metodo       := 'FN_GENERAR_NOMBRE_ALMACENADO';
            vro_error.parametros          := 'p_id: ' || p_id || ', p_extension: ' || p_extension;
            uti_ge_excepciones_pkg.p_grabar_log(vro_error);
            RAISE_APPLICATION_ERROR(-20000, 'Se presento un error comunicarse con soporte. Número error: ' || vro_error.id || ' - ' || SQLERRM);
    END fn_generar_nombre_almacenado;

    -- 2. Sanitizar cadena para nombres de directorio y archivos
    FUNCTION fn_sanitizar_cadena (
        p_cadena IN VARCHAR2
    ) RETURN VARCHAR2
    IS
        v_limpio VARCHAR2(500);
    BEGIN
        IF p_cadena IS NULL THEN
            RETURN 'DESCONOCIDO';
        END IF;

        -- Reemplazar tildes y caracteres acentuados
        v_limpio := TRANSLATE(
            UPPER(TRIM(p_cadena)),
            'ÁÉÍÓÚÀÈÌÒÙÄËÏÖÜÂÊÎÔÛÑÇ',
            'AEIOUAEIOUAEIOUAEIOUNC'
        );

        -- Reemplazar caracteres no alfanuméricos por guion
        v_limpio := REGEXP_REPLACE(v_limpio, '[^A-Z0-9_-]+', '-');
        -- Eliminar guiones duplicados consecutivos
        v_limpio := REGEXP_REPLACE(v_limpio, '-+', '-');
        -- Eliminar guiones al inicio o al final
        v_limpio := REGEXP_REPLACE(v_limpio, '^-|-$', '');

        IF v_limpio IS NULL OR LENGTH(v_limpio) = 0 THEN
            v_limpio := 'GENERAL';
        END IF;

        RETURN v_limpio;
    EXCEPTION
        WHEN OTHERS THEN
            vro_error.nombre_programa     := 'PKGLN_ARCHIVOS';
            vro_error.nombre_metodo       := 'FN_SANITIZAR_CADENA';
            vro_error.parametros          := 'p_cadena: ' || SUBSTR(p_cadena, 1, 200);
            uti_ge_excepciones_pkg.p_grabar_log(vro_error);
            RAISE_APPLICATION_ERROR(-20000, 'Se presento un error comunicarse con soporte. Número error: ' || vro_error.id || ' - ' || SQLERRM);
    END fn_sanitizar_cadena;

    -- 3. Normalizar extensión (.ext)
    FUNCTION fn_normalizar_extension (
        p_nombre_o_ext IN VARCHAR2
    ) RETURN VARCHAR2
    IS
        v_pos_punto NUMBER;
        v_ext       VARCHAR2(30);
    BEGIN
        IF p_nombre_o_ext IS NULL THEN
            RETURN '.bin';
        END IF;

        v_pos_punto := INSTR(p_nombre_o_ext, '.', -1);
        IF v_pos_punto > 0 THEN
            v_ext := SUBSTR(p_nombre_o_ext, v_pos_punto);
        ELSE
            v_ext := '.' || p_nombre_o_ext;
        END IF;

        RETURN LOWER(TRIM(v_ext));
    EXCEPTION
        WHEN OTHERS THEN
            vro_error.nombre_programa     := 'PKGLN_ARCHIVOS';
            vro_error.nombre_metodo       := 'FN_NORMALIZAR_EXTENSION';
            vro_error.parametros          := 'p_nombre_o_ext: ' || p_nombre_o_ext;
            uti_ge_excepciones_pkg.p_grabar_log(vro_error);
            RAISE_APPLICATION_ERROR(-20000, 'Se presento un error comunicarse con soporte. Número error: ' || vro_error.id || ' - ' || SQLERRM);
    END fn_normalizar_extension;

    -- 4. Construir ruta de sede: {id_sede}_{Nombre Sede Sanitizado}
    FUNCTION fn_construir_ruta_sede (
        p_id_sede     IN NUMBER,
        p_nombre_sede IN VARCHAR2
    ) RETURN VARCHAR2
    IS
    BEGIN
        RETURN p_id_sede || '_' || fn_sanitizar_cadena(p_nombre_sede);
    END fn_construir_ruta_sede;

    -- 5. Construir ruta de residente: {id_residente}_{identificacion}
    FUNCTION fn_construir_ruta_residente (
        p_id_residente   IN NUMBER,
        p_identificacion IN VARCHAR2
    ) RETURN VARCHAR2
    IS
    BEGIN
        RETURN p_id_residente || '_' || fn_sanitizar_cadena(p_identificacion);
    END fn_construir_ruta_residente;

    -- 6. Construir ruta completa jerárquica
    FUNCTION fn_construir_ruta_documentos (
        p_id_sede        IN NUMBER,
        p_nombre_sede    IN VARCHAR2,
        p_id_residente   IN NUMBER,
        p_identificacion IN VARCHAR2
    ) RETURN VARCHAR2
    IS
    BEGIN
        RETURN fn_construir_ruta_sede(p_id_sede, p_nombre_sede)
               || '/'
               || fn_construir_ruta_residente(p_id_residente, p_identificacion)
               || '/Documentos';
    END fn_construir_ruta_documentos;

    -- 7. Resolver MIME Type
    FUNCTION fn_resolver_mime_type (
        p_extension IN VARCHAR2
    ) RETURN VARCHAR2
    IS
        v_ext VARCHAR2(30);
    BEGIN
        v_ext := fn_normalizar_extension(p_extension);

        CASE v_ext
            WHEN '.pdf'  THEN RETURN 'application/pdf';
            WHEN '.jpg'  THEN RETURN 'image/jpeg';
            WHEN '.jpeg' THEN RETURN 'image/jpeg';
            WHEN '.png'  THEN RETURN 'image/png';
            WHEN '.gif'  THEN RETURN 'image/gif';
            WHEN '.webp' THEN RETURN 'image/webp';
            WHEN '.docx' THEN RETURN 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            WHEN '.doc'  THEN RETURN 'application/msword';
            WHEN '.xlsx' THEN RETURN 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            WHEN '.xls'  THEN RETURN 'application/vnd.ms-excel';
            WHEN '.txt'  THEN RETURN 'text/plain';
            WHEN '.csv'  THEN RETURN 'text/csv';
            WHEN '.zip'  THEN RETURN 'application/zip';
            ELSE              RETURN 'application/octet-stream';
        END CASE;
    END fn_resolver_mime_type;

    -- 8. Validar extensión permitida
    FUNCTION fn_validar_extension (
        p_extension         IN VARCHAR2,
        p_lista_permitidas  IN VARCHAR2 DEFAULT 'pdf,jpg,jpeg,png,docx,xlsx,txt'
    ) RETURN BOOLEAN
    IS
        v_ext        VARCHAR2(30);
        v_ext_limpia VARCHAR2(30);
    BEGIN
        v_ext := fn_normalizar_extension(p_extension);
        v_ext_limpia := LTRIM(v_ext, '.');

        IF INSTR(',' || LOWER(p_lista_permitidas) || ',', ',' || v_ext_limpia || ',') > 0 THEN
            RETURN TRUE;
        ELSE
            RETURN FALSE;
        END IF;
    END fn_validar_extension;

END PKGLN_ARCHIVOS;
/
