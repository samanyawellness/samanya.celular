CREATE OR REPLACE PACKAGE BODY pkgca_usuarios
AS
    /*
    || =========================================================================
    || Paquete: pkgca_usuarios (Body)
    || Propósito: Implementación de búsquedas multi-fila y DML por atributos
    || =========================================================================
    */

    FUNCTION fn_buscar_usuarios (
        p_nombre   IN VARCHAR2,
        p_estado   IN NUMBER,
        p_rol_id   IN NUMBER
    ) RETURN SYS_REFCURSOR
    IS
        l_cursor SYS_REFCURSOR;
    BEGIN
        OPEN l_cursor FOR
            SELECT u.id,
                   u.nombre,
                   u.correo,
                   u.estado,
                   u.rol_id,
                   u.fecha_creacion
              FROM smy_usuarios u
             WHERE (p_nombre IS NULL OR UPPER(u.nombre) LIKE '%' || UPPER(p_nombre) || '%')
               AND (p_estado IS NULL OR u.estado = p_estado)
               AND (p_rol_id IS NULL OR u.rol_id = p_rol_id)
             ORDER BY u.nombre ASC;

        RETURN l_cursor;
    END fn_buscar_usuarios;

    PROCEDURE pr_inactivar_usuarios_inactivos (
        p_dias_inactividad IN NUMBER
    )
    IS
    BEGIN
        -- No ejecuta COMMIT: la transacción pertenece a la capa superior (batch o pkgcn)
        UPDATE smy_usuarios
           SET estado = 0,
               fecha_modificacion = SYSDATE
         WHERE estado = 1
           AND fecha_ultimo_ingreso < (SYSDATE - p_dias_inactividad);
    END pr_inactivar_usuarios_inactivos;

END pkgca_usuarios;
/
