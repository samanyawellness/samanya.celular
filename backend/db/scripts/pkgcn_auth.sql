-- =============================================================================
-- ESPECIFICACIÓN Y CUERPO: PKGCN_AUTH
-- FAMILIA: pkgcn_ (Sentencias DML de proceso que involucran MÁS DE UNA TABLA)
-- ESTÁNDAR ARQUITECTÓNICO: oracle-plsql-architecture
-- REGLA ESTRICTA: Solo sentencias DML multi-tabla. Sin lógica de negocio ni COMMIT.
-- =============================================================================

CREATE OR REPLACE PACKAGE PKGCN_AUTH
AS
    /*
    || =========================================================================
    || Paquete: PKGCN_AUTH
    || Propósito: Sentencias DML técnicas que involucran como mínimo dos tablas
    ||            dentro de una misma sentencia SQL en el dominio de autenticación.
    || Estándar: oracle-plsql-architecture (Familia pkgcn_)
    || Reglas:
    ||   1. Exactamente un método por cada sentencia DML.
    ||   2. La sentencia DML debe involucrar como mínimo dos tablas en su sintaxis SQL.
    ||   3. Sin lógica de negocio ni COMMIT/ROLLBACK.
    || =========================================================================
    */

    -- Sentencia DML única que involucra SMY_DISPOSITIVOS_PUSH y SMY_USUARIOS
    PROCEDURE pr_desactivar_tokens_usuarios_inactivos;

END PKGCN_AUTH;
/

CREATE OR REPLACE PACKAGE BODY PKGCN_AUTH
AS

    PROCEDURE pr_desactivar_tokens_usuarios_inactivos IS
    BEGIN
        -- Sentencia DML única que involucra como mínimo dos tablas: SMY_DISPOSITIVOS_PUSH y SMY_USUARIOS
        UPDATE smy_dispositivos_push dp
           SET dp.activo = 'N'
         WHERE dp.activo = 'S'
           AND EXISTS (
               SELECT 1
                 FROM smy_usuarios u
                WHERE u.id = dp.id_usuario
                  AND u.id_estado_usuario != 1
           );
        -- Sin COMMIT; el commit pertenece al orquestador pkgln_
    END pr_desactivar_tokens_usuarios_inactivos;

END PKGCN_AUTH;
/
