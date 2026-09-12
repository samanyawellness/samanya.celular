-- =============================================================================
-- ESPECIFICACIÓN Y CUERPO: PKGCA_SMY_ARCHIVOS
-- FAMILIA: pkgca_ (Consultas avanzadas, filtros multi-criterio, SYS_REFCURSOR y JSON nativo)
-- ESTÁNDAR ARQUITECTÓNICO: oracle-plsql-architecture
-- =============================================================================

CREATE OR REPLACE PACKAGE PKGCA_SMY_ARCHIVOS
AS
    /*
    || =========================================================================
    || Paquete: PKGCA_SMY_ARCHIVOS
    || Propósito: Consultas, filtros multi-criterio y representación JSON para SMY_ARCHIVOS.
    || Estándar: oracle-plsql-architecture (Familia pkgca_)
    || =========================================================================
    */

    -- Retorna cursor SYS_REFCURSOR con los archivos de un residente filtrando por estado visible
    FUNCTION fn_consultar_archivos_residente (
        p_id_residente  IN smy_residentes.id%TYPE,
        p_solo_visibles IN NUMBER DEFAULT 1
    ) RETURN SYS_REFCURSOR;

    -- Retorna la ficha completa del archivo en formato JSON nativo CLOB
    FUNCTION fn_obtener_archivo_json (
        p_id_archivo IN smy_archivos.id%TYPE
    ) RETURN CLOB;

END PKGCA_SMY_ARCHIVOS;
/

CREATE OR REPLACE PACKAGE BODY PKGCA_SMY_ARCHIVOS
AS

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

END PKGCA_SMY_ARCHIVOS;
/
