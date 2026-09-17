-- =============================================================================
-- ESPECIFICACIÓN Y CUERPO DAO: PKGSMY_SOLICITUDES_ADMISION_DAO
-- TABLA: SMY_SOLICITUDES_ADMISION
-- ESTÁNDAR ARQUITECTÓNICO: oracle-plsql-architecture (Plantilla oficial 18 métodos)
-- =============================================================================

CREATE OR REPLACE PACKAGE PKGSMY_SOLICITUDES_ADMISION_DAO
AS
    /*
    || =========================================================================
    || Paquete: PKGSMY_SOLICITUDES_ADMISION_DAO
    || Propósito: Capa de acceso a datos exclusiva para la tabla SMY_SOLICITUDES_ADMISION
    || Estándar: Plantilla oficial DAO PL/SQL Oracle
    || =========================================================================
    */

    -- Tipo de colección estándar para registros de la tabla
    TYPE ta_smy_solicitudes_admision IS TABLE OF smy_solicitudes_admision%ROWTYPE INDEX BY BINARY_INTEGER;

    -- 1. Insertar registro
    PROCEDURE p_insertar (
        pro_smy_solicitudes_admision IN smy_solicitudes_admision%ROWTYPE
    );

    -- 2. Traer registro por PK
    FUNCTION f_traer (
        pty_id IN smy_solicitudes_admision.id%TYPE
    ) RETURN smy_solicitudes_admision%ROWTYPE;

    -- 3. Consultar todos los registros
    PROCEDURE p_consultar_registros (
        pta_smy_solicitudes_admision OUT PKGSMY_SOLICITUDES_ADMISION_DAO.ta_smy_solicitudes_admision
    );

    -- 4. Eliminar por ROWID
    PROCEDURE p_eliminar_rowid (
        p_rowid IN VARCHAR2
    );

    -- 5. Eliminar por PK
    PROCEDURE p_eliminar (
        pty_id IN smy_solicitudes_admision.id%TYPE
    );

    -- 6. Eliminar todos los registros
    PROCEDURE p_eliminar_registros;

    -- 7. Verificar existencia por PK
    FUNCTION f_existe (
        pty_id IN smy_solicitudes_admision.id%TYPE
    ) RETURN BOOLEAN;

    -- 8. Verificar existencia y retornar registro
    FUNCTION f_existe (
        pty_id       IN  smy_solicitudes_admision.id%TYPE,
        pro_smy_solicitudes_admision  OUT smy_solicitudes_admision%ROWTYPE
    ) RETURN BOOLEAN;

    -- 9. Verificar existencia, retornar registro y ROWID
    FUNCTION f_existe (
        pty_id       IN  smy_solicitudes_admision.id%TYPE,
        pro_smy_solicitudes_admision  OUT smy_solicitudes_admision%ROWTYPE,
        p_rowid      OUT VARCHAR2
    ) RETURN BOOLEAN;

    -- 10. Verificar existencia por ROWID
    FUNCTION f_existe_rowid (
        p_rowid IN VARCHAR2
    ) RETURN BOOLEAN;

    -- 11. Verificar existencia por ROWID y retornar registro
    FUNCTION f_existe_rowid (
        p_rowid      IN  VARCHAR2,
        pro_smy_solicitudes_admision  OUT smy_solicitudes_admision%ROWTYPE
    ) RETURN BOOLEAN;

    -- 12. Actualizar por registro
    PROCEDURE p_actualizar (
        pro_smy_solicitudes_admision IN smy_solicitudes_admision%ROWTYPE
    );

    -- 13. Actualizar indicando PK
    PROCEDURE p_actualizar (
        pro_smy_solicitudes_admision IN smy_solicitudes_admision%ROWTYPE,
        pty_id      IN smy_solicitudes_admision.id%TYPE
    );

    -- 14. Actualizar por ROWID
    PROCEDURE p_actualizar_rowid (
        pro_smy_solicitudes_admision IN smy_solicitudes_admision%ROWTYPE,
        p_rowid     IN VARCHAR2
    );

    -- 15. Actualizar todos los registros
    PROCEDURE p_actualizar_registros (
        pro_smy_solicitudes_admision IN smy_solicitudes_admision%ROWTYPE
    );

    -- 16. Obtener valores por defecto
    PROCEDURE p_valores_defecto (
        pro_smy_solicitudes_admision IN OUT smy_solicitudes_admision%ROWTYPE
    );

    -- 17. Verificar existencia y retornar JSON
    FUNCTION f_existe_json (
        p_id            IN  smy_solicitudes_admision.id%TYPE,
        p_json_smy_solicitudes_admision  OUT CLOB
    ) RETURN NUMBER;

    -- 18. Obtener JSON por PK (Retorna CLOB nativo)
    FUNCTION f_json (
        p_id IN smy_solicitudes_admision.id%TYPE
    ) RETURN CLOB;

END PKGSMY_SOLICITUDES_ADMISION_DAO;
/

CREATE OR REPLACE PACKAGE BODY PKGSMY_SOLICITUDES_ADMISION_DAO
AS
    /*
    || =========================================================================
    || Paquete: PKGSMY_SOLICITUDES_ADMISION_DAO (Body)
    || Propósito: Implementación de operaciones CRUD para SMY_SOLICITUDES_ADMISION
    || Reglas: Sin COMMIT/ROLLBACK, sin lógica de negocio, manejo nativo de JSON
    || =========================================================================
    */

    -- 1. Insertar
    PROCEDURE p_insertar (
        pro_smy_solicitudes_admision IN smy_solicitudes_admision%ROWTYPE
    )
    IS
    BEGIN
        INSERT INTO smy_solicitudes_admision VALUES pro_smy_solicitudes_admision;
    END p_insertar;

    -- 2. Traer por PK
    FUNCTION f_traer (
        pty_id IN smy_solicitudes_admision.id%TYPE
    ) RETURN smy_solicitudes_admision%ROWTYPE
    IS
        v_registro smy_solicitudes_admision%ROWTYPE;
    BEGIN
        SELECT *
          INTO v_registro
          FROM smy_solicitudes_admision
         WHERE id = pty_id;

        RETURN v_registro;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN NULL;
    END f_traer;

    -- 3. Consultar todos los registros
    PROCEDURE p_consultar_registros (
        pta_smy_solicitudes_admision OUT PKGSMY_SOLICITUDES_ADMISION_DAO.ta_smy_solicitudes_admision
    )
    IS
    BEGIN
        SELECT *
          BULK COLLECT INTO pta_smy_solicitudes_admision
          FROM smy_solicitudes_admision;
    END p_consultar_registros;

    -- 4. Eliminar por ROWID
    PROCEDURE p_eliminar_rowid (
        p_rowid IN VARCHAR2
    )
    IS
    BEGIN
        DELETE FROM smy_solicitudes_admision
         WHERE ROWID = CHARTOROWID(p_rowid);
    END p_eliminar_rowid;

    -- 5. Eliminar por PK
    PROCEDURE p_eliminar (
        pty_id IN smy_solicitudes_admision.id%TYPE
    )
    IS
    BEGIN
        DELETE FROM smy_solicitudes_admision
         WHERE id = pty_id;
    END p_eliminar;

    -- 6. Eliminar todos los registros
    PROCEDURE p_eliminar_registros
    IS
    BEGIN
        DELETE FROM smy_solicitudes_admision;
    END p_eliminar_registros;

    -- 7. Verificar existencia por PK
    FUNCTION f_existe (
        pty_id IN smy_solicitudes_admision.id%TYPE
    ) RETURN BOOLEAN
    IS
        v_dummy NUMBER;
    BEGIN
        SELECT 1
          INTO v_dummy
          FROM smy_solicitudes_admision
         WHERE id = pty_id;

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe;

    -- 8. Verificar existencia y retornar registro
    FUNCTION f_existe (
        pty_id       IN  smy_solicitudes_admision.id%TYPE,
        pro_smy_solicitudes_admision  OUT smy_solicitudes_admision%ROWTYPE
    ) RETURN BOOLEAN
    IS
    BEGIN
        SELECT *
          INTO pro_smy_solicitudes_admision
          FROM smy_solicitudes_admision
         WHERE id = pty_id;

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe;

    -- 9. Verificar existencia, retornar registro y ROWID
    FUNCTION f_existe (
        pty_id       IN  smy_solicitudes_admision.id%TYPE,
        pro_smy_solicitudes_admision  OUT smy_solicitudes_admision%ROWTYPE,
        p_rowid      OUT VARCHAR2
    ) RETURN BOOLEAN
    IS
    BEGIN
        SELECT ROWIDTOCHAR(ROWID)
          INTO p_rowid
          FROM smy_solicitudes_admision
         WHERE id = pty_id;

        SELECT *
          INTO pro_smy_solicitudes_admision
          FROM smy_solicitudes_admision
         WHERE ROWID = CHARTOROWID(p_rowid);

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe;

    -- 10. Verificar existencia por ROWID
    FUNCTION f_existe_rowid (
        p_rowid IN VARCHAR2
    ) RETURN BOOLEAN
    IS
        v_dummy NUMBER;
    BEGIN
        SELECT 1
          INTO v_dummy
          FROM smy_solicitudes_admision
         WHERE ROWID = CHARTOROWID(p_rowid);

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe_rowid;

    -- 11. Verificar existencia por ROWID y retornar registro
    FUNCTION f_existe_rowid (
        p_rowid      IN  VARCHAR2,
        pro_smy_solicitudes_admision  OUT smy_solicitudes_admision%ROWTYPE
    ) RETURN BOOLEAN
    IS
    BEGIN
        SELECT *
          INTO pro_smy_solicitudes_admision
          FROM smy_solicitudes_admision
         WHERE ROWID = CHARTOROWID(p_rowid);

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe_rowid;

    -- 12. Actualizar por registro
    PROCEDURE p_actualizar (
        pro_smy_solicitudes_admision IN smy_solicitudes_admision%ROWTYPE
    )
    IS
    BEGIN
        UPDATE smy_solicitudes_admision
           SET ROW = pro_smy_solicitudes_admision
         WHERE id = pro_smy_solicitudes_admision.id;
    END p_actualizar;

    -- 13. Actualizar indicando PK
    PROCEDURE p_actualizar (
        pro_smy_solicitudes_admision IN smy_solicitudes_admision%ROWTYPE,
        pty_id      IN smy_solicitudes_admision.id%TYPE
    )
    IS
    BEGIN
        UPDATE smy_solicitudes_admision
           SET ROW = pro_smy_solicitudes_admision
         WHERE id = pty_id;
    END p_actualizar;

    -- 14. Actualizar por ROWID
    PROCEDURE p_actualizar_rowid (
        pro_smy_solicitudes_admision IN smy_solicitudes_admision%ROWTYPE,
        p_rowid     IN VARCHAR2
    )
    IS
    BEGIN
        UPDATE smy_solicitudes_admision
           SET ROW = pro_smy_solicitudes_admision
         WHERE ROWID = CHARTOROWID(p_rowid);
    END p_actualizar_rowid;

    -- 15. Actualizar todos los registros
    PROCEDURE p_actualizar_registros (
        pro_smy_solicitudes_admision IN smy_solicitudes_admision%ROWTYPE
    )
    IS
    BEGIN
        UPDATE smy_solicitudes_admision
           SET ROW = pro_smy_solicitudes_admision;
    END p_actualizar_registros;

    -- 16. Obtener valores por defecto
    PROCEDURE p_valores_defecto (
        pro_smy_solicitudes_admision IN OUT smy_solicitudes_admision%ROWTYPE
    )
    IS
    BEGIN
        pro_smy_solicitudes_admision.fecha_creacion := NVL(pro_smy_solicitudes_admision.fecha_creacion, CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE));
        -- pro_smy_solicitudes_admision.id_estado_solicitud_adm := NVL(pro_smy_solicitudes_admision.id_estado_solicitud_adm, 1);
    END p_valores_defecto;

    -- 17. Verificar existencia y retornar JSON
    FUNCTION f_existe_json (
        p_id            IN  smy_solicitudes_admision.id%TYPE,
        p_json_smy_solicitudes_admision  OUT CLOB
    ) RETURN NUMBER
    IS
    BEGIN
        SELECT JSON_OBJECT(
                   'id' VALUE t.id,
                   'id_centro' VALUE t.id_centro,
                   'nombre_completo' VALUE t.nombre_completo,
                   'fecha_nacimiento' VALUE TO_CHAR(t.fecha_nacimiento, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'id_genero' VALUE t.id_genero,
                   'habitacion_pref' VALUE t.habitacion_pref,
                   'cama_pref' VALUE t.cama_pref,
                   'id_nivel_movilidad' VALUE t.id_nivel_movilidad,
                   'id_tipo_dieta' VALUE t.id_tipo_dieta,
                   'alertas_clinicas' VALUE t.alertas_clinicas,
                   'fecha_deseada' VALUE TO_CHAR(t.fecha_deseada, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'id_estado_solicitud_adm' VALUE t.id_estado_solicitud_adm,
                   'notas_adicionales' VALUE t.notas_adicionales,
                   'id_residente_creado' VALUE t.id_residente_creado,
                   'id_usuario_reviso' VALUE t.id_usuario_reviso,
                   'fecha_revision' VALUE TO_CHAR(t.fecha_revision, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'fecha_creacion' VALUE TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'id_usuario_ultima_modificacion' VALUE t.id_usuario_ultima_modificacion
                   RETURNING CLOB
               )
          INTO p_json_smy_solicitudes_admision
          FROM smy_solicitudes_admision t
         WHERE t.id = p_id;

        RETURN 1;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            p_json_smy_solicitudes_admision := NULL;
            RETURN 0;
    END f_existe_json;

    -- 18. Obtener JSON por PK (Retorna CLOB nativo)
    FUNCTION f_json (
        p_id IN smy_solicitudes_admision.id%TYPE
    ) RETURN CLOB
    IS
        v_json CLOB;
    BEGIN
        SELECT JSON_OBJECT(
                   'id' VALUE t.id,
                   'id_centro' VALUE t.id_centro,
                   'nombre_completo' VALUE t.nombre_completo,
                   'fecha_nacimiento' VALUE TO_CHAR(t.fecha_nacimiento, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'id_genero' VALUE t.id_genero,
                   'habitacion_pref' VALUE t.habitacion_pref,
                   'cama_pref' VALUE t.cama_pref,
                   'id_nivel_movilidad' VALUE t.id_nivel_movilidad,
                   'id_tipo_dieta' VALUE t.id_tipo_dieta,
                   'alertas_clinicas' VALUE t.alertas_clinicas,
                   'fecha_deseada' VALUE TO_CHAR(t.fecha_deseada, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'id_estado_solicitud_adm' VALUE t.id_estado_solicitud_adm,
                   'notas_adicionales' VALUE t.notas_adicionales,
                   'id_residente_creado' VALUE t.id_residente_creado,
                   'id_usuario_reviso' VALUE t.id_usuario_reviso,
                   'fecha_revision' VALUE TO_CHAR(t.fecha_revision, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'fecha_creacion' VALUE TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'id_usuario_ultima_modificacion' VALUE t.id_usuario_ultima_modificacion
                   RETURNING CLOB
               )
          INTO v_json
          FROM smy_solicitudes_admision t
         WHERE t.id = p_id;

        RETURN v_json;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN NULL;
    END f_json;

END PKGSMY_SOLICITUDES_ADMISION_DAO;
/
