CREATE OR REPLACE FUNCTION f_fecha_actual
    RETURN DATE
IS
    l_date      date;
BEGIN
    SELECT (SYSTIMESTAMP AT TIME ZONE 'America/Bogota') INTO l_date
      FROM DUAL;
    RETURN l_date;
END f_fecha_actual;
/