-- =============================================================================
-- PROYECTO: SAMANYA OS
-- ARCHIVO: build_all.sql
-- DESCRIPCIÓN: Script maestro de compilación de todos los objetos PL/SQL.
--              Incluye los 81 paquetes DAO oficiales, paquetes de consulta (pkgca_)
--              y paquetes de lógica de negocio transaccional (pkgcn_).
--              Muestra tiempo de compilación por objeto, tiempo total y hora
--              oficial de Bogotá, Colombia (UTC-5).
-- =============================================================================

SET SERVEROUTPUT ON SIZE UNLIMITED;
SET FEEDBACK OFF;
SET VERIFY OFF;
SET HEADING OFF;
SET LINESIZE 200;
SET PAGESIZE 0;
WHENEVER SQLERROR CONTINUE;

-- -----------------------------------------------------------------------------
-- 0. CONFIGURACIÓN DE HORA OFICIAL DE BOGOTÁ, COLOMBIA (UTC-5)
-- -----------------------------------------------------------------------------
COLUMN col_bogota_date NEW_VALUE v_fecha_bogota NOPRINT;
SELECT TO_CHAR(CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE), 'YYYY-MM-DD HH24:MI:SS') AS col_bogota_date FROM DUAL;
DEFINE _DATE = "&v_fecha_bogota"

-- Variables de cronometraje de alta precisión (hsecs: 1/100 s)
VARIABLE v_t_total_ini NUMBER;
VARIABLE v_t_total_fin NUMBER;
VARIABLE v_t_obj_ini   NUMBER;
VARIABLE v_t_obj_fin   NUMBER;

BEGIN
    :v_t_total_ini := DBMS_UTILITY.GET_TIME;
END;
/

SET FEEDBACK ON;

PROMPT ============================================================================
PROMPT   INICIANDO COMPILACIÓN COMPLETA DE OBJETOS PL/SQL - SAMANYA OS
PROMPT   TOTAL OBJETOS A COMPILAR: 84
PROMPT   HORA OFICIAL (Bogotá, Colombia - UTC-5): &&_DATE
PROMPT ============================================================================
PROMPT

-- =============================================================================
-- 1. CAPA DE ACCESO A DATOS: PAQUETES DAO (81 TABLAS DEL ESQUEMA SMY_)
-- =============================================================================
PROMPT [1/84] Compilando PKGSMY_ACUDIENTES_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_acudientes_dao.sql
SHOW ERRORS PACKAGE PKGSMY_ACUDIENTES_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_ACUDIENTES_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_ACUDIENTES_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [2/84] Compilando PKGSMY_ALCANCES_TAREAS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_alcances_tareas_dao.sql
SHOW ERRORS PACKAGE PKGSMY_ALCANCES_TAREAS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_ALCANCES_TAREAS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_ALCANCES_TAREAS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [3/84] Compilando PKGSMY_AREAS_EMPLEADOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_areas_empleados_dao.sql
SHOW ERRORS PACKAGE PKGSMY_AREAS_EMPLEADOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_AREAS_EMPLEADOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_AREAS_EMPLEADOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [4/84] Compilando PKGSMY_AUDITORIA_ACCESOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_auditoria_accesos_dao.sql
SHOW ERRORS PACKAGE PKGSMY_AUDITORIA_ACCESOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_AUDITORIA_ACCESOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_AUDITORIA_ACCESOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [5/84] Compilando PKGSMY_BITACORA_RESIDENTE_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_bitacora_residente_dao.sql
SHOW ERRORS PACKAGE PKGSMY_BITACORA_RESIDENTE_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_BITACORA_RESIDENTE_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_BITACORA_RESIDENTE_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [6/84] Compilando PKGSMY_CANALES_NOTIFICACION_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_canales_notificacion_dao.sql
SHOW ERRORS PACKAGE PKGSMY_CANALES_NOTIFICACION_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_CANALES_NOTIFICACION_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_CANALES_NOTIFICACION_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [7/84] Compilando PKGSMY_CARGOS_EMPLEADOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_cargos_empleados_dao.sql
SHOW ERRORS PACKAGE PKGSMY_CARGOS_EMPLEADOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_CARGOS_EMPLEADOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_CARGOS_EMPLEADOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [8/84] Compilando PKGSMY_CATEGORIAS_BITACORA_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_categorias_bitacora_dao.sql
SHOW ERRORS PACKAGE PKGSMY_CATEGORIAS_BITACORA_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_CATEGORIAS_BITACORA_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_CATEGORIAS_BITACORA_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [9/84] Compilando PKGSMY_CATEGORIAS_DOC_CLINICOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_categorias_doc_clinicos_dao.sql
SHOW ERRORS PACKAGE PKGSMY_CATEGORIAS_DOC_CLINICOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_CATEGORIAS_DOC_CLINICOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_CATEGORIAS_DOC_CLINICOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [10/84] Compilando PKGSMY_CHAT_PARTICIPANTES_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_chat_participantes_dao.sql
SHOW ERRORS PACKAGE PKGSMY_CHAT_PARTICIPANTES_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_CHAT_PARTICIPANTES_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_CHAT_PARTICIPANTES_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [11/84] Compilando PKGSMY_CONSENTIMIENTO_DESTINATARIOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_consentimiento_destinatarios_dao.sql
SHOW ERRORS PACKAGE PKGSMY_CONSENTIMIENTO_DESTINATARIOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_CONSENTIMIENTO_DESTINATARIOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_CONSENTIMIENTO_DESTINATARIOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [12/84] Compilando PKGSMY_CONSENTIMIENTOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_consentimientos_dao.sql
SHOW ERRORS PACKAGE PKGSMY_CONSENTIMIENTOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_CONSENTIMIENTOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_CONSENTIMIENTOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [13/84] Compilando PKGSMY_CONSISTENCIAS_DIETA_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_consistencias_dieta_dao.sql
SHOW ERRORS PACKAGE PKGSMY_CONSISTENCIAS_DIETA_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_CONSISTENCIAS_DIETA_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_CONSISTENCIAS_DIETA_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [14/84] Compilando PKGSMY_CONVERSACIONES_CHAT_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_conversaciones_chat_dao.sql
SHOW ERRORS PACKAGE PKGSMY_CONVERSACIONES_CHAT_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_CONVERSACIONES_CHAT_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_CONVERSACIONES_CHAT_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [15/84] Compilando PKGSMY_DISPOSITIVOS_PUSH_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_dispositivos_push_dao.sql
SHOW ERRORS PACKAGE PKGSMY_DISPOSITIVOS_PUSH_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_DISPOSITIVOS_PUSH_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_DISPOSITIVOS_PUSH_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [16/84] Compilando PKGSMY_DOCUMENTOS_CLINICOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_documentos_clinicos_dao.sql
SHOW ERRORS PACKAGE PKGSMY_DOCUMENTOS_CLINICOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_DOCUMENTOS_CLINICOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_DOCUMENTOS_CLINICOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [17/84] Compilando PKGSMY_DOCUMENTOS_ELIMINADOS_LOG_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_documentos_eliminados_log_dao.sql
SHOW ERRORS PACKAGE PKGSMY_DOCUMENTOS_ELIMINADOS_LOG_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_DOCUMENTOS_ELIMINADOS_LOG_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_DOCUMENTOS_ELIMINADOS_LOG_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [18/84] Compilando PKGSMY_DOCUMENTOS_EMPLEADO_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_documentos_empleado_dao.sql
SHOW ERRORS PACKAGE PKGSMY_DOCUMENTOS_EMPLEADO_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_DOCUMENTOS_EMPLEADO_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_DOCUMENTOS_EMPLEADO_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [19/84] Compilando PKGSMY_EMPLEADOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_empleados_dao.sql
SHOW ERRORS PACKAGE PKGSMY_EMPLEADOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_EMPLEADOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_EMPLEADOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [20/84] Compilando PKGSMY_ERRORES_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_errores_dao.sql
SHOW ERRORS PACKAGE PKGSMY_ERRORES_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_ERRORES_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_ERRORES_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [21/84] Compilando PKGSMY_ESTADOS_ADMIN_MED_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_estados_admin_med_dao.sql
SHOW ERRORS PACKAGE PKGSMY_ESTADOS_ADMIN_MED_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_ESTADOS_ADMIN_MED_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_ESTADOS_ADMIN_MED_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [22/84] Compilando PKGSMY_ESTADOS_CONSENTIMIENTOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_estados_consentimientos_dao.sql
SHOW ERRORS PACKAGE PKGSMY_ESTADOS_CONSENTIMIENTOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_ESTADOS_CONSENTIMIENTOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_ESTADOS_CONSENTIMIENTOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [23/84] Compilando PKGSMY_ESTADOS_DOC_CLINICOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_estados_doc_clinicos_dao.sql
SHOW ERRORS PACKAGE PKGSMY_ESTADOS_DOC_CLINICOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_ESTADOS_DOC_CLINICOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_ESTADOS_DOC_CLINICOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [24/84] Compilando PKGSMY_ESTADOS_EMPLEADOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_estados_empleados_dao.sql
SHOW ERRORS PACKAGE PKGSMY_ESTADOS_EMPLEADOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_ESTADOS_EMPLEADOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_ESTADOS_EMPLEADOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [25/84] Compilando PKGSMY_ESTADOS_FIRMAS_CONS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_estados_firmas_cons_dao.sql
SHOW ERRORS PACKAGE PKGSMY_ESTADOS_FIRMAS_CONS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_ESTADOS_FIRMAS_CONS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_ESTADOS_FIRMAS_CONS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [26/84] Compilando PKGSMY_ESTADOS_INCIDENTES_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_estados_incidentes_dao.sql
SHOW ERRORS PACKAGE PKGSMY_ESTADOS_INCIDENTES_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_ESTADOS_INCIDENTES_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_ESTADOS_INCIDENTES_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [27/84] Compilando PKGSMY_ESTADOS_MEDICAMENTOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_estados_medicamentos_dao.sql
SHOW ERRORS PACKAGE PKGSMY_ESTADOS_MEDICAMENTOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_ESTADOS_MEDICAMENTOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_ESTADOS_MEDICAMENTOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [28/84] Compilando PKGSMY_ESTADOS_PAGOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_estados_pagos_dao.sql
SHOW ERRORS PACKAGE PKGSMY_ESTADOS_PAGOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_ESTADOS_PAGOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_ESTADOS_PAGOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [29/84] Compilando PKGSMY_ESTADOS_PERMISOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_estados_permisos_dao.sql
SHOW ERRORS PACKAGE PKGSMY_ESTADOS_PERMISOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_ESTADOS_PERMISOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_ESTADOS_PERMISOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [30/84] Compilando PKGSMY_ESTADOS_PLANTILLAS_TURNO_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_estados_plantillas_turno_dao.sql
SHOW ERRORS PACKAGE PKGSMY_ESTADOS_PLANTILLAS_TURNO_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_ESTADOS_PLANTILLAS_TURNO_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_ESTADOS_PLANTILLAS_TURNO_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [31/84] Compilando PKGSMY_ESTADOS_RESIDENTES_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_estados_residentes_dao.sql
SHOW ERRORS PACKAGE PKGSMY_ESTADOS_RESIDENTES_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_ESTADOS_RESIDENTES_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_ESTADOS_RESIDENTES_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [32/84] Compilando PKGSMY_ESTADOS_ROLES_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_estados_roles_dao.sql
SHOW ERRORS PACKAGE PKGSMY_ESTADOS_ROLES_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_ESTADOS_ROLES_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_ESTADOS_ROLES_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [33/84] Compilando PKGSMY_ESTADOS_SOLICITUDES_ADM_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_estados_solicitudes_adm_dao.sql
SHOW ERRORS PACKAGE PKGSMY_ESTADOS_SOLICITUDES_ADM_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_ESTADOS_SOLICITUDES_ADM_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_ESTADOS_SOLICITUDES_ADM_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [34/84] Compilando PKGSMY_ESTADOS_TAREAS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_estados_tareas_dao.sql
SHOW ERRORS PACKAGE PKGSMY_ESTADOS_TAREAS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_ESTADOS_TAREAS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_ESTADOS_TAREAS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [35/84] Compilando PKGSMY_ESTADOS_TURNOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_estados_turnos_dao.sql
SHOW ERRORS PACKAGE PKGSMY_ESTADOS_TURNOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_ESTADOS_TURNOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_ESTADOS_TURNOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [36/84] Compilando PKGSMY_ESTADOS_USUARIOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_estados_usuarios_dao.sql
SHOW ERRORS PACKAGE PKGSMY_ESTADOS_USUARIOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_ESTADOS_USUARIOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_ESTADOS_USUARIOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [37/84] Compilando PKGSMY_EVENTOS_CALENDARIO_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_eventos_calendario_dao.sql
SHOW ERRORS PACKAGE PKGSMY_EVENTOS_CALENDARIO_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_EVENTOS_CALENDARIO_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_EVENTOS_CALENDARIO_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [38/84] Compilando PKGSMY_GENEROS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_generos_dao.sql
SHOW ERRORS PACKAGE PKGSMY_GENEROS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_GENEROS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_GENEROS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [39/84] Compilando PKGSMY_HISTORIAS_CLINICAS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_historias_clinicas_dao.sql
SHOW ERRORS PACKAGE PKGSMY_HISTORIAS_CLINICAS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_HISTORIAS_CLINICAS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_HISTORIAS_CLINICAS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [40/84] Compilando PKGSMY_INCIDENTE_RESIDENTES_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_incidente_residentes_dao.sql
SHOW ERRORS PACKAGE PKGSMY_INCIDENTE_RESIDENTES_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_INCIDENTE_RESIDENTES_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_INCIDENTE_RESIDENTES_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [41/84] Compilando PKGSMY_INCIDENTES_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_incidentes_dao.sql
SHOW ERRORS PACKAGE PKGSMY_INCIDENTES_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_INCIDENTES_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_INCIDENTES_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [42/84] Compilando PKGSMY_MEDICAMENTOS_PRESCRITOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_medicamentos_prescritos_dao.sql
SHOW ERRORS PACKAGE PKGSMY_MEDICAMENTOS_PRESCRITOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_MEDICAMENTOS_PRESCRITOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_MEDICAMENTOS_PRESCRITOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [43/84] Compilando PKGSMY_MENSAJES_CHAT_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_mensajes_chat_dao.sql
SHOW ERRORS PACKAGE PKGSMY_MENSAJES_CHAT_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_MENSAJES_CHAT_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_MENSAJES_CHAT_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [44/84] Compilando PKGSMY_NIVELES_MOVILIDAD_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_niveles_movilidad_dao.sql
SHOW ERRORS PACKAGE PKGSMY_NIVELES_MOVILIDAD_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_NIVELES_MOVILIDAD_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_NIVELES_MOVILIDAD_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [45/84] Compilando PKGSMY_NOTIFICACIONES_SISTEMA_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_notificaciones_sistema_dao.sql
SHOW ERRORS PACKAGE PKGSMY_NOTIFICACIONES_SISTEMA_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_NOTIFICACIONES_SISTEMA_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_NOTIFICACIONES_SISTEMA_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [46/84] Compilando PKGSMY_PARENTESCOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_parentescos_dao.sql
SHOW ERRORS PACKAGE PKGSMY_PARENTESCOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_PARENTESCOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_PARENTESCOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [47/84] Compilando PKGSMY_PLANES_NUTRICIONALES_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_planes_nutricionales_dao.sql
SHOW ERRORS PACKAGE PKGSMY_PLANES_NUTRICIONALES_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_PLANES_NUTRICIONALES_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_PLANES_NUTRICIONALES_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [48/84] Compilando PKGSMY_PLANTILLAS_TURNO_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_plantillas_turno_dao.sql
SHOW ERRORS PACKAGE PKGSMY_PLANTILLAS_TURNO_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_PLANTILLAS_TURNO_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_PLANTILLAS_TURNO_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [49/84] Compilando PKGSMY_REGISTROS_ADMIN_MED_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_registros_admin_med_dao.sql
SHOW ERRORS PACKAGE PKGSMY_REGISTROS_ADMIN_MED_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_REGISTROS_ADMIN_MED_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_REGISTROS_ADMIN_MED_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [50/84] Compilando PKGSMY_REGISTROS_ALIM_DETALLE_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_registros_alim_detalle_dao.sql
SHOW ERRORS PACKAGE PKGSMY_REGISTROS_ALIM_DETALLE_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_REGISTROS_ALIM_DETALLE_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_REGISTROS_ALIM_DETALLE_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [51/84] Compilando PKGSMY_REGISTROS_ALIM_SESION_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_registros_alim_sesion_dao.sql
SHOW ERRORS PACKAGE PKGSMY_REGISTROS_ALIM_SESION_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_REGISTROS_ALIM_SESION_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_REGISTROS_ALIM_SESION_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [52/84] Compilando PKGSMY_RESIDENTE_ACUDIENTE_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_residente_acudiente_dao.sql
SHOW ERRORS PACKAGE PKGSMY_RESIDENTE_ACUDIENTE_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_RESIDENTE_ACUDIENTE_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_RESIDENTE_ACUDIENTE_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [53/84] Compilando PKGSMY_RESIDENTES_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_residentes_dao.sql
SHOW ERRORS PACKAGE PKGSMY_RESIDENTES_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_RESIDENTES_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_RESIDENTES_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [54/84] Compilando PKGSMY_ROLES_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_roles_dao.sql
SHOW ERRORS PACKAGE PKGSMY_ROLES_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_ROLES_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_ROLES_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [55/84] Compilando PKGSMY_ROLES_EN_INCIDENTE_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_roles_en_incidente_dao.sql
SHOW ERRORS PACKAGE PKGSMY_ROLES_EN_INCIDENTE_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_ROLES_EN_INCIDENTE_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_ROLES_EN_INCIDENTE_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [56/84] Compilando PKGSMY_SEVERIDADES_INCIDENTES_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_severidades_incidentes_dao.sql
SHOW ERRORS PACKAGE PKGSMY_SEVERIDADES_INCIDENTES_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_SEVERIDADES_INCIDENTES_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_SEVERIDADES_INCIDENTES_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [57/84] Compilando PKGSMY_SIGNOS_VITALES_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_signos_vitales_dao.sql
SHOW ERRORS PACKAGE PKGSMY_SIGNOS_VITALES_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_SIGNOS_VITALES_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_SIGNOS_VITALES_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [58/84] Compilando PKGSMY_SOLICITUD_ADM_CONTACTOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_solicitud_adm_contactos_dao.sql
SHOW ERRORS PACKAGE PKGSMY_SOLICITUD_ADM_CONTACTOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_SOLICITUD_ADM_CONTACTOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_SOLICITUD_ADM_CONTACTOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [59/84] Compilando PKGSMY_SOLICITUDES_ADMISION_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_solicitudes_admision_dao.sql
SHOW ERRORS PACKAGE PKGSMY_SOLICITUDES_ADMISION_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_SOLICITUDES_ADMISION_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_SOLICITUDES_ADMISION_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [60/84] Compilando PKGSMY_SOLICITUDES_PERMISOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_solicitudes_permisos_dao.sql
SHOW ERRORS PACKAGE PKGSMY_SOLICITUDES_PERMISOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_SOLICITUDES_PERMISOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_SOLICITUDES_PERMISOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [61/84] Compilando PKGSMY_SUMINISTROS_REGISTRO_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_suministros_registro_dao.sql
SHOW ERRORS PACKAGE PKGSMY_SUMINISTROS_REGISTRO_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_SUMINISTROS_REGISTRO_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_SUMINISTROS_REGISTRO_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [62/84] Compilando PKGSMY_TAREA_RESIDENTES_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_tarea_residentes_dao.sql
SHOW ERRORS PACKAGE PKGSMY_TAREA_RESIDENTES_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_TAREA_RESIDENTES_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_TAREA_RESIDENTES_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [63/84] Compilando PKGSMY_TAREAS_OPERATIVAS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_tareas_operativas_dao.sql
SHOW ERRORS PACKAGE PKGSMY_TAREAS_OPERATIVAS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_TAREAS_OPERATIVAS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_TAREAS_OPERATIVAS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [64/84] Compilando PKGSMY_TIPOS_ADJUNTOS_CHAT_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_tipos_adjuntos_chat_dao.sql
SHOW ERRORS PACKAGE PKGSMY_TIPOS_ADJUNTOS_CHAT_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_TIPOS_ADJUNTOS_CHAT_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_TIPOS_ADJUNTOS_CHAT_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [65/84] Compilando PKGSMY_TIPOS_ARCHIVOS_DOC_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_tipos_archivos_doc_dao.sql
SHOW ERRORS PACKAGE PKGSMY_TIPOS_ARCHIVOS_DOC_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_TIPOS_ARCHIVOS_DOC_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_TIPOS_ARCHIVOS_DOC_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [66/84] Compilando PKGSMY_TIPOS_CANALES_CHAT_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_tipos_canales_chat_dao.sql
SHOW ERRORS PACKAGE PKGSMY_TIPOS_CANALES_CHAT_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_TIPOS_CANALES_CHAT_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_TIPOS_CANALES_CHAT_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [67/84] Compilando PKGSMY_TIPOS_COMIDAS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_tipos_comidas_dao.sql
SHOW ERRORS PACKAGE PKGSMY_TIPOS_COMIDAS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_TIPOS_COMIDAS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_TIPOS_COMIDAS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [68/84] Compilando PKGSMY_TIPOS_CONSENTIMIENTOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_tipos_consentimientos_dao.sql
SHOW ERRORS PACKAGE PKGSMY_TIPOS_CONSENTIMIENTOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_TIPOS_CONSENTIMIENTOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_TIPOS_CONSENTIMIENTOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [69/84] Compilando PKGSMY_TIPOS_DIETAS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_tipos_dietas_dao.sql
SHOW ERRORS PACKAGE PKGSMY_TIPOS_DIETAS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_TIPOS_DIETAS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_TIPOS_DIETAS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [70/84] Compilando PKGSMY_TIPOS_ENTRADAS_DOC_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_tipos_entradas_doc_dao.sql
SHOW ERRORS PACKAGE PKGSMY_TIPOS_ENTRADAS_DOC_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_TIPOS_ENTRADAS_DOC_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_TIPOS_ENTRADAS_DOC_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [71/84] Compilando PKGSMY_TIPOS_EVENTOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_tipos_eventos_dao.sql
SHOW ERRORS PACKAGE PKGSMY_TIPOS_EVENTOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_TIPOS_EVENTOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_TIPOS_EVENTOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [72/84] Compilando PKGSMY_TIPOS_IDENTIFICACION_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_tipos_identificacion_dao.sql
SHOW ERRORS PACKAGE PKGSMY_TIPOS_IDENTIFICACION_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_TIPOS_IDENTIFICACION_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_TIPOS_IDENTIFICACION_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [73/84] Compilando PKGSMY_TIPOS_INCIDENTES_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_tipos_incidentes_dao.sql
SHOW ERRORS PACKAGE PKGSMY_TIPOS_INCIDENTES_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_TIPOS_INCIDENTES_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_TIPOS_INCIDENTES_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [74/84] Compilando PKGSMY_TIPOS_NOTIFICACIONES_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_tipos_notificaciones_dao.sql
SHOW ERRORS PACKAGE PKGSMY_TIPOS_NOTIFICACIONES_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_TIPOS_NOTIFICACIONES_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_TIPOS_NOTIFICACIONES_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [75/84] Compilando PKGSMY_TIPOS_PERMISOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_tipos_permisos_dao.sql
SHOW ERRORS PACKAGE PKGSMY_TIPOS_PERMISOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_TIPOS_PERMISOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_TIPOS_PERMISOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [76/84] Compilando PKGSMY_TIPOS_SUMINISTROS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_tipos_suministros_dao.sql
SHOW ERRORS PACKAGE PKGSMY_TIPOS_SUMINISTROS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_TIPOS_SUMINISTROS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_TIPOS_SUMINISTROS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [77/84] Compilando PKGSMY_TIPOS_TAREAS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_tipos_tareas_dao.sql
SHOW ERRORS PACKAGE PKGSMY_TIPOS_TAREAS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_TIPOS_TAREAS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_TIPOS_TAREAS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [78/84] Compilando PKGSMY_TIPOS_USUARIOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_tipos_usuarios_dao.sql
SHOW ERRORS PACKAGE PKGSMY_TIPOS_USUARIOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_TIPOS_USUARIOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_TIPOS_USUARIOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [79/84] Compilando PKGSMY_TURNOS_ASIGNADOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_turnos_asignados_dao.sql
SHOW ERRORS PACKAGE PKGSMY_TURNOS_ASIGNADOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_TURNOS_ASIGNADOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_TURNOS_ASIGNADOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [80/84] Compilando PKGSMY_USUARIOS_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_usuarios_dao.sql
SHOW ERRORS PACKAGE PKGSMY_USUARIOS_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_USUARIOS_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_USUARIOS_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [81/84] Compilando PKGSMY_VIAS_ADMINISTRACION_DAO...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgsmy_vias_administracion_dao.sql
SHOW ERRORS PACKAGE PKGSMY_VIAS_ADMINISTRACION_DAO;
SHOW ERRORS PACKAGE BODY PKGSMY_VIAS_ADMINISTRACION_DAO;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGSMY_VIAS_ADMINISTRACION_DAO] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
-- =============================================================================
-- 2. CAPA DE CONSULTAS Y BÚSQUEDAS (pkgca_ - Cursors multi-fila y JSON nativo)
-- =============================================================================
PROMPT [82/84] Compilando PKGCA_RESIDENTES...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgca_residentes.sql
SHOW ERRORS PACKAGE PKGCA_RESIDENTES;
SHOW ERRORS PACKAGE BODY PKGCA_RESIDENTES;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGCA_RESIDENTES] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
-- =============================================================================
-- 3. CAPA TRANSACCIONAL Y ORQUESTACIÓN (pkgcn_ - Control atómico y log)
-- =============================================================================
PROMPT [83/84] Compilando PKGCN_AUTH...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgcn_auth.sql
SHOW ERRORS PACKAGE PKGCN_AUTH;
SHOW ERRORS PACKAGE BODY PKGCN_AUTH;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGCN_AUTH] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
PROMPT [84/84] Compilando PKGCN_CONSENTIMIENTOS...
BEGIN :v_t_obj_ini := DBMS_UTILITY.GET_TIME; END;
/
@@pkgcn_consentimientos.sql
SHOW ERRORS PACKAGE PKGCN_CONSENTIMIENTOS;
SHOW ERRORS PACKAGE BODY PKGCN_CONSENTIMIENTOS;
BEGIN
    :v_t_obj_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE('  >>> [PKGCN_CONSENTIMIENTOS] compilado en: ' || 
                         LTRIM(TO_CHAR((:v_t_obj_fin - :v_t_obj_ini) / 100, '9990.99')) || ' s');
END;
/
PROMPT
-- =============================================================================
-- 4. VALIDACIÓN DE OBJETOS INVÁLIDOS EN EL ESQUEMA
-- =============================================================================
PROMPT ============================================================================
PROMPT   REPORTE DE OBJETOS INVÁLIDOS EN EL ESQUEMA (SI EXISTEN)
PROMPT ============================================================================

DECLARE
    vn_invalidos NUMBER := 0;
BEGIN
    FOR reg IN (
        SELECT object_type, object_name, status
          FROM user_objects
         WHERE status = 'INVALID'
           AND (object_name LIKE 'PKGSMY_%_DAO' OR object_name LIKE 'PKGCA_%' OR object_name LIKE 'PKGCN_%')
         ORDER BY object_type, object_name
    ) LOOP
        vn_invalidos := vn_invalidos + 1;
        DBMS_OUTPUT.PUT_LINE('  ALERTA: Objeto ' || reg.object_type || ' ' || reg.object_name || ' tiene estado ' || reg.status);
    END LOOP;

    IF vn_invalidos = 0 THEN
        DBMS_OUTPUT.PUT_LINE('  OK: Todos los paquetes PL/SQL compilados se encuentran en estado VALID.');
    ELSE
        DBMS_OUTPUT.PUT_LINE('  ATENCIÓN: Se detectaron ' || vn_invalidos || ' objetos en estado INVALID.');
    END IF;
END;
/

-- =============================================================================
-- 5. RESUMEN FINAL Y TIEMPO TOTAL DE COMPILACIÓN
-- =============================================================================
BEGIN
    :v_t_total_fin := DBMS_UTILITY.GET_TIME;
    DBMS_OUTPUT.PUT_LINE(' ');
    DBMS_OUTPUT.PUT_LINE('============================================================================');
    DBMS_OUTPUT.PUT_LINE('  RESUMEN TOTAL DE COMPILACIÓN - HORA BOGOTÁ (UTC-5)');
    DBMS_OUTPUT.PUT_LINE('============================================================================');
    DBMS_OUTPUT.PUT_LINE('  Inicio: ' || '&v_fecha_bogota');
    DBMS_OUTPUT.PUT_LINE('  Fin:    ' || TO_CHAR(CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE), 'YYYY-MM-DD HH24:MI:SS'));
    DBMS_OUTPUT.PUT_LINE('  Total paquetes procesados: ' || '84');
    DBMS_OUTPUT.PUT_LINE('  TIEMPO TOTAL DEL SCRIPT:   ' || LTRIM(TO_CHAR((:v_t_total_fin - :v_t_total_ini) / 100, '9990.99')) || ' segundos.');
    DBMS_OUTPUT.PUT_LINE('============================================================================');
END;
/
