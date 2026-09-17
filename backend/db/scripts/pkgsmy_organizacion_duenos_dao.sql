-- =============================================================================
-- ESPECIFICACIÓN Y CUERPO DAO: PKGSMY_ORGANIZACION_DUENOS_DAO
-- TABLA: SMY_ORGANIZACION_DUENOS
-- ESTÁNDAR ARQUITECTÓNICO: oracle-plsql-architecture (Plantilla oficial 18 métodos)
-- =============================================================================

CREATE OR REPLACE PACKAGE PKGSMY_ORGANIZACION_DUENOS_DAO
AS
    /*
    || =========================================================================
    || Paquete: PKGSMY_ORGANIZACION_DUENOS_DAO
    || Propósito: Capa de acceso a datos exclusiva para la tabla SMY_ORGANIZACION_DUENOS
    || Estándar: Plantilla oficial DAO PL/SQL Oracle
    || =========================================================================
    */

    -- Tipo de colección estándar para registros de la tabla
    TYPE ta_smy_organizacion_duenos IS TABLE OF smy_organizacion_duenos%ROWTYPE INDEX BY BINARY_INTEGER;

    -- 1. Insertar registro
    PROCEDURE p_insertar (
        pro_smy_org_duenos IN smy_organizacion_duenos%ROWTYPE
    );

    -- 2. Traer registro por PK
    FUNCTION f_traer (
        pty_id IN smy_organizacion_duenos.id%TYPE
    ) RETURN smy_organizacion_duenos%ROWTYPE;

    -- 3. Consultar todos los registros
    PROCEDURE p_consultar_registros (
        pta_smy_org_duenos OUT PKGSMY_ORGANIZACION_DUENOS_DAO.ta_smy_organizacion_duenos
    );

    -- 4. Eliminar por ROWID
    PROCEDURE p_eliminar_rowid (
        p_rowid IN VARCHAR2
    );

    -- 5. Eliminar por PK
    PROCEDURE p_eliminar (
        pty_id IN smy_organizacion_duenos.id%TYPE
    );

    -- 6. Eliminar todos los registros
    PROCEDURE p_eliminar_registros;

    -- 7. Verificar existencia por PK
    FUNCTION f_existe (
        pty_id IN smy_organizacion_duenos.id%TYPE
    ) RETURN BOOLEAN;

    -- 8. Verificar existencia y retornar registro
    FUNCTION f_existe (
        pty_id             IN  smy_organizacion_duenos.id%TYPE,
        pro_smy_org_duenos OUT smy_organizacion_duenos%ROWTYPE
    ) RETURN BOOLEAN;

    -- 9. Verificar existencia, retornar registro y ROWID
    FUNCTION f_existe (
        pty_id             IN  smy_organizacion_duenos.id%TYPE,
        pro_smy_org_duenos OUT smy_organizacion_duenos%ROWTYPE,
        p_rowid            OUT VARCHAR2
    ) RETURN BOOLEAN;

    -- 10. Verificar existencia por ROWID
    FUNCTION f_existe_rowid (
        p_rowid IN VARCHAR2
    ) RETURN BOOLEAN;

    -- 11. Verificar existencia por ROWID y retornar registro
    FUNCTION f_existe_rowid (
        p_rowid            IN  VARCHAR2,
        pro_smy_org_duenos OUT smy_organizacion_duenos%ROWTYPE
    ) RETURN BOOLEAN;

    -- 12. Actualizar por registro
    PROCEDURE p_actualizar (
        pro_smy_org_duenos IN smy_organizacion_duenos%ROWTYPE
    );

    -- 13. Actualizar indicando PK
    PROCEDURE p_actualizar (
        pro_smy_org_duenos IN smy_organizacion_duenos%ROWTYPE,
        pty_id             IN smy_organizacion_duenos.id%TYPE
    );

    -- 14. Actualizar por ROWID
    PROCEDURE p_actualizar_rowid (
        pro_smy_org_duenos IN smy_organizacion_duenos%ROWTYPE,
        p_rowid            IN VARCHAR2
    );

    -- 15. Actualizar todos los registros
    PROCEDURE p_actualizar_registros (
        pro_smy_org_duenos IN smy_organizacion_duenos%ROWTYPE
    );

    -- 16. Obtener valores por defecto
    PROCEDURE p_valores_defecto (
        pro_smy_org_duenos IN OUT smy_organizacion_duenos%ROWTYPE
    );

    -- 17. Verificar existencia y retornar JSON
    FUNCTION f_existe_json (
        p_id                   IN  smy_organizacion_duenos.id%TYPE,
        p_json_smy_org_duenos OUT CLOB
    ) RETURN NUMBER;

    -- 18. Obtener JSON por PK (Retorna CLOB nativo)
    FUNCTION f_json (
        p_id IN smy_organizacion_duenos.id%TYPE
    ) RETURN CLOB;

END PKGSMY_ORGANIZACION_DUENOS_DAO;
/

CREATE OR REPLACE PACKAGE BODY PKGSMY_ORGANIZACION_DUENOS_DAO
AS
    /*
    || =========================================================================
    || Paquete: PKGSMY_ORGANIZACION_DUENOS_DAO (Body)
    || Propósito: Implementación de operaciones CRUD para SMY_ORGANIZACION_DUENOS
    || Reglas: Sin COMMIT/ROLLBACK, sin lógica de negocio, manejo nativo de JSON
    || =========================================================================
    */

    -- 1. Insertar
    PROCEDURE p_insertar (
        pro_smy_org_duenos IN smy_organizacion_duenos%ROWTYPE
    )
    IS
    BEGIN
        INSERT INTO smy_organizacion_duenos VALUES pro_smy_org_duenos;
    END p_insertar;

    -- 2. Traer por PK
    FUNCTION f_traer (
        pty_id IN smy_organizacion_duenos.id%TYPE
    ) RETURN smy_organizacion_duenos%ROWTYPE
    IS
        v_registro smy_organizacion_duenos%ROWTYPE;
    BEGIN
        SELECT *
          INTO v_registro
          FROM smy_organizacion_duenos
         WHERE id = pty_id;

        RETURN v_registro;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN NULL;
    END f_traer;

    -- 3. Consultar todos los registros
    PROCEDURE p_consultar_registros (
        pta_smy_org_duenos OUT PKGSMY_ORGANIZACION_DUENOS_DAO.ta_smy_organizacion_duenos
    )
    IS
    BEGIN
        SELECT *
          BULK COLLECT INTO pta_smy_org_duenos
          FROM smy_organizacion_duenos
         ORDER BY id;
    END p_consultar_registros;

    -- 4. Eliminar por ROWID
    PROCEDURE p_eliminar_rowid (
        p_rowid IN VARCHAR2
    )
    IS
    BEGIN
        DELETE FROM smy_organizacion_duenos
         WHERE ROWID = CHARTOROWID(p_rowid);
    END p_eliminar_rowid;

    -- 5. Eliminar por PK
    PROCEDURE p_eliminar (
        pty_id IN smy_organizacion_duenos.id%TYPE
    )
    IS
    BEGIN
        DELETE FROM smy_organizacion_duenos
         WHERE id = pty_id;
    END p_eliminar;

    -- 6. Eliminar todos los registros
    PROCEDURE p_eliminar_registros
    IS
    BEGIN
        DELETE FROM smy_organizacion_duenos;
    END p_eliminar_registros;

    -- 7. Verificar existencia por PK
    FUNCTION f_existe (
        pty_id IN smy_organizacion_duenos.id%TYPE
    ) RETURN BOOLEAN
    IS
        v_dummy NUMBER(1);
    BEGIN
        SELECT 1
          INTO v_dummy
          FROM smy_organizacion_duenos
         WHERE id = pty_id;

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe;

    -- 8. Verificar existencia y retornar registro
    FUNCTION f_existe (
        pty_id             IN  smy_organizacion_duenos.id%TYPE,
        pro_smy_org_duenos OUT smy_organizacion_duenos%ROWTYPE
    ) RETURN BOOLEAN
    IS
    BEGIN
        SELECT *
          INTO pro_smy_org_duenos
          FROM smy_organizacion_duenos
         WHERE id = pty_id;

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe;

    -- 9. Verificar existencia, retornar registro y ROWID
    FUNCTION f_existe (
        pty_id             IN  smy_organizacion_duenos.id%TYPE,
        pro_smy_org_duenos OUT smy_organizacion_duenos%ROWTYPE,
        p_rowid            OUT VARCHAR2
    ) RETURN BOOLEAN
    IS
    BEGIN
        SELECT ROWIDTOCHAR(ROWID)
          INTO p_rowid
          FROM smy_organizacion_duenos
         WHERE id = pty_id;

        SELECT *
          INTO pro_smy_org_duenos
          FROM smy_organizacion_duenos
         WHERE ROWID = CHARTOROWID(p_rowid);

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            p_rowid := NULL;
            RETURN FALSE;
    END f_existe;

    -- 10. Verificar existencia por ROWID
    FUNCTION f_existe_rowid (
        p_rowid IN VARCHAR2
    ) RETURN BOOLEAN
    IS
        v_dummy NUMBER(1);
    BEGIN
        SELECT 1
          INTO v_dummy
          FROM smy_organizacion_duenos
         WHERE ROWID = CHARTOROWID(p_rowid);

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe_rowid;

    -- 11. Verificar existencia por ROWID y retornar registro
    FUNCTION f_existe_rowid (
        p_rowid            IN  VARCHAR2,
        pro_smy_org_duenos OUT smy_organizacion_duenos%ROWTYPE
    ) RETURN BOOLEAN
    IS
    BEGIN
        SELECT *
          INTO pro_smy_org_duenos
          FROM smy_organizacion_duenos
         WHERE ROWID = CHARTOROWID(p_rowid);

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe_rowid;

    -- 12. Actualizar por registro
    PROCEDURE p_actualizar (
        pro_smy_org_duenos IN smy_organizacion_duenos%ROWTYPE
    )
    IS
    BEGIN
        UPDATE smy_organizacion_duenos
           SET id_organizacion                = pro_smy_org_duenos.id_organizacion,
               id_usuario                     = pro_smy_org_duenos.id_usuario,
               porcentaje_participacion       = pro_smy_org_duenos.porcentaje_participacion,
               es_representante_legal         = pro_smy_org_duenos.es_representante_legal,
               fecha_vinculacion              = pro_smy_org_duenos.fecha_vinculacion,
               fecha_retiro                   = pro_smy_org_duenos.fecha_retiro,
               estado_activo                  = pro_smy_org_duenos.estado_activo,
               id_usuario_ultima_modificacion = pro_smy_org_duenos.id_usuario_ultima_modificacion
         WHERE id = pro_smy_org_duenos.id;
    END p_actualizar;

    -- 13. Actualizar indicando PK
    PROCEDURE p_actualizar (
        pro_smy_org_duenos IN smy_organizacion_duenos%ROWTYPE,
        pty_id             IN smy_organizacion_duenos.id%TYPE
    )
    IS
    BEGIN
        UPDATE smy_organizacion_duenos
           SET id_organizacion                = pro_smy_org_duenos.id_organizacion,
               id_usuario                     = pro_smy_org_duenos.id_usuario,
               porcentaje_participacion       = pro_smy_org_duenos.porcentaje_participacion,
               es_representante_legal         = pro_smy_org_duenos.es_representante_legal,
               fecha_vinculacion              = pro_smy_org_duenos.fecha_vinculacion,
               fecha_retiro                   = pro_smy_org_duenos.fecha_retiro,
               estado_activo                  = pro_smy_org_duenos.estado_activo,
               id_usuario_ultima_modificacion = pro_smy_org_duenos.id_usuario_ultima_modificacion
         WHERE id = pty_id;
    END p_actualizar;

    -- 14. Actualizar por ROWID
    PROCEDURE p_actualizar_rowid (
        pro_smy_org_duenos IN smy_organizacion_duenos%ROWTYPE,
        p_rowid            IN VARCHAR2
    )
    IS
    BEGIN
        UPDATE smy_organizacion_duenos
           SET id_organizacion                = pro_smy_org_duenos.id_organizacion,
               id_usuario                     = pro_smy_org_duenos.id_usuario,
               porcentaje_participacion       = pro_smy_org_duenos.porcentaje_participacion,
               es_representante_legal         = pro_smy_org_duenos.es_representante_legal,
               fecha_vinculacion              = pro_smy_org_duenos.fecha_vinculacion,
               fecha_retiro                   = pro_smy_org_duenos.fecha_retiro,
               estado_activo                  = pro_smy_org_duenos.estado_activo,
               id_usuario_ultima_modificacion = pro_smy_org_duenos.id_usuario_ultima_modificacion
         WHERE ROWID = CHARTOROWID(p_rowid);
    END p_actualizar_rowid;

    -- 15. Actualizar todos los registros
    PROCEDURE p_actualizar_registros (
        pro_smy_org_duenos IN smy_organizacion_duenos%ROWTYPE
    )
    IS
    BEGIN
        UPDATE smy_organizacion_duenos
           SET id_organizacion                = pro_smy_org_duenos.id_organizacion,
               id_usuario                     = pro_smy_org_duenos.id_usuario,
               porcentaje_participacion       = pro_smy_org_duenos.porcentaje_participacion,
               es_representante_legal         = pro_smy_org_duenos.es_representante_legal,
               fecha_vinculacion              = pro_smy_org_duenos.fecha_vinculacion,
               fecha_retiro                   = pro_smy_org_duenos.fecha_retiro,
               estado_activo                  = pro_smy_org_duenos.estado_activo,
               id_usuario_ultima_modificacion = pro_smy_org_duenos.id_usuario_ultima_modificacion;
    END p_actualizar_registros;

    -- 16. Valores por defecto
    PROCEDURE p_valores_defecto (
        pro_smy_org_duenos IN OUT smy_organizacion_duenos%ROWTYPE
    )
    IS
    BEGIN
        pro_smy_org_duenos.id                       := NULL;
        pro_smy_org_duenos.porcentaje_participacion := 100.00;
        pro_smy_org_duenos.es_representante_legal   := 'S';
        pro_smy_org_duenos.estado_activo            := 'S';
        pro_smy_org_duenos.fecha_vinculacion        := CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE);
        pro_smy_org_duenos.fecha_creacion           := CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE);
    END p_valores_defecto;

    -- 17. Verificar existencia y retornar JSON
    FUNCTION f_existe_json (
        p_id                   IN  smy_organizacion_duenos.id%TYPE,
        p_json_smy_org_duenos OUT CLOB
    ) RETURN NUMBER
    IS
    BEGIN
        SELECT JSON_OBJECT(
                   'id' VALUE t.id,
                   'id_organizacion' VALUE t.id_organizacion,
                   'id_usuario' VALUE t.id_usuario,
                   'porcentaje_participacion' VALUE t.porcentaje_participacion,
                   'es_representante_legal' VALUE t.es_representante_legal,
                   'fecha_vinculacion' VALUE TO_CHAR(t.fecha_vinculacion, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'fecha_retiro' VALUE TO_CHAR(t.fecha_retiro, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'estado_activo' VALUE t.estado_activo,
                   'fecha_creacion' VALUE TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'id_usuario_ultima_modificacion' VALUE t.id_usuario_ultima_modificacion
                   RETURNING CLOB
               )
          INTO p_json_smy_org_duenos
          FROM smy_organizacion_duenos t
         WHERE t.id = p_id;

        RETURN 1;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            p_json_smy_org_duenos := NULL;
            RETURN 0;
    END f_existe_json;

    -- 18. Obtener JSON por PK (Retorna CLOB nativo)
    FUNCTION f_json (
        p_id IN smy_organizacion_duenos.id%TYPE
    ) RETURN CLOB
    IS
        v_json CLOB;
    BEGIN
        SELECT JSON_OBJECT(
                   'id' VALUE t.id,
                   'id_organizacion' VALUE t.id_organizacion,
                   'id_usuario' VALUE t.id_usuario,
                   'porcentaje_participacion' VALUE t.porcentaje_participacion,
                   'es_representante_legal' VALUE t.es_representante_legal,
                   'fecha_vinculacion' VALUE TO_CHAR(t.fecha_vinculacion, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'fecha_retiro' VALUE TO_CHAR(t.fecha_retiro, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'estado_activo' VALUE t.estado_activo,
                   'fecha_creacion' VALUE TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'id_usuario_ultima_modificacion' VALUE t.id_usuario_ultima_modificacion
                   RETURNING CLOB
               )
          INTO v_json
          FROM smy_organizacion_duenos t
         WHERE t.id = p_id;

        RETURN v_json;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN NULL;
    END f_json;

END PKGSMY_ORGANIZACION_DUENOS_DAO;
/
