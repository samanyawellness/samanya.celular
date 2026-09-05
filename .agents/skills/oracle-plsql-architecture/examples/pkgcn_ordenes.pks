CREATE OR REPLACE PACKAGE pkgcn_ordenes
AS
    /*
    || =========================================================================
    || Paquete: pkgcn_ordenes
    || Propósito: Lógica de negocio transaccional para la gestión de órdenes.
    || Responsabilidad: Orquestación multi-tabla, atomicidad, validación de reglas.
    || =========================================================================
    */

    -- Procedimiento transaccional para confirmar una orden de compra
    PROCEDURE pr_confirmar_orden (
        p_id_orden     IN NUMBER,
        p_id_usuario   IN NUMBER,
        p_json_pago    IN CLOB
    );

END pkgcn_ordenes;
/
