-- =============================================================================
-- PROCEDIMIENTO: P_DO_COMMIT
-- PROPÓSITO: Ejecución centralizada y controlada de transacciones (COMMIT)
-- ESTÁNDAR ARQUITECTÓNICO: oracle-plsql-architecture
-- =============================================================================

CREATE OR REPLACE PROCEDURE p_do_commit (
    p_contexto IN VARCHAR2 DEFAULT 'General'
) AS
BEGIN
    -- Aquí puedes agregar lógica de control o auditoría previa
    DBMS_OUTPUT.PUT_LINE('Ejecutando COMMIT controlado para: ' || p_contexto);
    
    COMMIT;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Control de errores en caso de que el commit falle
        DBMS_OUTPUT.PUT_LINE('Error al ejecutar COMMIT en ' || p_contexto || ': ' || SQLERRM);
        RAISE;
END;
/
