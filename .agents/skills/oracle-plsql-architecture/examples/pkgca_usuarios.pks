CREATE OR REPLACE PACKAGE pkgca_usuarios
AS
    /*
    || =========================================================================
    || Paquete: pkgca_usuarios
    || Propósito: Consultas avanzadas, filtros multi-criterio y DML masivo sobre
    ||            la entidad de Usuarios sin depender de PK única.
    || =========================================================================
    */

    -- Búsqueda multi-fila por filtros dinámicos (Retorna SYS_REFCURSOR)
    FUNCTION fn_buscar_usuarios (
        p_nombre   IN VARCHAR2,
        p_estado   IN NUMBER,
        p_rol_id   IN NUMBER
    ) RETURN SYS_REFCURSOR;

    -- Actualización masiva por estado y antigüedad
    PROCEDURE pr_inactivar_usuarios_inactivos (
        p_dias_inactividad IN NUMBER
    );

END pkgca_usuarios;
/
