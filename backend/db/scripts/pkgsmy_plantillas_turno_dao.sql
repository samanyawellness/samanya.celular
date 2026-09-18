-- =============================================================================
-- ESPECIFICACIÓN Y CUERPO DAO: PKGSMY_PLANTILLAS_TURNO_DAO
-- TABLA: SMY_PLANTILLAS_TURNO
-- ESTÁNDAR ARQUITECTÓNICO: oracle-plsql-architecture (Plantilla oficial 18 métodos)
-- =============================================================================

CREATE OR REPLACE PACKAGE PKGSMY_PLANTILLAS_TURNO_DAO
AS
    /*
    || =========================================================================
    || Paquete: PKGSMY_PLANTILLAS_TURNO_DAO
    || Propósito: Capa de acceso a datos exclusiva para la tabla SMY_PLANTILLAS_TURNO
    || Estándar: Plantilla oficial DAO PL/SQL Oracle
    || =========================================================================
    */

    -- Tipo de colección estándar para registros de la tabla
    TYPE ta_smy_plantillas_turno IS TABLE OF smy_plantillas_turno%ROWTYPE INDEX BY BINARY_INTEGER;

    -- 1. Insertar registro
    PROCEDURE p_insertar (
        pro_smy_plantillas_turno IN smy_plantillas_turno%ROWTYPE
    );

    -- 2. Traer registro por PK
    FUNCTION f_traer (
        pty_id IN smy_plantillas_turno.id%TYPE
    ) RETURN smy_plantillas_turno%ROWTYPE;

    -- 3. Consultar todos los registros
    PROCEDURE p_consultar_registros (
        pta_smy_plantillas_turno OUT PKGSMY_PLANTILLAS_TURNO_DAO.ta_smy_plantillas_turno
    );

    -- 4. Eliminar por ROWID
    PROCEDURE p_eliminar_rowid (
        p_rowid IN VARCHAR2
    );

    -- 5. Eliminar por PK
    PROCEDURE p_eliminar (
        pty_id IN smy_plantillas_turno.id%TYPE
    );

    -- 6. Eliminar todos los registros
    PROCEDURE p_eliminar_registros;

    -- 7. Verificar existencia por PK
    FUNCTION f_existe (
        pty_id IN smy_plantillas_turno.id%TYPE
    ) RETURN BOOLEAN;

    -- 8. Verificar existencia y retornar registro
    FUNCTION f_existe (
        pty_id       IN  smy_plantillas_turno.id%TYPE,
        pro_smy_plantillas_turno  OUT smy_plantillas_turno%ROWTYPE
    ) RETURN BOOLEAN;

    -- 9. Verificar existencia, retornar registro y ROWID
    FUNCTION f_existe (
        pty_id       IN  smy_plantillas_turno.id%TYPE,
        pro_smy_plantillas_turno  OUT smy_plantillas_turno%ROWTYPE,
        p_rowid      OUT VARCHAR2
    ) RETURN BOOLEAN;

    -- 10. Verificar existencia por ROWID
    FUNCTION f_existe_rowid (
        p_rowid IN VARCHAR2
    ) RETURN BOOLEAN;

    -- 11. Verificar existencia por ROWID y retornar registro
    FUNCTION f_existe_rowid (
        p_rowid      IN  VARCHAR2,
        pro_smy_plantillas_turno  OUT smy_plantillas_turno%ROWTYPE
    ) RETURN BOOLEAN;

    -- 12. Actualizar por registro
    PROCEDURE p_actualizar (
        pro_smy_plantillas_turno IN smy_plantillas_turno%ROWTYPE
    );

    -- 13. Actualizar indicando PK
    PROCEDURE p_actualizar (
        pro_smy_plantillas_turno IN smy_plantillas_turno%ROWTYPE,
        pty_id      IN smy_plantillas_turno.id%TYPE
    );

    -- 14. Actualizar por ROWID
    PROCEDURE p_actualizar_rowid (
        pro_smy_plantillas_turno IN smy_plantillas_turno%ROWTYPE,
        p_rowid     IN VARCHAR2
    );

    -- 15. Actualizar todos los registros
    PROCEDURE p_actualizar_registros (
        pro_smy_plantillas_turno IN smy_plantillas_turno%ROWTYPE
    );

    -- 16. Obtener valores por defecto
    PROCEDURE p_valores_defecto (
        pro_smy_plantillas_turno IN OUT smy_plantillas_turno%ROWTYPE
    );

    -- 17. Verificar existencia y retornar JSON
    FUNCTION f_existe_json (
        p_id            IN  smy_plantillas_turno.id%TYPE,
        p_json_smy_plantillas_turno  OUT CLOB
    ) RETURN NUMBER;

    -- 18. Obtener JSON por PK (Retorna CLOB nativo)
    FUNCTION f_json (
        p_id IN smy_plantillas_turno.id%TYPE
    ) RETURN CLOB;

END PKGSMY_PLANTILLAS_TURNO_DAO;
/

CREATE OR REPLACE PACKAGE BODY PKGSMY_PLANTILLAS_TURNO_DAO
AS
    /*
    || =========================================================================
    || Paquete: PKGSMY_PLANTILLAS_TURNO_DAO (Body)
    || Propósito: Implementación de operaciones CRUD para SMY_PLANTILLAS_TURNO
    || Reglas: Sin COMMIT/ROLLBACK, sin lógica de negocio, manejo nativo de JSON
    || =========================================================================
    */

    -- 1. Insertar
    PROCEDURE p_insertar (
        pro_smy_plantillas_turno IN smy_plantillas_turno%ROWTYPE
    )
    IS
    BEGIN
        INSERT INTO smy_plantillas_turno VALUES pro_smy_plantillas_turno;
    END p_insertar;

    -- 2. Traer por PK
    FUNCTION f_traer (
        pty_id IN smy_plantillas_turno.id%TYPE
    ) RETURN smy_plantillas_turno%ROWTYPE
    IS
        v_registro smy_plantillas_turno%ROWTYPE;
    BEGIN
        SELECT *
          INTO v_registro
          FROM smy_plantillas_turno
         WHERE id = pty_id;

        RETURN v_registro;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN NULL;
    END f_traer;

    -- 3. Consultar todos los registros
    PROCEDURE p_consultar_registros (
        pta_smy_plantillas_turno OUT PKGSMY_PLANTILLAS_TURNO_DAO.ta_smy_plantillas_turno
    )
    IS
    BEGIN
        SELECT *
          BULK COLLECT INTO pta_smy_plantillas_turno
          FROM smy_plantillas_turno;
    END p_consultar_registros;

    -- 4. Eliminar por ROWID
    PROCEDURE p_eliminar_rowid (
        p_rowid IN VARCHAR2
    )
    IS
    BEGIN
        DELETE FROM smy_plantillas_turno
         WHERE ROWID = CHARTOROWID(p_rowid);
    END p_eliminar_rowid;

    -- 5. Eliminar por PK
    PROCEDURE p_eliminar (
        pty_id IN smy_plantillas_turno.id%TYPE
    )
    IS
    BEGIN
        DELETE FROM smy_plantillas_turno
         WHERE id = pty_id;
    END p_eliminar;

    -- 6. Eliminar todos los registros
    PROCEDURE p_eliminar_registros
    IS
    BEGIN
        DELETE FROM smy_plantillas_turno;
    END p_eliminar_registros;

    -- 7. Verificar existencia por PK
    FUNCTION f_existe (
        pty_id IN smy_plantillas_turno.id%TYPE
    ) RETURN BOOLEAN
    IS
        v_dummy NUMBER;
    BEGIN
        SELECT 1
          INTO v_dummy
          FROM smy_plantillas_turno
         WHERE id = pty_id;

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe;

    -- 8. Verificar existencia y retornar registro
    FUNCTION f_existe (
        pty_id       IN  smy_plantillas_turno.id%TYPE,
        pro_smy_plantillas_turno  OUT smy_plantillas_turno%ROWTYPE
    ) RETURN BOOLEAN
    IS
    BEGIN
        SELECT *
          INTO pro_smy_plantillas_turno
          FROM smy_plantillas_turno
         WHERE id = pty_id;

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe;

    -- 9. Verificar existencia, retornar registro y ROWID
    FUNCTION f_existe (
        pty_id       IN  smy_plantillas_turno.id%TYPE,
        pro_smy_plantillas_turno  OUT smy_plantillas_turno%ROWTYPE,
        p_rowid      OUT VARCHAR2
    ) RETURN BOOLEAN
    IS
    BEGIN
        SELECT ROWIDTOCHAR(ROWID)
          INTO p_rowid
          FROM smy_plantillas_turno
         WHERE id = pty_id;

        SELECT *
          INTO pro_smy_plantillas_turno
          FROM smy_plantillas_turno
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
          FROM smy_plantillas_turno
         WHERE ROWID = CHARTOROWID(p_rowid);

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe_rowid;

    -- 11. Verificar existencia por ROWID y retornar registro
    FUNCTION f_existe_rowid (
        p_rowid      IN  VARCHAR2,
        pro_smy_plantillas_turno  OUT smy_plantillas_turno%ROWTYPE
    ) RETURN BOOLEAN
    IS
    BEGIN
        SELECT *
          INTO pro_smy_plantillas_turno
          FROM smy_plantillas_turno
         WHERE ROWID = CHARTOROWID(p_rowid);

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe_rowid;

    -- 12. Actualizar por registro
    PROCEDURE p_actualizar (
        pro_smy_plantillas_turno IN smy_plantillas_turno%ROWTYPE
    )
    IS
    BEGIN
        UPDATE smy_plantillas_turno
           SET ROW = pro_smy_plantillas_turno
         WHERE id = pro_smy_plantillas_turno.id;
    END p_actualizar;

    -- 13. Actualizar indicando PK
    PROCEDURE p_actualizar (
        pro_smy_plantillas_turno IN smy_plantillas_turno%ROWTYPE,
        pty_id      IN smy_plantillas_turno.id%TYPE
    )
    IS
    BEGIN
        UPDATE smy_plantillas_turno
           SET ROW = pro_smy_plantillas_turno
         WHERE id = pty_id;
    END p_actualizar;

    -- 14. Actualizar por ROWID
    PROCEDURE p_actualizar_rowid (
        pro_smy_plantillas_turno IN smy_plantillas_turno%ROWTYPE,
        p_rowid     IN VARCHAR2
    )
    IS
    BEGIN
        UPDATE smy_plantillas_turno
           SET ROW = pro_smy_plantillas_turno
         WHERE ROWID = CHARTOROWID(p_rowid);
    END p_actualizar_rowid;

    -- 15. Actualizar todos los registros
    PROCEDURE p_actualizar_registros (
        pro_smy_plantillas_turno IN smy_plantillas_turno%ROWTYPE
    )
    IS
    BEGIN
        UPDATE smy_plantillas_turno
           SET ROW = pro_smy_plantillas_turno;
    END p_actualizar_registros;

    -- 16. Obtener valores por defecto
    PROCEDURE p_valores_defecto (
        pro_smy_plantillas_turno IN OUT smy_plantillas_turno%ROWTYPE
    )
    IS
    BEGIN
        pro_smy_plantillas_turno.fecha_creacion := NVL(pro_smy_plantillas_turno.fecha_creacion, CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE));
        -- pro_smy_plantillas_turno.id_estado_plantilla := NVL(pro_smy_plantillas_turno.id_estado_plantilla, 1);
    END p_valores_defecto;

    -- 17. Verificar existencia y retornar JSON
    FUNCTION f_existe_json (
        p_id            IN  smy_plantillas_turno.id%TYPE,
        p_json_smy_plantillas_turno  OUT CLOB
    ) RETURN NUMBER
    IS
    BEGIN
        SELECT JSON_OBJECT(
                   'id' VALUE t.id,
                   'id_organizacion' VALUE t.id_organizacion,
                   'codigo' VALUE t.codigo,
                   'nombre' VALUE t.nombre,
                   'hora_inicio' VALUE t.hora_inicio,
                   'hora_fin' VALUE t.hora_fin,
                   'total_horas' VALUE t.total_horas,
                   'color_hex' VALUE t.color_hex,
                   'id_estado_plantilla' VALUE t.id_estado_plantilla,
                   'fecha_creacion' VALUE TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'id_usuario_ultima_modificacion' VALUE t.id_usuario_ultima_modificacion
                   RETURNING CLOB
               )
          INTO p_json_smy_plantillas_turno
          FROM smy_plantillas_turno t
         WHERE t.id = p_id;

        RETURN 1;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            p_json_smy_plantillas_turno := NULL;
            RETURN 0;
    END f_existe_json;

    -- 18. Obtener JSON por PK (Retorna CLOB nativo)
    FUNCTION f_json (
        p_id IN smy_plantillas_turno.id%TYPE
    ) RETURN CLOB
    IS
        v_json CLOB;
    BEGIN
        SELECT JSON_OBJECT(
                   'id' VALUE t.id,
                   'id_organizacion' VALUE t.id_organizacion,
                   'codigo' VALUE t.codigo,
                   'nombre' VALUE t.nombre,
                   'hora_inicio' VALUE t.hora_inicio,
                   'hora_fin' VALUE t.hora_fin,
                   'total_horas' VALUE t.total_horas,
                   'color_hex' VALUE t.color_hex,
                   'id_estado_plantilla' VALUE t.id_estado_plantilla,
                   'fecha_creacion' VALUE TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'id_usuario_ultima_modificacion' VALUE t.id_usuario_ultima_modificacion
                   RETURNING CLOB
               )
          INTO v_json
          FROM smy_plantillas_turno t
         WHERE t.id = p_id;

        RETURN v_json;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN NULL;
    END f_json;

END PKGSMY_PLANTILLAS_TURNO_DAO;
/
