-- =============================================================================
-- ESPECIFICACIÓN Y CUERPO: PKGCN_CONSENTIMIENTOS
-- FAMILIA: pkgcn_ (Sentencias DML de proceso que involucran MÁS DE UNA TABLA)
-- ESTÁNDAR ARQUITECTÓNICO: oracle-plsql-architecture
-- REGLA ESTRICTA: Solo sentencias DML multi-tabla. Sin lógica de negocio ni COMMIT.
-- =============================================================================

CREATE OR REPLACE PACKAGE PKGCN_CONSENTIMIENTOS
AS
    /*
    || =========================================================================
    || Paquete: PKGCN_CONSENTIMIENTOS
    || Propósito: Sentencias DML técnicas que involucran como mínimo dos tablas
    ||            dentro de una misma sentencia SQL en el dominio de consentimientos.
    || Estándar: oracle-plsql-architecture (Familia pkgcn_)
    || Reglas:
    ||   1. Exactamente un método por cada sentencia DML.
    ||   2. La sentencia DML debe involucrar como mínimo dos tablas en su sintaxis SQL.
    ||   3. Sin lógica de negocio ni COMMIT/ROLLBACK.
    || =========================================================================
    */

    -- Sentencia DML única que involucra SMY_CONSENTIMIENTO_DESTINATARIOS y SMY_CONSENTIMIENTOS
    PROCEDURE pr_anular_destinatarios_por_consentimiento (
        p_id_consentimiento IN smy_consentimientos.id%TYPE,
        p_id_estado_anulado IN NUMBER,
        p_id_usuario        IN smy_usuarios.id%TYPE
    );

END PKGCN_CONSENTIMIENTOS;
/

CREATE OR REPLACE PACKAGE BODY PKGCN_CONSENTIMIENTOS
AS

    PROCEDURE pr_anular_destinatarios_por_consentimiento (
        p_id_consentimiento IN smy_consentimientos.id%TYPE,
        p_id_estado_anulado IN NUMBER,
        p_id_usuario        IN smy_usuarios.id%TYPE
    ) IS
    BEGIN
        -- Sentencia DML única que involucra como mínimo dos tablas: SMY_CONSENTIMIENTO_DESTINATARIOS y SMY_CONSENTIMIENTOS
        UPDATE smy_consentimiento_destinatarios d
           SET d.id_estado_firma_cons           = p_id_estado_anulado,
               d.id_usuario_ultima_modificacion = p_id_usuario,
               d.fecha_accion                   = CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE)
         WHERE EXISTS (
             SELECT 1
               FROM smy_consentimientos c
              WHERE c.id = d.id_consentimiento
                AND c.id = p_id_consentimiento
                AND c.id_estado_consentimiento = 3 -- Cancelado / Vencido
         );
        -- Sin COMMIT; el commit pertenece al orquestador pkgln_
    END pr_anular_destinatarios_por_consentimiento;

END PKGCN_CONSENTIMIENTOS;
/
