CREATE OR REPLACE PACKAGE BODY pkgln_fechas
AS
    /*
    || =========================================================================
    || Paquete: pkgln_fechas (Body)
    || Propósito: Implementación de algoritmos de cálculo de fechas/horas
    || Regla: No accede a tablas de negocio.
    ||         Logging permitido con uti_ge_excepciones_pkg.p_grabar_log.
    || =========================================================================
    */

    vro_error smy_errores%ROWTYPE;

    FUNCTION fn_hora_a_indice (
        p_hora           IN VARCHAR2,
        p_minutos_bloque IN NUMBER DEFAULT 15
    ) RETURN NUMBER
    IS
        v_horas    NUMBER;
        v_minutos  NUMBER;
        v_total    NUMBER;
    BEGIN
        v_horas   := TO_NUMBER(SUBSTR(p_hora, 1, 2));
        v_minutos := TO_NUMBER(SUBSTR(p_hora, 4, 2));

        v_total := (v_horas * 60) + v_minutos;

        RETURN FLOOR(v_total / NVL(p_minutos_bloque, 15));
    EXCEPTION
        WHEN OTHERS THEN
            vro_error.nombre_programa := 'pkgln_fechas';
            vro_error.nombre_metodo   := 'fn_hora_a_indice';
            vro_error.parametros      := 'p_hora: ' || p_hora || CHR(10) || 'p_minutos_bloque: ' || p_minutos_bloque;

            uti_ge_excepciones_pkg.p_grabar_log(vro_error);

            RAISE_APPLICATION_ERROR(
                -20000,
                'Se presento un error comunicarse con soporte. Número error: '
                || vro_error.id
                || ' - '
                || SQLERRM
            );
    END fn_hora_a_indice;

    FUNCTION fn_calcular_duracion (
        p_hora_inicio IN VARCHAR2,
        p_hora_fin    IN VARCHAR2
    ) RETURN NUMBER
    IS
        v_minutos_inicio NUMBER;
        v_minutos_fin    NUMBER;
    BEGIN
        v_minutos_inicio := (TO_NUMBER(SUBSTR(p_hora_inicio, 1, 2)) * 60) + TO_NUMBER(SUBSTR(p_hora_inicio, 4, 2));
        v_minutos_fin    := (TO_NUMBER(SUBSTR(p_hora_fin, 1, 2)) * 60) + TO_NUMBER(SUBSTR(p_hora_fin, 4, 2));

        RETURN (v_minutos_fin - v_minutos_inicio);
    EXCEPTION
        WHEN OTHERS THEN
            vro_error.nombre_programa := 'pkgln_fechas';
            vro_error.nombre_metodo   := 'fn_calcular_duracion';
            vro_error.parametros      := 'p_hora_inicio: ' || p_hora_inicio || CHR(10) || 'p_hora_fin: ' || p_hora_fin;

            uti_ge_excepciones_pkg.p_grabar_log(vro_error);

            RAISE_APPLICATION_ERROR(
                -20000,
                'Se presento un error comunicarse con soporte. Número error: '
                || vro_error.id
                || ' - '
                || SQLERRM
            );
    END fn_calcular_duracion;

END pkgln_fechas;
/
