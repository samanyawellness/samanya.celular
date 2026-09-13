-- =============================================================================
-- ESPECIFICACIÓN Y CUERPO: PKGCN_ARCHIVOS
-- FAMILIA: pkgcn_ (Sentencias DML de proceso que involucran MÁS DE UNA TABLA)
-- ESTÁNDAR ARQUITECTÓNICO: oracle-plsql-architecture
-- REGLA ESTRICTA: Solo sentencias DML multi-tabla. Sin lógica de negocio ni COMMIT.
-- =============================================================================

CREATE OR REPLACE PACKAGE PKGCN_ARCHIVOS
AS
    /*
    || =========================================================================
    || Paquete: PKGCN_ARCHIVOS
    || Propósito: Sentencias DML técnicas que involucran como mínimo dos tablas
    ||            dentro de una misma sentencia SQL en el dominio de archivos.
    || Estándar: oracle-plsql-architecture (Familia pkgcn_)
    || Reglas:
    ||   1. Exactamente un método por cada sentencia DML.
    ||   2. La sentencia DML debe involucrar como mínimo dos tablas en su sintaxis SQL.
    ||   3. Sin lógica de negocio ni COMMIT/ROLLBACK.
    || =========================================================================
    */

    -- Sentencia DML única que involucra SMY_ARCHIVOS y SMY_DOCUMENTOS_CLINICOS
    PROCEDURE pr_desvincular_archivos_doc (
        p_id_documento_clinico IN smy_documentos_clinicos.id%TYPE,
        p_id_usuario           IN smy_usuarios.id%TYPE
    );

END PKGCN_ARCHIVOS;
/

CREATE OR REPLACE PACKAGE BODY PKGCN_ARCHIVOS
AS

    PROCEDURE pr_desvincular_archivos_doc (
        p_id_documento_clinico IN smy_documentos_clinicos.id%TYPE,
        p_id_usuario           IN smy_usuarios.id%TYPE
    ) IS
    BEGIN
        -- Sentencia DML única que involucra como mínimo dos tablas: SMY_ARCHIVOS y SMY_DOCUMENTOS_CLINICOS
        UPDATE smy_archivos a
           SET a.id_estado_archivo              = 2,
               a.fecha_eliminacion              = CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE),
               a.id_usuario_eliminacion         = p_id_usuario,
               a.fecha_ultima_modificacion      = CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE),
               a.id_usuario_ultima_modificacion = p_id_usuario
         WHERE EXISTS (
             SELECT 1
               FROM smy_documentos_clinicos d
              WHERE d.id = p_id_documento_clinico
                AND a.tabla_origen = 'SMY_DOCUMENTOS_CLINICOS'
                AND a.id_registro_origen = d.id
         );
        -- Sin COMMIT; el commit pertenece al orquestador pkgln_
    END pr_desvincular_archivos_doc;

END PKGCN_ARCHIVOS;
/
