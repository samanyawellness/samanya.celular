CREATE OR REPLACE PACKAGE uti_ge_excepciones_pkg 
AS
    PROCEDURE p_grabar_log (pro_smy_errores IN OUT smy_errores%ROWTYPE);
END uti_ge_excepciones_pkg;
/
CREATE OR REPLACE PACKAGE BODY uti_ge_excepciones_pkg 
AS
    PROCEDURE p_grabar_log (pro_smy_errores IN OUT smy_errores%ROWTYPE)
    AS
        PRAGMA AUTONOMOUS_TRANSACTION;
    BEGIN
        pro_smy_errores := pro_smy_errores;
        -- Valores por defecto
        pro_smy_errores.id := seq_smy_errores.nextval;
        pro_smy_errores.fecha_creacion := f_fecha_actual;
        pro_smy_errores.codigo_error := SQLCODE;
        pro_smy_errores.texto_error := SUBSTR (SQLERRM, 1, 3999);
        pro_smy_errores.mensaje_error := DBMS_UTILITY.format_error_backtrace ();

        IF pro_smy_errores.tipo IS NULL
        THEN
            pro_smy_errores.tipo := 'E';
        END IF;

        IF pro_smy_errores.usuario IS NULL
        THEN
            pro_smy_errores.usuario := USER;
        END IF;

        pkgsmy_errores_dao.p_insertar (pro_smy_errores);
        p_do_commit('uti_ge_excepciones_pkg.p_grabar_log');
    END p_grabar_log;
END uti_ge_excepciones_pkg;
/

