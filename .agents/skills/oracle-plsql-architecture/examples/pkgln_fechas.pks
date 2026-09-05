CREATE OR REPLACE PACKAGE pkgln_fechas
AS
    /*
    || =========================================================================
    || Paquete: pkgln_fechas
    || Propósito: Lógica funcional pura y utilidades de tiempo/fechas
    || Regla: Sin acceso directo a tablas relacionales de negocio ni DML
    || =========================================================================
    */

    -- Convierte una hora en formato HH24:MI a un índice numérico de bloque de tiempo
    FUNCTION fn_hora_a_indice (
        p_hora           IN VARCHAR2,
        p_minutos_bloque IN NUMBER DEFAULT 15
    ) RETURN NUMBER;

    -- Calcula la duración en minutos entre dos horas en formato HH24:MI
    FUNCTION fn_calcular_duracion (
        p_hora_inicio IN VARCHAR2,
        p_hora_fin    IN VARCHAR2
    ) RETURN NUMBER;

END pkgln_fechas;
/
