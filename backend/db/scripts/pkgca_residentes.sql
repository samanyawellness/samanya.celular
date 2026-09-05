-- =============================================================================
-- ESPECIFICACIÓN Y CUERPO: PKGCA_RESIDENTES
-- FAMILIA: pkgca_ (Consultas avanzadas, filtros multi-criterio, SYS_REFCURSOR y JSON nativo)
-- ESTÁNDAR ARQUITECTÓNICO: oracle-plsql-architecture
-- =============================================================================

CREATE OR REPLACE PACKAGE PKGCA_RESIDENTES
AS
    /**
     * Retorna cursor multi-fila con censo de residentes activos filtrados por habitación o estado
     */
    PROCEDURE p_consultar_censo (
        p_id_estado        IN  smy_residentes.id_estado_residente%TYPE DEFAULT NULL,
        p_filtro_texto     IN  VARCHAR2 DEFAULT NULL,
        p_cursor           OUT SYS_REFCURSOR
    );

    /**
     * Retorna detalle clínico y general de un residente en formato JSON nativo (CLOB)
     * Utiliza JSON_OBJECT / JSON_ARRAYAGG RETURNING CLOB sin concatenación de cadenas.
     */
    FUNCTION f_obtener_ficha_json (
        p_id_residente     IN  smy_residentes.id%TYPE
    ) RETURN CLOB;

END PKGCA_RESIDENTES;
/

CREATE OR REPLACE PACKAGE BODY PKGCA_RESIDENTES
AS

    PROCEDURE p_consultar_censo (
        p_id_estado        IN  smy_residentes.id_estado_residente%TYPE DEFAULT NULL,
        p_filtro_texto     IN  VARCHAR2 DEFAULT NULL,
        p_cursor           OUT SYS_REFCURSOR
    ) IS
    BEGIN
        OPEN p_cursor FOR
            SELECT 
                r.id,
                r.codigo_expediente,
                r.identificacion,
                r.nombres,
                r.apellidos,
                r.nombres || ' ' || r.apellidos AS nombre_completo,
                TRUNC(MONTHS_BETWEEN(SYSDATE, r.fecha_nacimiento) / 12) AS edad,
                r.habitacion,
                r.cama,
                r.foto_url,
                m.nombre_nivel_movilidad AS nivel_movilidad,
                d.nombre_tipo_dieta AS tipo_dieta,
                r.alertas_clinicas,
                e.nombre_estado_residente AS estado
            FROM smy_residentes r
            INNER JOIN smy_estados_residentes e ON r.id_estado_residente = e.id
            LEFT JOIN smy_niveles_movilidad m ON r.id_nivel_movilidad = m.id
            LEFT JOIN smy_tipos_dietas d ON r.id_tipo_dieta = d.id
            WHERE (p_id_estado IS NULL OR r.id_estado_residente = p_id_estado)
              AND (p_filtro_texto IS NULL OR (
                    UPPER(r.nombres) LIKE '%' || UPPER(p_filtro_texto) || '%' OR
                    UPPER(r.apellidos) LIKE '%' || UPPER(p_filtro_texto) || '%' OR
                    UPPER(r.habitacion) LIKE '%' || UPPER(p_filtro_texto) || '%' OR
                    UPPER(r.cama) LIKE '%' || UPPER(p_filtro_texto) || '%'
                  ))
            ORDER BY r.habitacion, r.cama;
    END p_consultar_censo;

    FUNCTION f_obtener_ficha_json (
        p_id_residente     IN  smy_residentes.id%TYPE
    ) RETURN CLOB IS
        vcl_resultado CLOB;
    BEGIN
        SELECT JSON_OBJECT(
            'id'                  VALUE r.id,
            'codigoExpediente'    VALUE r.codigo_expediente,
            'identificacion'      VALUE r.identificacion,
            'nombres'             VALUE r.nombres,
            'apellidos'           VALUE r.apellidos,
            'nombreCompleto'      VALUE r.nombres || ' ' || r.apellidos,
            'edad'                VALUE TRUNC(MONTHS_BETWEEN(SYSDATE, r.fecha_nacimiento) / 12),
            'fechaNacimiento'     VALUE TO_CHAR(r.fecha_nacimiento, 'YYYY-MM-DD'),
            'habitacion'          VALUE r.habitacion,
            'cama'                VALUE r.cama,
            'fotoUrl'             VALUE r.foto_url,
            'eps'                 VALUE r.eps,
            'planComplementario'  VALUE r.plan_complementario,
            'tipoSangre'          VALUE r.tipo_sangre,
            'movilidad'           VALUE m.nombre_nivel_movilidad,
            'dieta'               VALUE d.nombre_tipo_dieta,
            'alertasClinicas'     VALUE r.alertas_clinicas,
            'estado'              VALUE e.nombre_estado_residente,
            'fechaIngreso'        VALUE TO_CHAR(r.fecha_ingreso, 'YYYY-MM-DD'),
            'responsables'        VALUE (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id'            VALUE a.id,
                        'nombres'       VALUE a.nombres,
                        'apellidos'     VALUE a.apellidos,
                        'parentesco'    VALUE p.nombre_parentesco,
                        'telefono'      VALUE a.telefono_principal,
                        'email'         VALUE a.email
                    ) RETURNING CLOB
                )
                FROM smy_residentes_acudientes ra
                INNER JOIN smy_acudientes a ON ra.id_acudiente = a.id
                INNER JOIN smy_parentescos p ON ra.id_parentesco = p.id
                WHERE ra.id_residente = r.id
            )
            RETURNING CLOB
        )
        INTO vcl_resultado
        FROM smy_residentes r
        INNER JOIN smy_estados_residentes e ON r.id_estado_residente = e.id
        LEFT JOIN smy_niveles_movilidad m ON r.id_nivel_movilidad = m.id
        LEFT JOIN smy_tipos_dietas d ON r.id_tipo_dieta = d.id
        WHERE r.id = p_id_residente;

        RETURN vcl_resultado;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN NULL;
    END f_obtener_ficha_json;

END PKGCA_RESIDENTES;
/
