-- =============================================================================
-- ESPECIFICACIÓN Y CUERPO: PKGLN_CONSENTIMIENTOS
-- FAMILIA: pkgln_ (Lógica de Negocio, validaciones y orquestación del caso de uso)
-- ESTÁNDAR ARQUITECTÓNICO: oracle-plsql-architecture
-- REGLA ESTRICTA: Sin sentencias DML directas. Consultas y modificaciones vía
--                 _DAO y PKGCN. En este va el COMMIT.
-- =============================================================================

CREATE OR REPLACE PACKAGE PKGLN_CONSENTIMIENTOS
AS
    /*
    || =========================================================================
    || Paquete: PKGLN_CONSENTIMIENTOS
    || Propósito: Lógica de negocio para la gestión de consentimientos informados,
    ||            validación de firmas digitales y trazabilidad de aprobaciones.
    || Estándar: oracle-plsql-architecture (Familia pkgln_)
    || =========================================================================
    */

    -- Firma digital de un consentimiento informado por parte de un acudiente
    PROCEDURE pr_firmar_consentimiento (
        p_id_consentimiento       IN  smy_consentimientos.id%TYPE,
        p_id_acudiente            IN  smy_acudientes.id%TYPE,
        p_ip_firma                IN  VARCHAR2,
        p_firma_canvas_base64     IN  CLOB,
        p_firma_hash              IN  VARCHAR2,
        p_id_usuario_accion       IN  smy_usuarios.id%TYPE,
        p_mensaje_resultado       OUT VARCHAR2
    );

END PKGLN_CONSENTIMIENTOS;
/

CREATE OR REPLACE PACKAGE BODY PKGLN_CONSENTIMIENTOS
AS
    vro_error smy_errores%ROWTYPE;

    PROCEDURE pr_firmar_consentimiento (
        p_id_consentimiento       IN  smy_consentimientos.id%TYPE,
        p_id_acudiente            IN  smy_acudientes.id%TYPE,
        p_ip_firma                IN  VARCHAR2,
        p_firma_canvas_base64     IN  CLOB,
        p_firma_hash              IN  VARCHAR2,
        p_id_usuario_accion       IN  smy_usuarios.id%TYPE,
        p_mensaje_resultado       OUT VARCHAR2
    ) IS
        vn_id_estado_aprobado     NUMBER(10);
        vn_id_estado_firmado_dest NUMBER(10);
        vro_consentimiento        smy_consentimientos%ROWTYPE;
    BEGIN
        -- 1. Validaciones obligatorias de parámetros
        IF p_id_consentimiento IS NULL THEN
            RAISE_APPLICATION_ERROR(-20001, 'El identificador del consentimiento es obligatorio.');
        END IF;

        IF p_firma_hash IS NULL OR TRIM(p_firma_hash) IS NULL THEN
            RAISE_APPLICATION_ERROR(-20002, 'El hash digital de la firma es obligatorio para garantizar no repudio.');
        END IF;

        -- 2. Validar existencia del consentimiento vía DAO
        vro_consentimiento := PKGSMY_CONSENTIMIENTOS_DAO.f_traer(p_id_consentimiento);
        IF vro_consentimiento.id IS NULL THEN
            RAISE_APPLICATION_ERROR(-20003, 'El consentimiento indicado no existe en el sistema.');
        END IF;

        -- 3. Validar catálogo de estados de consentimiento vía PKGCA_SMY_CONSENTIMIENTOS
        vn_id_estado_aprobado := PKGCA_SMY_CONSENTIMIENTOS.fn_obtener_id_estado_aprobado();
        IF vn_id_estado_aprobado IS NULL THEN
            RAISE_APPLICATION_ERROR(-20004, 'No se encontró el estado de consentimiento aprobado en el catálogo.');
        END IF;

        -- 4. Validar catálogo de estados de firmas de destinatarios vía PKGCA_SMY_CONSENTIMIENTOS
        vn_id_estado_firmado_dest := PKGCA_SMY_CONSENTIMIENTOS.fn_obtener_id_estado_firmado_dest();
        IF vn_id_estado_firmado_dest IS NULL THEN
            RAISE_APPLICATION_ERROR(-20005, 'No se encontró el estado de firma en el catálogo.');
        END IF;

        -- 5. Actualizar estado del consentimiento vía DAO
        vro_consentimiento.id_estado_consentimiento       := vn_id_estado_aprobado;
        vro_consentimiento.fecha_respuesta                := CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE);
        vro_consentimiento.id_usuario_ultima_modificacion := p_id_usuario_accion;
        PKGSMY_CONSENTIMIENTOS_DAO.p_actualizar(vro_consentimiento);

        -- 6. Actualizar destinatario vía DAO (búsqueda no-PK delegada a PKGCA_SMY_CONSENTIMIENTOS)
        DECLARE
            v_id_dest smy_consentimiento_destinatarios.id%TYPE;
            vro_dest  smy_consentimiento_destinatarios%ROWTYPE;
        BEGIN
            v_id_dest := PKGCA_SMY_CONSENTIMIENTOS.fn_buscar_id_destinatario(p_id_consentimiento, p_id_acudiente);

            IF v_id_dest IS NOT NULL AND PKGSMY_CONSENTIMIENTO_DESTINATARIOS_DAO.f_existe(v_id_dest, vro_dest) = TRUE THEN
                vro_dest.id_estado_firma_cons           := vn_id_estado_firmado_dest;
                vro_dest.fecha_accion                   := CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE);
                vro_dest.ip_firma                       := SUBSTR(p_ip_firma, 1, 45);
                vro_dest.firma_digital_hash             := p_firma_hash;
                vro_dest.firma_canvas_base64            := p_firma_canvas_base64;
                vro_dest.id_usuario_ultima_modificacion := p_id_usuario_accion;
                PKGSMY_CONSENTIMIENTO_DESTINATARIOS_DAO.p_actualizar(vro_dest);
            END IF;
        END;

        -- 7. Control transaccional en pkgln_ (COMMIT controlado)
        p_do_commit('pkgln_consentimientos.pr_firmar_consentimiento');

        p_mensaje_resultado := 'Consentimiento firmado y respaldado exitosamente.';

    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            IF SQLCODE BETWEEN -20999 AND -20001 THEN
                RAISE;
            END IF;
            vro_error.nombre_programa     := 'PKGLN_CONSENTIMIENTOS';
            vro_error.nombre_metodo       := 'PR_FIRMAR_CONSENTIMIENTO';
            vro_error.parametros          := 'p_id_consentimiento: ' || p_id_consentimiento || CHR(10) ||
                                             'p_id_acudiente: ' || p_id_acudiente || CHR(10) ||
                                             'p_id_usuario_accion: ' || p_id_usuario_accion;
            vro_error.direccion_ip        := SUBSTR(p_ip_firma, 1, 30);
            vro_error.id_usuario_creacion := p_id_usuario_accion;

            uti_ge_excepciones_pkg.p_grabar_log(vro_error);

            RAISE_APPLICATION_ERROR(-20000, 'Se presento un error comunicarse con soporte. Número error: ' || vro_error.id || ' - ' || SQLERRM);
    END pr_firmar_consentimiento;

END PKGLN_CONSENTIMIENTOS;
/
