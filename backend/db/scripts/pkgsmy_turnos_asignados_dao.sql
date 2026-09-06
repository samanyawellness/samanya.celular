-- =============================================================================
-- ESPECIFICACIÓN Y CUERPO DAO: PKGSMY_TURNOS_ASIGNADOS_DAO
-- TABLA: SMY_TURNOS_ASIGNADOS
-- ESTÁNDAR ARQUITECTÓNICO: oracle-plsql-architecture (Plantilla oficial 18 métodos)
-- =============================================================================

CREATE OR REPLACE PACKAGE PKGSMY_TURNOS_ASIGNADOS_DAO
AS
    /*
    || =========================================================================
    || Paquete: PKGSMY_TURNOS_ASIGNADOS_DAO
    || Propósito: Capa de acceso a datos exclusiva para la tabla SMY_TURNOS_ASIGNADOS
    || Estándar: Plantilla oficial DAO PL/SQL Oracle
    || =========================================================================
    */

    -- Tipo de colección estándar para registros de la tabla
    TYPE ta_smy_turnos_asignados IS TABLE OF smy_turnos_asignados%ROWTYPE INDEX BY BINARY_INTEGER;

    -- 1. Insertar registro
    PROCEDURE p_insertar (
        pro_smy_turnos_asignados IN smy_turnos_asignados%ROWTYPE
    );

    -- 2. Traer registro por PK
    FUNCTION f_traer (
        pty_id IN smy_turnos_asignados.id%TYPE
    ) RETURN smy_turnos_asignados%ROWTYPE;

    -- 3. Consultar todos los registros
    PROCEDURE p_consultar_registros (
        pta_smy_turnos_asignados OUT PKGSMY_TURNOS_ASIGNADOS_DAO.ta_smy_turnos_asignados
    );

    -- 4. Eliminar por ROWID
    PROCEDURE p_eliminar_rowid (
        p_rowid IN VARCHAR2
    );

    -- 5. Eliminar por PK
    PROCEDURE p_eliminar (
        pty_id IN smy_turnos_asignados.id%TYPE
    );

    -- 6. Eliminar todos los registros
    PROCEDURE p_eliminar_registros;

    -- 7. Verificar existencia por PK
    FUNCTION f_existe (
        pty_id IN smy_turnos_asignados.id%TYPE
    ) RETURN BOOLEAN;

    -- 8. Verificar existencia y retornar registro
    FUNCTION f_existe (
        pty_id       IN  smy_turnos_asignados.id%TYPE,
        pro_smy_turnos_asignados  OUT smy_turnos_asignados%ROWTYPE
    ) RETURN BOOLEAN;

    -- 9. Verificar existencia, retornar registro y ROWID
    FUNCTION f_existe (
        pty_id       IN  smy_turnos_asignados.id%TYPE,
        pro_smy_turnos_asignados  OUT smy_turnos_asignados%ROWTYPE,
        p_rowid      OUT VARCHAR2
    ) RETURN BOOLEAN;

    -- 10. Verificar existencia por ROWID
    FUNCTION f_existe_rowid (
        p_rowid IN VARCHAR2
    ) RETURN BOOLEAN;

    -- 11. Verificar existencia por ROWID y retornar registro
    FUNCTION f_existe_rowid (
        p_rowid      IN  VARCHAR2,
        pro_smy_turnos_asignados  OUT smy_turnos_asignados%ROWTYPE
    ) RETURN BOOLEAN;

    -- 12. Actualizar por registro
    PROCEDURE p_actualizar (
        pro_smy_turnos_asignados IN smy_turnos_asignados%ROWTYPE
    );

    -- 13. Actualizar indicando PK
    PROCEDURE p_actualizar (
        pro_smy_turnos_asignados IN smy_turnos_asignados%ROWTYPE,
        pty_id      IN smy_turnos_asignados.id%TYPE
    );

    -- 14. Actualizar por ROWID
    PROCEDURE p_actualizar_rowid (
        pro_smy_turnos_asignados IN smy_turnos_asignados%ROWTYPE,
        p_rowid     IN VARCHAR2
    );

    -- 15. Actualizar todos los registros
    PROCEDURE p_actualizar_registros (
        pro_smy_turnos_asignados IN smy_turnos_asignados%ROWTYPE
    );

    -- 16. Obtener valores por defecto
    PROCEDURE p_valores_defecto (
        pro_smy_turnos_asignados IN OUT smy_turnos_asignados%ROWTYPE
    );

    -- 17. Verificar existencia y retornar JSON
    FUNCTION f_existe_json (
        p_id            IN  smy_turnos_asignados.id%TYPE,
        p_json_smy_turnos_asignados  OUT CLOB
    ) RETURN NUMBER;

    -- 18. Obtener JSON por PK (Retorna CLOB nativo)
    FUNCTION f_json (
        p_id IN smy_turnos_asignados.id%TYPE
    ) RETURN CLOB;

END PKGSMY_TURNOS_ASIGNADOS_DAO;
/

CREATE OR REPLACE PACKAGE BODY PKGSMY_TURNOS_ASIGNADOS_DAO
AS
    /*
    || =========================================================================
    || Paquete: PKGSMY_TURNOS_ASIGNADOS_DAO (Body)
    || Propósito: Implementación de operaciones CRUD para SMY_TURNOS_ASIGNADOS
    || Reglas: Sin COMMIT/ROLLBACK, sin lógica de negocio, manejo nativo de JSON
    || =========================================================================
    */

    -- 1. Insertar
    PROCEDURE p_insertar (
        pro_smy_turnos_asignados IN smy_turnos_asignados%ROWTYPE
    )
    IS
    BEGIN
        INSERT INTO smy_turnos_asignados VALUES pro_smy_turnos_asignados;
    END p_insertar;

    -- 2. Traer por PK
    FUNCTION f_traer (
        pty_id IN smy_turnos_asignados.id%TYPE
    ) RETURN smy_turnos_asignados%ROWTYPE
    IS
        v_registro smy_turnos_asignados%ROWTYPE;
    BEGIN
        SELECT *
          INTO v_registro
          FROM smy_turnos_asignados
         WHERE id = pty_id;

        RETURN v_registro;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN NULL;
    END f_traer;

    -- 3. Consultar todos los registros
    PROCEDURE p_consultar_registros (
        pta_smy_turnos_asignados OUT PKGSMY_TURNOS_ASIGNADOS_DAO.ta_smy_turnos_asignados
    )
    IS
    BEGIN
        SELECT *
          BULK COLLECT INTO pta_smy_turnos_asignados
          FROM smy_turnos_asignados;
    END p_consultar_registros;

    -- 4. Eliminar por ROWID
    PROCEDURE p_eliminar_rowid (
        p_rowid IN VARCHAR2
    )
    IS
    BEGIN
        DELETE FROM smy_turnos_asignados
         WHERE ROWID = CHARTOROWID(p_rowid);
    END p_eliminar_rowid;

    -- 5. Eliminar por PK
    PROCEDURE p_eliminar (
        pty_id IN smy_turnos_asignados.id%TYPE
    )
    IS
    BEGIN
        DELETE FROM smy_turnos_asignados
         WHERE id = pty_id;
    END p_eliminar;

    -- 6. Eliminar todos los registros
    PROCEDURE p_eliminar_registros
    IS
    BEGIN
        DELETE FROM smy_turnos_asignados;
    END p_eliminar_registros;

    -- 7. Verificar existencia por PK
    FUNCTION f_existe (
        pty_id IN smy_turnos_asignados.id%TYPE
    ) RETURN BOOLEAN
    IS
        v_dummy NUMBER;
    BEGIN
        SELECT 1
          INTO v_dummy
          FROM smy_turnos_asignados
         WHERE id = pty_id;

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe;

    -- 8. Verificar existencia y retornar registro
    FUNCTION f_existe (
        pty_id       IN  smy_turnos_asignados.id%TYPE,
        pro_smy_turnos_asignados  OUT smy_turnos_asignados%ROWTYPE
    ) RETURN BOOLEAN
    IS
    BEGIN
        SELECT *
          INTO pro_smy_turnos_asignados
          FROM smy_turnos_asignados
         WHERE id = pty_id;

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe;

    -- 9. Verificar existencia, retornar registro y ROWID
    FUNCTION f_existe (
        pty_id       IN  smy_turnos_asignados.id%TYPE,
        pro_smy_turnos_asignados  OUT smy_turnos_asignados%ROWTYPE,
        p_rowid      OUT VARCHAR2
    ) RETURN BOOLEAN
    IS
    BEGIN
        SELECT ROWIDTOCHAR(ROWID)
          INTO p_rowid
          FROM smy_turnos_asignados
         WHERE id = pty_id;

        SELECT *
          INTO pro_smy_turnos_asignados
          FROM smy_turnos_asignados
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
          FROM smy_turnos_asignados
         WHERE ROWID = CHARTOROWID(p_rowid);

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe_rowid;

    -- 11. Verificar existencia por ROWID y retornar registro
    FUNCTION f_existe_rowid (
        p_rowid      IN  VARCHAR2,
        pro_smy_turnos_asignados  OUT smy_turnos_asignados%ROWTYPE
    ) RETURN BOOLEAN
    IS
    BEGIN
        SELECT *
          INTO pro_smy_turnos_asignados
          FROM smy_turnos_asignados
         WHERE ROWID = CHARTOROWID(p_rowid);

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe_rowid;

    -- 12. Actualizar por registro
    PROCEDURE p_actualizar (
        pro_smy_turnos_asignados IN smy_turnos_asignados%ROWTYPE
    )
    IS
    BEGIN
        UPDATE smy_turnos_asignados
           SET ROW = pro_smy_turnos_asignados
         WHERE id = pro_smy_turnos_asignados.id;
    END p_actualizar;

    -- 13. Actualizar indicando PK
    PROCEDURE p_actualizar (
        pro_smy_turnos_asignados IN smy_turnos_asignados%ROWTYPE,
        pty_id      IN smy_turnos_asignados.id%TYPE
    )
    IS
    BEGIN
        UPDATE smy_turnos_asignados
           SET ROW = pro_smy_turnos_asignados
         WHERE id = pty_id;
    END p_actualizar;

    -- 14. Actualizar por ROWID
    PROCEDURE p_actualizar_rowid (
        pro_smy_turnos_asignados IN smy_turnos_asignados%ROWTYPE,
        p_rowid     IN VARCHAR2
    )
    IS
    BEGIN
        UPDATE smy_turnos_asignados
           SET ROW = pro_smy_turnos_asignados
         WHERE ROWID = CHARTOROWID(p_rowid);
    END p_actualizar_rowid;

    -- 15. Actualizar todos los registros
    PROCEDURE p_actualizar_registros (
        pro_smy_turnos_asignados IN smy_turnos_asignados%ROWTYPE
    )
    IS
    BEGIN
        UPDATE smy_turnos_asignados
           SET ROW = pro_smy_turnos_asignados;
    END p_actualizar_registros;

    -- 16. Obtener valores por defecto
    PROCEDURE p_valores_defecto (
        pro_smy_turnos_asignados IN OUT smy_turnos_asignados%ROWTYPE
    )
    IS
    BEGIN
        pro_smy_turnos_asignados.fecha_creacion := NVL(pro_smy_turnos_asignados.fecha_creacion, CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE));
        -- pro_smy_turnos_asignados.id_estado_turno := NVL(pro_smy_turnos_asignados.id_estado_turno, 1);
    END p_valores_defecto;

    -- 17. Verificar existencia y retornar JSON
    FUNCTION f_existe_json (
        p_id            IN  smy_turnos_asignados.id%TYPE,
        p_json_smy_turnos_asignados  OUT CLOB
    ) RETURN NUMBER
    IS
    BEGIN
        SELECT JSON_OBJECT(
                   'id' VALUE t.id,
                   'id_empleado' VALUE t.id_empleado,
                   'id_plantilla_turno' VALUE t.id_plantilla_turno,
                   'fecha_turno' VALUE TO_CHAR(t.fecha_turno, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'area_asignada' VALUE t.area_asignada,
                   'observaciones' VALUE t.observaciones,
                   'id_estado_turno' VALUE t.id_estado_turno,
                   'fecha_creacion' VALUE TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'id_usuario_ultima_modificacion' VALUE t.id_usuario_ultima_modificacion
                   RETURNING CLOB
               )
          INTO p_json_smy_turnos_asignados
          FROM smy_turnos_asignados t
         WHERE t.id = p_id;

        RETURN 1;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            p_json_smy_turnos_asignados := NULL;
            RETURN 0;
    END f_existe_json;

    -- 18. Obtener JSON por PK (Retorna CLOB nativo)
    FUNCTION f_json (
        p_id IN smy_turnos_asignados.id%TYPE
    ) RETURN CLOB
    IS
        v_json CLOB;
    BEGIN
        SELECT JSON_OBJECT(
                   'id' VALUE t.id,
                   'id_empleado' VALUE t.id_empleado,
                   'id_plantilla_turno' VALUE t.id_plantilla_turno,
                   'fecha_turno' VALUE TO_CHAR(t.fecha_turno, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'area_asignada' VALUE t.area_asignada,
                   'observaciones' VALUE t.observaciones,
                   'id_estado_turno' VALUE t.id_estado_turno,
                   'fecha_creacion' VALUE TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'id_usuario_ultima_modificacion' VALUE t.id_usuario_ultima_modificacion
                   RETURNING CLOB
               )
          INTO v_json
          FROM smy_turnos_asignados t
         WHERE t.id = p_id;

        RETURN v_json;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN NULL;
    END f_json;

END PKGSMY_TURNOS_ASIGNADOS_DAO;
/
