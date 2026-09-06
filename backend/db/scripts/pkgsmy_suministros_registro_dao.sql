-- =============================================================================
-- ESPECIFICACIÓN Y CUERPO DAO: PKGSMY_SUMINISTROS_REGISTRO_DAO
-- TABLA: SMY_SUMINISTROS_REGISTRO
-- ESTÁNDAR ARQUITECTÓNICO: oracle-plsql-architecture (Plantilla oficial 18 métodos)
-- =============================================================================

CREATE OR REPLACE PACKAGE PKGSMY_SUMINISTROS_REGISTRO_DAO
AS
    /*
    || =========================================================================
    || Paquete: PKGSMY_SUMINISTROS_REGISTRO_DAO
    || Propósito: Capa de acceso a datos exclusiva para la tabla SMY_SUMINISTROS_REGISTRO
    || Estándar: Plantilla oficial DAO PL/SQL Oracle
    || =========================================================================
    */

    -- Tipo de colección estándar para registros de la tabla
    TYPE ta_smy_suministros_registro IS TABLE OF smy_suministros_registro%ROWTYPE INDEX BY BINARY_INTEGER;

    -- 1. Insertar registro
    PROCEDURE p_insertar (
        pro_smy_suministros_registro IN smy_suministros_registro%ROWTYPE
    );

    -- 2. Traer registro por PK
    FUNCTION f_traer (
        pty_id IN smy_suministros_registro.id%TYPE
    ) RETURN smy_suministros_registro%ROWTYPE;

    -- 3. Consultar todos los registros
    PROCEDURE p_consultar_registros (
        pta_smy_suministros_registro OUT PKGSMY_SUMINISTROS_REGISTRO_DAO.ta_smy_suministros_registro
    );

    -- 4. Eliminar por ROWID
    PROCEDURE p_eliminar_rowid (
        p_rowid IN VARCHAR2
    );

    -- 5. Eliminar por PK
    PROCEDURE p_eliminar (
        pty_id IN smy_suministros_registro.id%TYPE
    );

    -- 6. Eliminar todos los registros
    PROCEDURE p_eliminar_registros;

    -- 7. Verificar existencia por PK
    FUNCTION f_existe (
        pty_id IN smy_suministros_registro.id%TYPE
    ) RETURN BOOLEAN;

    -- 8. Verificar existencia y retornar registro
    FUNCTION f_existe (
        pty_id       IN  smy_suministros_registro.id%TYPE,
        pro_smy_suministros_registro  OUT smy_suministros_registro%ROWTYPE
    ) RETURN BOOLEAN;

    -- 9. Verificar existencia, retornar registro y ROWID
    FUNCTION f_existe (
        pty_id       IN  smy_suministros_registro.id%TYPE,
        pro_smy_suministros_registro  OUT smy_suministros_registro%ROWTYPE,
        p_rowid      OUT VARCHAR2
    ) RETURN BOOLEAN;

    -- 10. Verificar existencia por ROWID
    FUNCTION f_existe_rowid (
        p_rowid IN VARCHAR2
    ) RETURN BOOLEAN;

    -- 11. Verificar existencia por ROWID y retornar registro
    FUNCTION f_existe_rowid (
        p_rowid      IN  VARCHAR2,
        pro_smy_suministros_registro  OUT smy_suministros_registro%ROWTYPE
    ) RETURN BOOLEAN;

    -- 12. Actualizar por registro
    PROCEDURE p_actualizar (
        pro_smy_suministros_registro IN smy_suministros_registro%ROWTYPE
    );

    -- 13. Actualizar indicando PK
    PROCEDURE p_actualizar (
        pro_smy_suministros_registro IN smy_suministros_registro%ROWTYPE,
        pty_id      IN smy_suministros_registro.id%TYPE
    );

    -- 14. Actualizar por ROWID
    PROCEDURE p_actualizar_rowid (
        pro_smy_suministros_registro IN smy_suministros_registro%ROWTYPE,
        p_rowid     IN VARCHAR2
    );

    -- 15. Actualizar todos los registros
    PROCEDURE p_actualizar_registros (
        pro_smy_suministros_registro IN smy_suministros_registro%ROWTYPE
    );

    -- 16. Obtener valores por defecto
    PROCEDURE p_valores_defecto (
        pro_smy_suministros_registro IN OUT smy_suministros_registro%ROWTYPE
    );

    -- 17. Verificar existencia y retornar JSON
    FUNCTION f_existe_json (
        p_id            IN  smy_suministros_registro.id%TYPE,
        p_json_smy_suministros_registro  OUT CLOB
    ) RETURN NUMBER;

    -- 18. Obtener JSON por PK (Retorna CLOB nativo)
    FUNCTION f_json (
        p_id IN smy_suministros_registro.id%TYPE
    ) RETURN CLOB;

END PKGSMY_SUMINISTROS_REGISTRO_DAO;
/

CREATE OR REPLACE PACKAGE BODY PKGSMY_SUMINISTROS_REGISTRO_DAO
AS
    /*
    || =========================================================================
    || Paquete: PKGSMY_SUMINISTROS_REGISTRO_DAO (Body)
    || Propósito: Implementación de operaciones CRUD para SMY_SUMINISTROS_REGISTRO
    || Reglas: Sin COMMIT/ROLLBACK, sin lógica de negocio, manejo nativo de JSON
    || =========================================================================
    */

    -- 1. Insertar
    PROCEDURE p_insertar (
        pro_smy_suministros_registro IN smy_suministros_registro%ROWTYPE
    )
    IS
    BEGIN
        INSERT INTO smy_suministros_registro VALUES pro_smy_suministros_registro;
    END p_insertar;

    -- 2. Traer por PK
    FUNCTION f_traer (
        pty_id IN smy_suministros_registro.id%TYPE
    ) RETURN smy_suministros_registro%ROWTYPE
    IS
        v_registro smy_suministros_registro%ROWTYPE;
    BEGIN
        SELECT *
          INTO v_registro
          FROM smy_suministros_registro
         WHERE id = pty_id;

        RETURN v_registro;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN NULL;
    END f_traer;

    -- 3. Consultar todos los registros
    PROCEDURE p_consultar_registros (
        pta_smy_suministros_registro OUT PKGSMY_SUMINISTROS_REGISTRO_DAO.ta_smy_suministros_registro
    )
    IS
    BEGIN
        SELECT *
          BULK COLLECT INTO pta_smy_suministros_registro
          FROM smy_suministros_registro;
    END p_consultar_registros;

    -- 4. Eliminar por ROWID
    PROCEDURE p_eliminar_rowid (
        p_rowid IN VARCHAR2
    )
    IS
    BEGIN
        DELETE FROM smy_suministros_registro
         WHERE ROWID = CHARTOROWID(p_rowid);
    END p_eliminar_rowid;

    -- 5. Eliminar por PK
    PROCEDURE p_eliminar (
        pty_id IN smy_suministros_registro.id%TYPE
    )
    IS
    BEGIN
        DELETE FROM smy_suministros_registro
         WHERE id = pty_id;
    END p_eliminar;

    -- 6. Eliminar todos los registros
    PROCEDURE p_eliminar_registros
    IS
    BEGIN
        DELETE FROM smy_suministros_registro;
    END p_eliminar_registros;

    -- 7. Verificar existencia por PK
    FUNCTION f_existe (
        pty_id IN smy_suministros_registro.id%TYPE
    ) RETURN BOOLEAN
    IS
        v_dummy NUMBER;
    BEGIN
        SELECT 1
          INTO v_dummy
          FROM smy_suministros_registro
         WHERE id = pty_id;

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe;

    -- 8. Verificar existencia y retornar registro
    FUNCTION f_existe (
        pty_id       IN  smy_suministros_registro.id%TYPE,
        pro_smy_suministros_registro  OUT smy_suministros_registro%ROWTYPE
    ) RETURN BOOLEAN
    IS
    BEGIN
        SELECT *
          INTO pro_smy_suministros_registro
          FROM smy_suministros_registro
         WHERE id = pty_id;

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe;

    -- 9. Verificar existencia, retornar registro y ROWID
    FUNCTION f_existe (
        pty_id       IN  smy_suministros_registro.id%TYPE,
        pro_smy_suministros_registro  OUT smy_suministros_registro%ROWTYPE,
        p_rowid      OUT VARCHAR2
    ) RETURN BOOLEAN
    IS
    BEGIN
        SELECT ROWIDTOCHAR(ROWID)
          INTO p_rowid
          FROM smy_suministros_registro
         WHERE id = pty_id;

        SELECT *
          INTO pro_smy_suministros_registro
          FROM smy_suministros_registro
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
          FROM smy_suministros_registro
         WHERE ROWID = CHARTOROWID(p_rowid);

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe_rowid;

    -- 11. Verificar existencia por ROWID y retornar registro
    FUNCTION f_existe_rowid (
        p_rowid      IN  VARCHAR2,
        pro_smy_suministros_registro  OUT smy_suministros_registro%ROWTYPE
    ) RETURN BOOLEAN
    IS
    BEGIN
        SELECT *
          INTO pro_smy_suministros_registro
          FROM smy_suministros_registro
         WHERE ROWID = CHARTOROWID(p_rowid);

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END f_existe_rowid;

    -- 12. Actualizar por registro
    PROCEDURE p_actualizar (
        pro_smy_suministros_registro IN smy_suministros_registro%ROWTYPE
    )
    IS
    BEGIN
        UPDATE smy_suministros_registro
           SET ROW = pro_smy_suministros_registro
         WHERE id = pro_smy_suministros_registro.id;
    END p_actualizar;

    -- 13. Actualizar indicando PK
    PROCEDURE p_actualizar (
        pro_smy_suministros_registro IN smy_suministros_registro%ROWTYPE,
        pty_id      IN smy_suministros_registro.id%TYPE
    )
    IS
    BEGIN
        UPDATE smy_suministros_registro
           SET ROW = pro_smy_suministros_registro
         WHERE id = pty_id;
    END p_actualizar;

    -- 14. Actualizar por ROWID
    PROCEDURE p_actualizar_rowid (
        pro_smy_suministros_registro IN smy_suministros_registro%ROWTYPE,
        p_rowid     IN VARCHAR2
    )
    IS
    BEGIN
        UPDATE smy_suministros_registro
           SET ROW = pro_smy_suministros_registro
         WHERE ROWID = CHARTOROWID(p_rowid);
    END p_actualizar_rowid;

    -- 15. Actualizar todos los registros
    PROCEDURE p_actualizar_registros (
        pro_smy_suministros_registro IN smy_suministros_registro%ROWTYPE
    )
    IS
    BEGIN
        UPDATE smy_suministros_registro
           SET ROW = pro_smy_suministros_registro;
    END p_actualizar_registros;

    -- 16. Obtener valores por defecto
    PROCEDURE p_valores_defecto (
        pro_smy_suministros_registro IN OUT smy_suministros_registro%ROWTYPE
    )
    IS
    BEGIN
        pro_smy_suministros_registro.fecha_creacion := NVL(pro_smy_suministros_registro.fecha_creacion, CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE));
        -- pro_smy_suministros_registro.id_estado_pago := NVL(pro_smy_suministros_registro.id_estado_pago, 1);
    END p_valores_defecto;

    -- 17. Verificar existencia y retornar JSON
    FUNCTION f_existe_json (
        p_id            IN  smy_suministros_registro.id%TYPE,
        p_json_smy_suministros_registro  OUT CLOB
    ) RETURN NUMBER
    IS
    BEGIN
        SELECT JSON_OBJECT(
                   'id' VALUE t.id,
                   'id_residente' VALUE t.id_residente,
                   'id_tipo_suministro' VALUE t.id_tipo_suministro,
                   'descripcion' VALUE t.descripcion,
                   'cantidad' VALUE t.cantidad,
                   'fecha' VALUE TO_CHAR(t.fecha, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'hora' VALUE t.hora,
                   'costo' VALUE t.costo,
                   'id_estado_pago' VALUE t.id_estado_pago,
                   'pagado_por' VALUE t.pagado_por,
                   'fecha_pago' VALUE TO_CHAR(t.fecha_pago, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'id_trabajador_recibe' VALUE t.id_trabajador_recibe,
                   'entregado_por' VALUE t.entregado_por,
                   'id_usuario_registra' VALUE t.id_usuario_registra,
                   'registrado_por_nom' VALUE t.registrado_por_nom,
                   'registrado_por_rol' VALUE t.registrado_por_rol,
                   'notas' VALUE t.notas,
                   'fecha_creacion' VALUE TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'id_usuario_ultima_modificacion' VALUE t.id_usuario_ultima_modificacion
                   RETURNING CLOB
               )
          INTO p_json_smy_suministros_registro
          FROM smy_suministros_registro t
         WHERE t.id = p_id;

        RETURN 1;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            p_json_smy_suministros_registro := NULL;
            RETURN 0;
    END f_existe_json;

    -- 18. Obtener JSON por PK (Retorna CLOB nativo)
    FUNCTION f_json (
        p_id IN smy_suministros_registro.id%TYPE
    ) RETURN CLOB
    IS
        v_json CLOB;
    BEGIN
        SELECT JSON_OBJECT(
                   'id' VALUE t.id,
                   'id_residente' VALUE t.id_residente,
                   'id_tipo_suministro' VALUE t.id_tipo_suministro,
                   'descripcion' VALUE t.descripcion,
                   'cantidad' VALUE t.cantidad,
                   'fecha' VALUE TO_CHAR(t.fecha, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'hora' VALUE t.hora,
                   'costo' VALUE t.costo,
                   'id_estado_pago' VALUE t.id_estado_pago,
                   'pagado_por' VALUE t.pagado_por,
                   'fecha_pago' VALUE TO_CHAR(t.fecha_pago, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'id_trabajador_recibe' VALUE t.id_trabajador_recibe,
                   'entregado_por' VALUE t.entregado_por,
                   'id_usuario_registra' VALUE t.id_usuario_registra,
                   'registrado_por_nom' VALUE t.registrado_por_nom,
                   'registrado_por_rol' VALUE t.registrado_por_rol,
                   'notas' VALUE t.notas,
                   'fecha_creacion' VALUE TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD"T"HH24:MI:SS'),
                   'id_usuario_ultima_modificacion' VALUE t.id_usuario_ultima_modificacion
                   RETURNING CLOB
               )
          INTO v_json
          FROM smy_suministros_registro t
         WHERE t.id = p_id;

        RETURN v_json;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN NULL;
    END f_json;

END PKGSMY_SUMINISTROS_REGISTRO_DAO;
/
