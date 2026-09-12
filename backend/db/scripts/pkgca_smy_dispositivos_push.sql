-- =============================================================================
-- ESPECIFICACIÓN Y CUERPO: PKGCA_SMY_DISPOSITIVOS_PUSH
-- FAMILIA: pkgca_ (Consultas avanzadas, filtros y búsquedas no-PK)
-- ESTÁNDAR ARQUITECTÓNICO: oracle-plsql-architecture
-- =============================================================================

CREATE OR REPLACE PACKAGE PKGCA_SMY_DISPOSITIVOS_PUSH
AS
    /*
    || =========================================================================
    || Paquete: PKGCA_SMY_DISPOSITIVOS_PUSH
    || Propósito: Búsquedas y consultas no-PK sobre SMY_DISPOSITIVOS_PUSH.
    || Estándar: oracle-plsql-architecture (Familia pkgca_)
    || =========================================================================
    */

    -- Busca un dispositivo por token único retornando el registro completo
    FUNCTION fn_buscar_por_token (
        p_token_dispositivo IN  smy_dispositivos_push.token_dispositivo%TYPE,
        pro_dispositivo     OUT smy_dispositivos_push%ROWTYPE
    ) RETURN BOOLEAN;

END PKGCA_SMY_DISPOSITIVOS_PUSH;
/

CREATE OR REPLACE PACKAGE BODY PKGCA_SMY_DISPOSITIVOS_PUSH
AS

    FUNCTION fn_buscar_por_token (
        p_token_dispositivo IN  smy_dispositivos_push.token_dispositivo%TYPE,
        pro_dispositivo     OUT smy_dispositivos_push%ROWTYPE
    ) RETURN BOOLEAN
    IS
    BEGIN
        SELECT *
          INTO pro_dispositivo
          FROM smy_dispositivos_push
         WHERE token_dispositivo = p_token_dispositivo
           AND ROWNUM = 1;

        RETURN TRUE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN FALSE;
    END fn_buscar_por_token;

END PKGCA_SMY_DISPOSITIVOS_PUSH;
/
