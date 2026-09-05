CREATE OR REPLACE PACKAGE BODY pkgsmy_usuarios_dao
AS
    /*
    || =========================================================================
    || Paquete: pkgsmy_usuarios_dao (Body)
    || Propósito: Implementación de operaciones CRUD para smy_USUARIOS
    || Reglas: Sin COMMIT/ROLLBACK, sin lógica de negocio, manejo nativo de JSON
    || =========================================================================
    */

    -- 1. Insertar
    PROCEDURE p_insertar (
        pro_smy_usuarios IN smy_usuarios%ROWTYPE
    )
    IS
    BEGIN
        INSERT INTO smy_usuarios VALUES pro_smy_usuarios;
    END p_insertar;

    -- 2. Traer por PK
    FUNCTION f_traer (
        pty_id IN smy_usuarios.id%TYPE
    ) RETURN smy_usuarios%ROWTYPE
    IS
        v_registro smy_usuarios%ROWTYPE;
    BEGIN
        SELECT *
          INTO v_registro
          FROM smy_usuarios
         WHERE id = pty_id;

        RETURN v_registro;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN NULL;
    END f_traer;

    -- 3. Consultar todos los registros
    PROCEDURE p_consultar_registros (
        pta_smy_usuarios OUT pkgsmy_usuarios_dao.ta_smy_usuarios
    )
    IS
    BEGIN
        SELECT *
          BULK COLLECT INTO pta_smy_usuarios
          FROM smy_usuarios;
    END p_consultar_registros;

    -- 4. Eliminar por ROWID
    PROCEDURE p_eliminar_rowid (
        p_rowid IN VARCHAR2
    )
    IS
    BEGIN
        DELETE FROM smy_usuarios
         WHERE ROWID = CHARTOROWID(p_rowid);
    END p_eliminar_rowid;

    -- 5. Eliminar por PK
    PROCEDURE p_eliminar (
        pty_id IN smy_usuarios.id%TYPE
    )
    IS
    BEGIN
        DELETE FROM smy_usuarios
         WHERE id = pty_id;
    END p_eliminar;

    -- 6. Eliminar todos los registros
    PROCEDURE p_eliminar_registros
    IS
    BEGIN
        DELETE FROM smy_usuarios;
    END p_eliminar_registros;

    -- 7. Verificar existencia por PK
    FUNCTION f_existe (
        pty_id IN smy_usuarios.id%TYPE
    ) RETURN BOOLEAN
    IS
        v_dummy NUMBER;
    BEGIN
        SELECT 1
          INTO v_dummy
          FROM smy_usuarios
         WHERE id = pty_id;

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe;

    -- 8. Verificar existencia y retornar registro
    FUNCTION f_existe (
        pty_id           IN  smy_usuarios.id%TYPE,
        pro_smy_usuarios OUT smy_usuarios%ROWTYPE
    ) RETURN BOOLEAN
    IS
    BEGIN
        SELECT *
          INTO pro_smy_usuarios
          FROM smy_usuarios
         WHERE id = pty_id;

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe;

    -- 9. Verificar existencia, retornar registro y ROWID
    FUNCTION f_existe (
        pty_id           IN  smy_usuarios.id%TYPE,
        pro_smy_usuarios OUT smy_usuarios%ROWTYPE,
        p_rowid          OUT VARCHAR2
    ) RETURN BOOLEAN
    IS
    BEGIN
        SELECT t.*, ROWIDTOCHAR(t.ROWID)
          INTO pro_smy_usuarios, p_rowid
          FROM smy_usuarios t
         WHERE t.id = pty_id;

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
          FROM smy_usuarios
         WHERE ROWID = CHARTOROWID(p_rowid);

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe_rowid;

    -- 11. Verificar existencia por ROWID y retornar registro
    FUNCTION f_existe_rowid (
        p_rowid          IN  VARCHAR2,
        pro_smy_usuarios OUT smy_usuarios%ROWTYPE
    ) RETURN BOOLEAN
    IS
    BEGIN
        SELECT *
          INTO pro_smy_usuarios
          FROM smy_usuarios
         WHERE ROWID = CHARTOROWID(p_rowid);

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe_rowid;

    -- 12. Actualizar por registro
    PROCEDURE p_actualizar (
        pro_smy_usuarios IN smy_usuarios%ROWTYPE
    )
    IS
    BEGIN
        UPDATE smy_usuarios
           SET ROW = pro_smy_usuarios
         WHERE id = pro_smy_usuarios.id;
    END p_actualizar;

    -- 13. Actualizar indicando PK
    PROCEDURE p_actualizar (
        pro_smy_usuarios IN smy_usuarios%ROWTYPE,
        pty_id           IN smy_usuarios.id%TYPE
    )
    IS
    BEGIN
        UPDATE smy_usuarios
           SET ROW = pro_smy_usuarios
         WHERE id = pty_id;
    END p_actualizar;

    -- 14. Actualizar por ROWID
    PROCEDURE p_actualizar_rowid (
        pro_smy_usuarios IN smy_usuarios%ROWTYPE,
        p_rowid          IN VARCHAR2
    )
    IS
    BEGIN
        UPDATE smy_usuarios
           SET ROW = pro_smy_usuarios
         WHERE ROWID = CHARTOROWID(p_rowid);
    END p_actualizar_rowid;

    -- 15. Actualizar todos los registros
    PROCEDURE p_actualizar_registros (
        pro_smy_usuarios IN smy_usuarios%ROWTYPE
    )
    IS
    BEGIN
        UPDATE smy_usuarios
           SET ROW = pro_smy_usuarios;
    END p_actualizar_registros;

    -- 16. Obtener valores por defecto
    PROCEDURE p_valores_defecto (
        pro_smy_usuarios IN OUT smy_usuarios%ROWTYPE
    )
    IS
    BEGIN
        pro_smy_usuarios.estado := NVL(pro_smy_usuarios.estado, 1);
        pro_smy_usuarios.fecha_creacion := NVL(pro_smy_usuarios.fecha_creacion, SYSDATE);
    END p_valores_defecto;

    -- 17. Verificar existencia y retornar JSON
    FUNCTION f_existe_json (
        p_id                IN  smy_usuarios.id%TYPE,
        p_json_smy_usuarios OUT CLOB
    ) RETURN NUMBER
    IS
    BEGIN
        SELECT JSON_OBJECT(
                   'id' VALUE u.id,
                   'nombre' VALUE u.nombre,
                   'correo' VALUE u.correo,
                   'estado' VALUE u.estado
                   RETURNING CLOB
               )
          INTO p_json_smy_usuarios
          FROM smy_usuarios u
         WHERE u.id = p_id;

        RETURN 1;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            p_json_smy_usuarios := NULL;
            RETURN 0;
    END f_existe_json;

    -- 18. Obtener JSON por PK
    FUNCTION f_json (
        p_id IN smy_usuarios.id%TYPE
    ) RETURN VARCHAR2
    IS
        v_json VARCHAR2(4000);
    BEGIN
        SELECT JSON_OBJECT(
                   'id' VALUE u.id,
                   'nombre' VALUE u.nombre,
                   'correo' VALUE u.correo,
                   'estado' VALUE u.estado
                   RETURNING VARCHAR2(4000)
               )
          INTO v_json
          FROM smy_usuarios u
         WHERE u.id = p_id;

        RETURN v_json;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN NULL;
    END f_json;

END pkgsmy_usuarios_dao;
/
