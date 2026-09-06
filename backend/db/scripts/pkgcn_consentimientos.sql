-- =============================================================================
-- ESPECIFICACIÓN Y CUERPO: PKGCN_CONSENTIMIENTOS
-- FAMILIA: pkgcn_ (Transacciones atómicas de negocio, COMMIT/ROLLBACK y logging en SMY_ERRORES)
-- ESTÁNDAR ARQUITECTÓNICO: oracle-plsql-architecture
-- =============================================================================

CREATE OR REPLACE PACKAGE PKGCN_CONSENTIMIENTOS
AS
    /**
     * Registra la firma digital de un acudiente sobre un consentimiento informado,
     * actualizando trazabilidad, sello de tiempo, hash digital y estado global.
     */
    PROCEDURE p_firmar_consentimiento (
        p_id_consentimiento       IN  smy_consentimientos.id%TYPE,
        p_id_acudiente            IN  smy_acudientes.id%TYPE,
        p_ip_firma                IN  VARCHAR2,
        p_firma_canvas_base64     IN  CLOB,
        p_firma_hash              IN  VARCHAR2,
        p_id_usuario_accion       IN  smy_usuarios.id%TYPE,
        p_mensaje_resultado       OUT VARCHAR2
    );

END PKGCN_CONSENTIMIENTOS;
/

CREATE OR REPLACE PACKAGE BODY PKGCN_CONSENTIMIENTOS
AS

    PROCEDURE p_firmar_consentimiento (
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
        vro_error                 smy_errores%ROWTYPE;
    BEGIN
        -- 1. Validar estado APROBADO en catálogo de consentimientos
        BEGIN
            SELECT id INTO vn_id_estado_aprobado
              FROM smy_estados_consentimientos
             WHERE (UPPER(nombre_estado_consentimiento) LIKE '%APROBADO%'
                 OR UPPER(nombre_estado_consentimiento) LIKE '%FIRMADO%')
               AND ROWNUM = 1;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RAISE_APPLICATION_ERROR(-20001, 'No se encontró el estado de consentimiento aprobado en el catálogo.');
        END;

        -- 2. Validar estado FIRMADO en catálogo de firmas de destinatarios
        BEGIN
            SELECT id INTO vn_id_estado_firmado_dest
              FROM smy_estados_firmas_cons
             WHERE (UPPER(nombre_estado_firma_cons) LIKE '%FIRMADO%'
                 OR UPPER(nombre_estado_firma_cons) LIKE '%APROBADO%')
               AND ROWNUM = 1;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                RAISE_APPLICATION_ERROR(-20002, 'No se encontró el estado de firma en el catálogo.');
        END;

        -- 3. Actualizar registro del documento de consentimiento
        UPDATE smy_consentimientos
           SET id_estado_consentimiento       = vn_id_estado_aprobado,
               fecha_respuesta                = CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE),
               id_usuario_ultima_modificacion = p_id_usuario_accion
         WHERE id = p_id_consentimiento;

        IF SQL%ROWCOUNT = 0 THEN
            RAISE_APPLICATION_ERROR(-20003, 'El consentimiento indicado no existe en el sistema.');
        END IF;

        -- 4. Actualizar o registrar la firma del destinatario
        UPDATE smy_consentimiento_destinatarios
           SET id_estado_firma_cons           = vn_id_estado_firmado_dest,
               fecha_accion                   = CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE),
               ip_firma                       = p_ip_firma,
               firma_digital_hash             = p_firma_hash,
               firma_canvas_base64            = p_firma_canvas_base64,
               id_usuario_ultima_modificacion = p_id_usuario_accion
         WHERE id_consentimiento = p_id_consentimiento
           AND (p_id_acudiente IS NULL OR id_acudiente = p_id_acudiente);

        -- 5. Control de confirmación transaccional
        COMMIT;

        p_mensaje_resultado := 'Consentimiento firmado y respaldado exitosamente.';

    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            IF SQLCODE BETWEEN -20999 AND -20001 THEN
                RAISE;
            END IF;
            vro_error.nombre_programa     := 'PKGCN_CONSENTIMIENTOS';
            vro_error.nombre_metodo       := 'P_FIRMAR_CONSENTIMIENTO';
            vro_error.parametros          := 'p_id_consentimiento: ' || p_id_consentimiento || CHR(10) ||
                                             'p_id_acudiente: ' || p_id_acudiente || CHR(10) ||
                                             'p_id_usuario_accion: ' || p_id_usuario_accion;
            vro_error.direccion_ip        := SUBSTR(p_ip_firma, 1, 30);
            vro_error.id_usuario_creacion := p_id_usuario_accion;

            uti_ge_excepciones_pkg.p_grabar_log(vro_error);

            RAISE_APPLICATION_ERROR(-20000, 'Se presento un error comunicarse con soporte. Número error: ' || vro_error.id || ' - ' || SQLERRM);
    END p_firmar_consentimiento;

END PKGCN_CONSENTIMIENTOS;
/
