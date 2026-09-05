CREATE OR REPLACE PACKAGE BODY pkgcn_ordenes
AS
    /*
    || =========================================================================
    || Paquete: pkgcn_ordenes (Body)
    || Propósito: Orquestación transaccional con control de atomicidad y logging
    || =========================================================================
    */

    vro_error smy_errores%ROWTYPE;

    PROCEDURE pr_confirmar_orden (
        p_id_orden     IN NUMBER,
        p_id_usuario   IN NUMBER,
        p_json_pago    IN CLOB
    )
    IS
        v_orden_row      smy_ordenes%ROWTYPE;
        v_estado_valido  BOOLEAN := FALSE;
    BEGIN
        -- 1. Validar existencia y recuperar datos mediante DAO
        IF NOT pkgsmy_ordenes_dao.f_existe(p_id_orden, v_orden_row) THEN
            RAISE_APPLICATION_ERROR(
                -20001,
                'La orden número ' || p_id_orden || ' no existe en el sistema.'
            );
        END IF;

        -- 2. Validación de regla de negocio: Estado
        IF v_orden_row.estado <> 'PENDIENTE' THEN
            RAISE_APPLICATION_ERROR(
                -20002,
                'La orden no se encuentra en estado PENDIENTE. Estado actual: ' || v_orden_row.estado
            );
        END IF;

        -- 3. Descontar inventario coordinando con capa de acceso
        pkgca_inventario.pr_descontar_stock_orden(p_id_orden);

        -- 4. Registrar transacción de pago delegando al DAO correspondiente
        -- (ejemplo invocando pkgsmy_pagos_dao.p_insertar)

        -- 5. Actualizar estado de la orden
        v_orden_row.estado := 'CONFIRMADA';
        v_orden_row.fecha_confirmacion := SYSDATE;
        v_orden_row.usuario_modificacion := p_id_usuario;
        pkgsmy_ordenes_dao.p_actualizar(v_orden_row);

        -- 6. Confirmación atómica de la transacción completa
        COMMIT;

    EXCEPTION
        -- Errores controlados de negocio (no requieren rollback ni registro de soporte)
        WHEN OTHERS THEN
            -- Errores de negocio explícitos (-20001 .. -20999) se dejan pasar si no son inesperados
            IF SQLCODE BETWEEN -20999 AND -20001 THEN
                ROLLBACK;
                RAISE;
            END IF;

            -- 1. Revertir toda la transacción pendiente
            ROLLBACK;

            -- 2. Metadatos exactos para trazabilidad
            vro_error.nombre_programa := 'pkgcn_ordenes';
            vro_error.nombre_metodo   := 'pr_confirmar_orden';

            -- 3. Registro formateado de parámetros
            vro_error.parametros :=
                   'p_id_orden: ' || p_id_orden
                || CHR(10)
                || 'p_id_usuario: ' || p_id_usuario
                || CHR(10)
                || 'p_json_pago: '
                || CASE 
                       WHEN DBMS_LOB.GETLENGTH(p_json_pago) > 3000 
                       THEN SUBSTR(p_json_pago, 1, 3000) || '... [TRUNCADO]'
                       ELSE p_json_pago
                   END;

            -- 4. Registrar en smy_ERRORES vía transacción autónoma
            uti_ge_excepciones_pkg.p_grabar_log(vro_error);

            -- 5. Devolver error al consumidor con ID único
            RAISE_APPLICATION_ERROR(
                -20000,
                'Se presento un error comunicarse con soporte. Número error: '
                || vro_error.id
                || ' - '
                || SQLERRM
            );
    END pr_confirmar_orden;

END pkgcn_ordenes;
/
