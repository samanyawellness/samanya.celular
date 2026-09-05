-- =============================================================================
-- ESPECIFICACIÓN Y CUERPO OFICIAL PKGCN: PKGCN_AUTH
-- ESTÁNDAR ARQUITECTÓNICO: oracle-plsql-architecture
-- =============================================================================

CREATE OR REPLACE PACKAGE PKGCN_AUTH
AS
    -- Autenticación y registro de acceso
    PROCEDURE pr_autenticar (
        p_usuario_o_email   IN VARCHAR2,
        p_direccion_ip      IN VARCHAR2,
        p_dispositivo_info  IN VARCHAR2,
        p_cursor_usuario    OUT SYS_REFCURSOR
    );

    -- Registro y actualización de token push para dispositivos móviles
    PROCEDURE pr_registrar_dispositivo_push (
        p_id_usuario        IN smy_usuarios.id%TYPE,
        p_token_dispositivo IN smy_dispositivos_push.token_dispositivo%TYPE,
        p_plataforma        IN smy_dispositivos_push.plataforma%TYPE
    );

    -- Desactivación de token push al cerrar sesión
    PROCEDURE pr_desactivar_dispositivo_push (
        p_id_usuario        IN smy_usuarios.id%TYPE,
        p_token_dispositivo IN smy_dispositivos_push.token_dispositivo%TYPE
    );

END PKGCN_AUTH;
/

CREATE OR REPLACE PACKAGE BODY PKGCN_AUTH
AS
    vro_error smy_errores%ROWTYPE;

    PROCEDURE pr_autenticar (
        p_usuario_o_email   IN VARCHAR2,
        p_direccion_ip      IN VARCHAR2,
        p_dispositivo_info  IN VARCHAR2,
        p_cursor_usuario    OUT SYS_REFCURSOR
    ) IS
        l_id_usuario smy_usuarios.id%TYPE;
    BEGIN
        -- Buscar ID de usuario
        BEGIN
            SELECT id
              INTO l_id_usuario
              FROM smy_usuarios
             WHERE (LOWER(username) = LOWER(p_usuario_o_email) OR LOWER(email) = LOWER(p_usuario_o_email))
               AND ROWNUM = 1;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                -- Registrar intento fallido
                INSERT INTO smy_auditoria_accesos (
                    id_usuario, direccion_ip, dispositivo_info, exitoso, detalle, fecha_creacion
                ) VALUES (
                    NULL, SUBSTR(p_direccion_ip, 1, 45), SUBSTR(p_dispositivo_info, 1, 255), 'N',
                    'Usuario o correo no encontrado', CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE)
                );
                COMMIT;
                RAISE_APPLICATION_ERROR(-20001, 'Credenciales inválidas');
        END;

        -- Actualizar último acceso del usuario
        UPDATE smy_usuarios
           SET ultimo_acceso = CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE)
         WHERE id = l_id_usuario;

        -- Registrar acceso exitoso
        INSERT INTO smy_auditoria_accesos (
            id_usuario, direccion_ip, dispositivo_info, exitoso, detalle, fecha_creacion
        ) VALUES (
            l_id_usuario, SUBSTR(p_direccion_ip, 1, 45), SUBSTR(p_dispositivo_info, 1, 255), 'S',
            'Autenticación exitosa', CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE)
        );

        -- Retornar datos completos vía SYS_REFCURSOR
        OPEN p_cursor_usuario FOR
            SELECT u.id,
                   u.username,
                   u.email,
                   u.password_hash,
                   u.nombre_completo,
                   u.telefono,
                   u.avatar_url,
                   u.id_estado_usuario,
                   r.codigo AS codigo_rol,
                   r.nombre AS nombre_rol,
                   e.nombre_estado_usuario
              FROM smy_usuarios u
              JOIN smy_roles r ON r.id = u.id_rol
              JOIN smy_estados_usuarios e ON e.id = u.id_estado_usuario
             WHERE u.id = l_id_usuario;

        COMMIT;

    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            IF SQLCODE BETWEEN -20999 AND -20001 THEN
                RAISE;
            END IF;
            vro_error.nombre_programa := 'PKGCN_AUTH';
            vro_error.nombre_metodo   := 'PR_AUTENTICAR';
            vro_error.parametros      := 'p_usuario_o_email: ' || p_usuario_o_email || CHR(10) ||
                                         'p_direccion_ip: ' || p_direccion_ip;
            uti_ge_excepciones_pkg.p_grabar_log(vro_error);
            RAISE_APPLICATION_ERROR(-20000, 'Se presento un error comunicarse con soporte. Número error: ' || vro_error.id || ' - ' || SQLERRM);
    END pr_autenticar;

    PROCEDURE pr_registrar_dispositivo_push (
        p_id_usuario        IN smy_usuarios.id%TYPE,
        p_token_dispositivo IN smy_dispositivos_push.token_dispositivo%TYPE,
        p_plataforma        IN smy_dispositivos_push.plataforma%TYPE
    ) IS
    BEGIN
        MERGE INTO smy_dispositivos_push d
        USING (SELECT p_id_usuario AS id_usuario, p_token_dispositivo AS token_dispositivo, p_plataforma AS plataforma FROM DUAL) s
        ON (d.token_dispositivo = s.token_dispositivo)
        WHEN MATCHED THEN
            UPDATE SET d.id_usuario                     = s.id_usuario,
                       d.plataforma                     = s.plataforma,
                       d.activo                         = 'S',
                       d.fecha_ultimo_uso               = CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE),
                       d.id_usuario_ultima_modificacion = s.id_usuario
        WHEN NOT MATCHED THEN
            INSERT (
                id_usuario, token_dispositivo, plataforma, fecha_ultimo_uso, activo, fecha_creacion, id_usuario_ultima_modificacion
            ) VALUES (
                s.id_usuario, s.token_dispositivo, s.plataforma, CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE),
                'S', CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE), s.id_usuario
            );

        COMMIT;
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            vro_error.nombre_programa := 'PKGCN_AUTH';
            vro_error.nombre_metodo   := 'PR_REGISTRAR_DISPOSITIVO_PUSH';
            vro_error.parametros      := 'p_id_usuario: ' || p_id_usuario || CHR(10) ||
                                         'p_plataforma: ' || p_plataforma;
            uti_ge_excepciones_pkg.p_grabar_log(vro_error);
            RAISE_APPLICATION_ERROR(-20000, 'Se presento un error comunicarse con soporte. Número error: ' || vro_error.id || ' - ' || SQLERRM);
    END pr_registrar_dispositivo_push;

    PROCEDURE pr_desactivar_dispositivo_push (
        p_id_usuario        IN smy_usuarios.id%TYPE,
        p_token_dispositivo IN smy_dispositivos_push.token_dispositivo%TYPE
    ) IS
    BEGIN
        UPDATE smy_dispositivos_push
           SET activo = 'N',
               id_usuario_ultima_modificacion = p_id_usuario
         WHERE token_dispositivo = p_token_dispositivo;

        COMMIT;
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            vro_error.nombre_programa := 'PKGCN_AUTH';
            vro_error.nombre_metodo   := 'PR_DESACTIVAR_DISPOSITIVO_PUSH';
            vro_error.parametros      := 'p_id_usuario: ' || p_id_usuario;
            uti_ge_excepciones_pkg.p_grabar_log(vro_error);
            RAISE_APPLICATION_ERROR(-20000, 'Se presento un error comunicarse con soporte. Número error: ' || vro_error.id || ' - ' || SQLERRM);
    END pr_desactivar_dispositivo_push;

END PKGCN_AUTH;
/
