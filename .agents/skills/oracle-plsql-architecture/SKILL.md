---
name: oracle-plsql-architecture
description: >-
  Estándar arquitectónico obligatorio de PL/SQL para Oracle. Debe activarse SIEMPRE que se solicite crear, modificar, revisar, optimizar, refactorizar o proponer código PL/SQL, paquetes Oracle, procedimientos, funciones, consultas, APIs PL/SQL, generación de JSON o manejo transaccional. Aplica la estricta separación de responsabilidades entre paquetes DAO (pkg<tabla>_dao por PK/ROWID sin commit), pkgca_ (acceso/filtros y DML sin PK), pkgcn_ (sentencias DML de proceso que involucran más de una tabla sin lógica de negocio) y pkgln_ (lógica de negocio, validaciones y reglas del caso de uso, sin DML directo, orquestando DAOs/pkgca/pkgcn con COMMIT/ROLLBACK transaccional y logging en SMY_ERRORES con uti_ge_excepciones_pkg.p_grabar_log), SYS_REFCURSOR y JSON nativo.
---

# Estándar Arquitectónico PL/SQL para Oracle

## 1. Misión y Carácter Obligatorio

Este skill define el **estándar arquitectónico oficial e innegociable** para cualquier desarrollo, modificación, refactorización, optimización o revisión de código PL/SQL en Oracle.

> [!IMPORTANT]
> Este documento **no es solo una guía de estilo**, sino una **regla arquitectónica vinculante**.
> Antes de generar cualquier línea de código PL/SQL, se DEBE clasificar la responsabilidad de la operación y ubicarla en la familia de paquete correspondiente. Queda estrictamente prohibido mezclar responsabilidades entre paquetes.

---

## 2. Clasificación Obligatoria de Familias de Paquetes

Todo artefacto PL/SQL pertenece obligatoriamente a una de estas cuatro familias:

| Familia | Prefijo / Sufijo | Propósito Principal | DML Directo Tabla | Transacciones (COMMIT/ROLLBACK) | Manejo de Excepciones |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DAO** | `pkg<tabla>_dao` | Acceso a datos de UNA tabla específica por PK / ROWID (CRUD básico y plantilla oficial de 18 métodos). | Sí (su tabla exclusiva) | **PROHIBIDO** (Cero COMMIT/ROLLBACK; propaga errores al nivel superior) | Propagación hacia capas superiores |
| **pkgca_** | `pkgca_<entidad>` | Consultas y DML multi-registro o sin PK sobre una entidad (filtros dinámicos, rangos, estados, búsquedas `SYS_REFCURSOR`, batch). | Sí (tablas de la entidad) | **PROHIBIDO** salvo proceso batch explícito aislado | Propagación hacia capas superiores |
| **pkgcn_** | `pkgcn_<proceso>` | Sentencias DML que pertenecen a un proceso e involucran **MÁS DE UNA TABLA**. | Sí (las tablas involucradas en el proceso) | **PROHIBIDO** (El commit lo controla el orquestador de negocio `pkgln_`) | Propagación hacia capa `pkgln_` |
| **pkgln_** | `pkgln_<dominio>` | **LÓGICA DE NEGOCIO**, validaciones, reglas de dominio, flujos y orquestación del caso de uso. | **PROHIBIDO** (Cero DML directo; usa `_dao`, `pkgca_` y `pkgcn_`) | **OBLIGATORIO** (Control atómico: `COMMIT;` al éxito, `ROLLBACK;` al fallo) | Bloque `WHEN OTHERS` con registro en `SMY_ERRORES` y `-20000` |

---

## 3. Árbol de Decisión Arquitectónico Obligatorio

Antes de escribir cualquier procedimiento o función, aplicar estrictamente este árbol de decisión:

```text
¿Es lógica de negocio, validaciones, reglas de dominio o la orquestación de un caso de uso?
│
├── SÍ ─────────────────────────────────────────────────────────────► Pertenece a: pkgln_
│                                                                     (Lógica de negocio, reglas y validaciones.
│                                                                      SIN DML directo. Consulta y modifica a través
│                                                                      de _DAO, pkgca_ y pkgcn_. Aquí va el COMMIT).
└── NO (Es una operación de acceso o modificación de datos técnica)
    │
    ├── ¿Es una sentencia SQL DML técnica que involucra en su
    │   propia sintaxis MÁS DE UNA TABLA (JOIN / subconsulta EXISTS / MERGE)?
    │   │
    │   └── SÍ ──────────────────────────────────────────────────────► Pertenece a: pkgcn_
    │                                                                 (Un método por cada sentencia DML.
    │                                                                  Mínimo 2 tablas en la sentencia.
    │                                                                  Sin lógica de negocio ni COMMIT).
    │
    ├── ¿Es una operación CRUD directa sobre una única tabla
    │   identificando registros por PK o ROWID?
    │   │
    │   └── SÍ ──────────────────────────────────────────────────────► Pertenece a: pkg<tabla>_dao
    │                                                                 (Plantilla estándar oficial 18 métodos).
    │
    └── ¿Es una consulta, filtro, búsqueda multi-criterio o DML masivo
        sobre una entidad sin depender exclusivamente de su PK?
        │
        └── SÍ ──────────────────────────────────────────────────────► Pertenece a: pkgca_
                                                                      (Búsquedas SYS_REFCURSOR,
                                                                       updates por estado/fecha sin PK).
```

---

## 4. Paquetes DAO (`pkg<tabla>_dao`)

### 4.1 Convención de Nomenclatura
El nombre del paquete DAO debe formarse **exactamente** con la fórmula:
$$\text{pkg} + \text{nombre\_tabla} + \text{\_dao}$$

*Ejemplos:*
- Tabla: `SMY_USUARIOS` $\rightarrow$ Paquete: `PKGSMY_USUARIOS_DAO`
- Tabla: `SMY_ARCHIVOS` $\rightarrow$ Paquete: `PKGSMY_ARCHIVOS_DAO`
- Tabla: `SMY_RESIDENTES` $\rightarrow$ Paquete: `PKGSMY_RESIDENTES_DAO`

### 4.2 Métodos de la Plantilla Oficial DAO
Todo DAO debe implementar los siguientes 18 métodos estándar adaptados a la tabla correspondiente:

```sql
CREATE OR REPLACE PACKAGE PKGSMY_TABLA_DAO
AS
    -- Tipo colección para consultas generales
    TYPE ta_smy_tabla IS TABLE OF smy_tabla%ROWTYPE INDEX BY BINARY_INTEGER;

    -- 1. Insertar registro completo
    PROCEDURE p_insertar (
        pro_smy_tabla IN smy_tabla%ROWTYPE
    );

    -- 2. Traer registro por PK
    FUNCTION f_traer (
        pty_id IN smy_tabla.id%TYPE
    ) RETURN smy_tabla%ROWTYPE;

    -- 3. Consultar todos los registros
    PROCEDURE p_consultar_registros (
        pta_smy_tabla OUT pkgsmy_tabla_dao.ta_smy_tabla
    );

    -- 4. Eliminar registro por ROWID
    PROCEDURE p_eliminar_rowid (
        p_rowid IN VARCHAR2
    );

    -- 5. Eliminar registro por PK
    PROCEDURE p_eliminar (
        pty_id IN smy_tabla.id%TYPE
    );

    -- 6. Eliminar todos los registros (Uso restringido)
    PROCEDURE p_eliminar_registros;

    -- 7. Verificar existencia por PK
    FUNCTION f_existe (
        pty_id IN smy_tabla.id%TYPE
    ) RETURN BOOLEAN;

    -- 8. Verificar existencia y retornar registro
    FUNCTION f_existe (
        pty_id IN smy_tabla.id%TYPE,
        pro_smy_tabla OUT smy_tabla%ROWTYPE
    ) RETURN BOOLEAN;

    -- 9. Verificar existencia, retornar registro y ROWID
    FUNCTION f_existe (
        pty_id IN smy_tabla.id%TYPE,
        pro_smy_tabla OUT smy_tabla%ROWTYPE,
        p_rowid OUT VARCHAR2
    ) RETURN BOOLEAN;

    -- 10. Verificar existencia por ROWID
    FUNCTION f_existe_rowid (
        p_rowid IN VARCHAR2
    ) RETURN BOOLEAN;

    -- 11. Verificar existencia por ROWID y retornar registro
    FUNCTION f_existe_rowid (
        p_rowid IN VARCHAR2,
        pro_smy_tabla OUT smy_tabla%ROWTYPE
    ) RETURN BOOLEAN;

    -- 12. Actualizar registro completo por PK en ROWTYPE
    PROCEDURE p_actualizar (
        pro_smy_tabla IN smy_tabla%ROWTYPE
    );

    -- 13. Actualizar indicando PK explícita
    PROCEDURE p_actualizar (
        pro_smy_tabla IN smy_tabla%ROWTYPE,
        pty_id IN smy_tabla.id%TYPE
    );

    -- 14. Actualizar por ROWID
    PROCEDURE p_actualizar_rowid (
        pro_smy_tabla IN smy_tabla%ROWTYPE,
        p_rowid IN VARCHAR2
    );

    -- 15. Actualizar todos los registros (Uso restringido)
    PROCEDURE p_actualizar_registros (
        pro_smy_tabla IN smy_tabla%ROWTYPE
    );

    -- 16. Obtener valores por defecto
    PROCEDURE p_valores_defecto (
        pro_smy_tabla IN OUT smy_tabla%ROWTYPE
    );

    -- 17. Verificar existencia y retornar JSON CLOB
    FUNCTION f_existe_json (
        p_id IN smy_tabla.id%TYPE,
        p_json_smy_tabla OUT CLOB
    ) RETURN NUMBER;

    -- 18. Obtener JSON por PK (Retorna CLOB nativo)
    FUNCTION f_json (
        p_id IN smy_tabla.id%TYPE
    ) RETURN CLOB;

END PKGSMY_TABLA_DAO;
/
```

### 4.3 Reglas Específicas para DAO
1. **Un DAO por tabla física**: No crear DAOs compartidos para múltiples tablas.
2. **Tipado fuerte**: Usar siempre `%ROWTYPE` para registros y `<tabla>.<columna>%TYPE` para parámetros escalares.
3. **Cero Lógica de Negocio**: No incluir validaciones de reglas de dominio ni cálculos empresariales en el DAO.
4. **Cero Orquestación Multi-tabla**: El DAO jamás consulta ni actualiza tablas ajenas a la suya.
5. **Cero COMMIT / ROLLBACK**: El DAO nunca controla la transacción. Los errores deben propagarse limpiamente al nivel superior (`pkgln_`).

---

## 5. Paquetes de Consulta y Acceso No-PK (`pkgca_`)

- **Propósito**: Encapsular consultas complejas, filtros dinámicos, búsquedas, rangos de fechas, operaciones por estado y DML masivo sobre una entidad que no dependen exclusivamente de una clave primaria.
- **Nomenclatura**: `pkgca_<entidad>` (ej. `pkgca_residentes`, `pkgca_turnos`, `pkgca_medicamentos`).
- **Retorno de Conjuntos Multi-fila**: Debe usar `SYS_REFCURSOR`.
- **Límites**: No debe contener lógica de negocio transaccional ni reemplazar al orquestador `pkgln_`.

*Ejemplo:*
```sql
FUNCTION fn_buscar_residentes (
    p_filtro_texto IN VARCHAR2,
    p_id_estado    IN NUMBER
) RETURN SYS_REFCURSOR;

PROCEDURE pr_inactivar_residentes_por_fecha (
    p_fecha_limite IN DATE,
    p_id_usuario   IN NUMBER
);
```

---

## 6. Paquetes de Sentencias DML Multi-Tabla (`pkgcn_`)

- **Propósito Exclusivo**: Contener sentencias DML de proceso que involucran **MÁS DE UNA TABLA en la misma sentencia SQL** (ej. `INSERT ... SELECT ... JOIN`, `UPDATE ... WHERE EXISTS (...)`, `MERGE ... USING (...)`, `DELETE ... WHERE EXISTS (...)`).
- **Nomenclatura**: `pkgcn_<proceso>` (ej. `pkgcn_residentes`, `pkgcn_facturacion`).
- **Reglas Mandatorias y Estrictas para `pkgcn_`**:
  1. **UN SOLO MÉTODO POR CADA SENTENCIA DML**: Cada procedimiento o función en `pkgcn_` debe encapsular exactamente UNA única sentencia SQL DML.
  2. **MÍNIMO DOS TABLAS POR SENTENCIA**: La sentencia DML debe involucrar directamente como mínimo dos tablas físicas en su sintaxis SQL (mediante JOIN, subconsultas correlacionadas con `EXISTS`/`IN`, MERGE o cláusulas de selección multi-tabla).
  3. **PROHIBIDO INCLUIR SECUENCIAS DE SENTENCIAS MONO-TABLA**: Si un proceso requiere actualizar la tabla A y luego insertar/actualizar la tabla B con sentencias independientes, **NO pertenece a `pkgcn_`**. Cada operación debe ejecutarse a través del respectivo `_dao` (o `pkgca_`) de cada tabla, y la secuencia completa debe orquestarse directamente en el paquete de lógica de negocio `pkgln_`.
  4. **Cero Lógica de Negocio ni Validaciones Complejas**: `pkgcn_` ejecuta la sentencia DML multi-tabla técnica requerida por el proceso; no toma decisiones de negocio ni valida reglas de dominio.
  5. **Cero COMMIT / ROLLBACK**: El control transaccional (`COMMIT;` / `ROLLBACK;`) es potestad exclusiva de `pkgln_`.

*Ejemplo Oficial de `pkgcn_`:*
```sql
CREATE OR REPLACE PACKAGE BODY PKGCN_RESIDENTES
AS
    -- Exactamente un método para una única sentencia DML que involucra >= 2 tablas
    PROCEDURE pr_inactivar_residentes_egresados (
        p_id_estado_inactivo IN smy_residentes.id_estado_residente%TYPE
    ) IS
    BEGIN
        -- Sentencia DML única que involucra SMY_RESIDENTES y SMY_EGRESOS
        UPDATE smy_residentes r
           SET r.id_estado_residente          = p_id_estado_inactivo,
               r.fecha_ultima_modificacion    = CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE)
         WHERE EXISTS (
             SELECT 1
               FROM smy_egresos e
              WHERE e.id_residente = r.id
                AND e.fecha_egreso <= CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE)
         );
        -- Cero COMMIT; el control transaccional lo maneja pkgln_
    END pr_inactivar_residentes_egresados;

END PKGCN_RESIDENTES;
/
```

---

## 7. Paquetes de Lógica de Negocio (`pkgln_`)

- **Propósito**: **LLEVAR LA LÓGICA DE NEGOCIO**, reglas de dominio, validaciones, flujos de procesos y orquestación del caso de uso.
- **Nomenclatura**: `pkgln_<dominio>` (ej. `pkgln_archivos`, `pkgln_auth`, `pkgln_consentimientos`, `pkgln_residentes`).
- **Reglas Mandatorias para `pkgln_`**:
  1. **Sin Sentencias DML Directas ni SELECT Directos sobre Tablas**: `pkgln_` no escribe sentencias directas `INSERT INTO`, `UPDATE`, `DELETE` ni `SELECT ... FROM tabla` en su código.
  2. **Búsquedas por PK / ID**: Se realizan exclusivamente mediante el paquete DAO de la tabla (`pkgsmy_<tabla>_dao.f_traer(p_id)` o `pkgsmy_<tabla>_dao.f_existe(p_id, vro_registro)`).
  3. **Búsquedas por otros criterios**: Se realizan exclusivamente mediante paquetes de consulta `pkgca_<tabla>` (ej. `pkgca_smy_usuarios.fn_buscar_por_username_email`, `pkgca_residentes.fn_consultar_censo`).
  4. **Asignación de Secuencias Directa**: En PL/SQL los IDs autogenerados se asignan directamente:
     ```sql
     vro_auditoria.id := SEQ_SMY_AUDITORIA_ACCESOS.NEXTVAL;
     ```
     **PROHIBIDO** hacer `SELECT secuencia.NEXTVAL INTO ... FROM DUAL;`.
  5. **Consulta y Modificación Delegada**: Toda modificación de datos se realiza a través de:
     - Los **`_DAO`** para persistencia mono-tabla por PK (`p_insertar`, `p_actualizar`, `p_eliminar`).
     - Los **`pkgca_`** para DML masivo sin PK sobre una entidad.
     - Los **`pkgcn_`** para sentencias DML técnicas que involucran como mínimo dos tablas.
  6. **Control Transaccional (COMMIT CONTROLADO - PROHIBIDO COMMIT DIRECTO)**:
     - `pkgln_` orquesta el caso de uso y ejecuta el cierre transaccional al completar satisfactoriamente el proceso.
     - **PROHIBIDO ejecutar `COMMIT;` directo**: Se debe invocar obligatoriamente el procedimiento corporativo centralizado `p_do_commit('<objeto>.<metodo>');` enviando como parámetro el contexto (nombre de paquete + nombre de método, ej. `p_do_commit('pkgln_auth.pr_registrar_dispositivo_push');`).
     - En caso de excepción, ejecuta inmediatamente **`ROLLBACK;`**, registra el error en `SMY_ERRORES` mediante `uti_ge_excepciones_pkg.p_grabar_log(vro_error);` y lanza el error con `RAISE_APPLICATION_ERROR(-20000, ...)`.

*Ejemplo Oficial de Lógica de Negocio en `pkgln_`:*
```sql
CREATE OR REPLACE PACKAGE BODY PKGLN_USUARIOS
AS
    vro_error smy_errores%ROWTYPE;

    PROCEDURE pr_actualizar_nombre_usuario (
        p_id_usuario IN smy_usuarios.id%TYPE,
        p_nombres    IN VARCHAR2
    ) IS
        vro_usuario smy_usuarios%ROWTYPE;
    BEGIN
        -- 1. Validaciones de negocio
        IF p_nombres IS NULL OR TRIM(p_nombres) IS NULL THEN
            RAISE_APPLICATION_ERROR(-20001, 'El nombre del usuario no puede estar vacío.');
        END IF;

        -- 2. Consultar y verificar mediante DAO
        IF PKGSMY_USUARIOS_DAO.f_existe(p_id_usuario, vro_usuario) = TRUE THEN
            vro_usuario.nombre_completo := TRIM(p_nombres);
            vro_usuario.fecha_ultima_modificacion := CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE);
            
            -- 3. Modificación delegada al DAO
            PKGSMY_USUARIOS_DAO.p_actualizar(vro_usuario);
        ELSE
            RAISE_APPLICATION_ERROR(-20002, 'El usuario indicado no existe en el sistema.');
        END IF;

        -- 4. Control transaccional mediante p_do_commit
        p_do_commit('pkgln_usuarios.pr_actualizar_nombre_usuario');

    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            IF SQLCODE BETWEEN -20999 AND -20001 THEN
                RAISE;
            END IF;
            vro_error.nombre_programa := 'PKGLN_USUARIOS';
            vro_error.nombre_metodo   := 'PR_ACTUALIZAR_NOMBRE_USUARIO';
            vro_error.parametros      := 'p_id_usuario: ' || p_id_usuario || ', p_nombres: ' || p_nombres;
            uti_ge_excepciones_pkg.p_grabar_log(vro_error);
            RAISE_APPLICATION_ERROR(-20000, 'Se presento un error comunicarse con soporte. Número error: ' || vro_error.id || ' - ' || SQLERRM);
    END pr_actualizar_nombre_usuario;

    -- Ejemplo oficial de proceso multi-entidad usando DAOs y p_do_commit en pkgln_
    PROCEDURE pr_registrar_acceso_exitoso (
        p_id_usuario        IN smy_usuarios.id%TYPE,
        p_direccion_ip      IN VARCHAR2,
        p_dispositivo_info  IN VARCHAR2
    ) IS
        vro_usuario           smy_usuarios%ROWTYPE;
        vro_auditoria_accesos smy_auditoria_accesos%ROWTYPE;
    BEGIN
        -- 1. Actualización de primera tabla vía DAO
        IF PKGSMY_USUARIOS_DAO.f_existe(p_id_usuario, vro_usuario) = TRUE THEN
            vro_usuario.ultimo_acceso := CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE);
            PKGSMY_USUARIOS_DAO.p_actualizar(vro_usuario);
        END IF;

        -- 2. Inserción en segunda tabla vía DAO (Asignación directa de secuencia)
        vro_auditoria_accesos.id              := SEQ_SMY_AUDITORIA_ACCESOS.NEXTVAL;
        vro_auditoria_accesos.id_usuario      := p_id_usuario;
        vro_auditoria_accesos.accion          := 'LOGIN_EXITOSO';
        vro_auditoria_accesos.direccion_ip    := SUBSTR(p_direccion_ip, 1, 45);
        vro_auditoria_accesos.detalles        := 'Dispositivo: ' || SUBSTR(p_dispositivo_info, 1, 200) || ' | Autenticación exitosa';
        vro_auditoria_accesos.fecha_creacion  := CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE);
        PKGSMY_AUDITORIA_ACCESOS_DAO.p_insertar(vro_auditoria_accesos);

        -- 3. En pkgln_ va el COMMIT controlado
        p_do_commit('pkgln_usuarios.pr_registrar_acceso_exitoso');
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            vro_error.nombre_programa     := 'PKGLN_USUARIOS';
            vro_error.nombre_metodo       := 'PR_REGISTRAR_ACCESO_EXITOSO';
            vro_error.parametros          := 'p_id_usuario: ' || p_id_usuario;
            uti_ge_excepciones_pkg.p_grabar_log(vro_error);
            RAISE_APPLICATION_ERROR(-20000, 'Se presento un error comunicarse con soporte. Número error: ' || vro_error.id || ' - ' || SQLERRM);
    END pr_registrar_acceso_exitoso;

END PKGLN_USUARIOS;
/
```

---

## 8. Procedimiento Centralizado de Transacciones (`p_do_commit`)

- **Definición Oficial del Procedimiento**:
```sql
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
```
- **Reglas Mandatorias**:
  1. Donde antes existía un `COMMIT;` directo en cualquier paquete o procedimiento, debe reemplazarse obligatoriamente por `p_do_commit(...)`.
  2. Parámetro `p_contexto`: Se debe enviar el nombre del objeto. Si es un paquete, la convención obligatoria es:
     `<nombre_paquete>.<nombre_metodo>`
     *Ejemplos:*
     - `p_do_commit('pkgln_auth.pr_registrar_dispositivo_push');`
     - `p_do_commit('pkgln_auth.pr_registrar_acceso_exitoso');`
     - `p_do_commit('pkgln_archivos.pr_registrar_archivo');`
     - `p_do_commit('pkgln_consentimientos.pr_firmar_consentimiento');`
     - `p_do_commit('uti_ge_excepciones_pkg.p_grabar_log');`

---

## 9. Estándar Obligatorio de Manejo de Excepciones y Logging

### 9.1 Errores de Negocio Conocidos
- Deben dispararse explícitamente con códigos entre `-20001` y `-20999` y mensajes claros.
- Se propagan sin necesidad de log de soporte (son validaciones funcionales normales).

### 9.2 Errores Inesperados (`WHEN OTHERS`)
En paquetes `pkgln_`, toda excepción no anticipada debe capturarse obligatoriamente bajo este esquema:

```sql
EXCEPTION
    WHEN OTHERS THEN
        -- 1. Rollback inmediato de la transacción
        ROLLBACK;

        -- 2. Re-lanzar errores de negocio conocidos si fueron disparados
        IF SQLCODE BETWEEN -20999 AND -20001 THEN
            RAISE;
        END IF;

        -- 3. Asignación exacta de metadatos de depuración
        vro_error.nombre_programa := 'PKGLN_DOMINIO';
        vro_error.nombre_metodo   := 'PR_METODO';
        vro_error.parametros      := 'p_param1: ' || p_param1;

        -- 4. Persistencia autónoma del error (no afectada por el ROLLBACK)
        uti_ge_excepciones_pkg.p_grabar_log(vro_error);

        -- 5. Propagación al consumidor con el ID generado para soporte
        RAISE_APPLICATION_ERROR(
            -20000,
            'Se presento un error comunicarse con soporte. Número error: '
            || vro_error.id
            || ' - '
            || SQLERRM
        );
```

### 9.3 Prohibiciones Estrictas de Manejo de Errores
> [!CAUTION]
> 1. **Prohibido:** `WHEN OTHERS THEN NULL;` (Nunca silenciar ni ocultar excepciones).
> 2. **Prohibido:** `WHEN OTHERS THEN RAISE_APPLICATION_ERROR(...)` sin haber ejecutado `uti_ge_excepciones_pkg.p_grabar_log(vro_error);`.
> 3. **Prohibido:** Inserciones manuales directas como `INSERT INTO SMY_ERRORES...`.
> 4. **Prohibido:** Nombres genéricos en `vro_error.nombre_programa` (e.g. `'PACKAGE'`, `'PROCESO'`).

---

## 10. Retorno Multi-Fila y Generación de JSON en Oracle

### 10.1 Consultas Multi-Fila: `SYS_REFCURSOR`
Cualquier procedimiento o función de consulta multi-registro debe retornar un `SYS_REFCURSOR`.

### 10.2 Generación Nativa de JSON (APIs / Frontends / Node)
Cuando el consumidor requiera JSON, se debe generar **directamente en el motor Oracle** con funciones SQL/JSON nativas (`JSON_OBJECT`, `JSON_ARRAYAGG`) y cláusula `RETURNING CLOB`.
> [!WARNING]
> Queda **terminantemente prohibida** la concatenación manual de cadenas para formar JSON.

---

## 11. Nomenclatura de Subprogramas

| Ámbito | Funciones | Procedimientos |
| :--- | :--- | :--- |
| **Plantilla DAO oficial** | Prefijo `f_` (`f_traer`, `f_existe`, `f_json`) | Prefijo `p_` (`p_insertar`, `p_actualizar`, `p_eliminar`) |
| **Nuevos pkgca_, pkgcn_, pkgln_** | Prefijo `fn_` (`fn_buscar_residentes`, `fn_calcular`) | Prefijo `pr_` (`pr_confirmar_orden`, `pr_firmar_consentimiento`) |
| **Utilidades de Control** | | `p_do_commit` |

---

## 12. Lista de Chequeo Arquitectónica Obligatoria (Pre-entrega)

Antes de entregar cualquier código, el agente debe auto-verificar:
- [ ] **Clasificación**: ¿El código está en el paquete correcto (`_DAO`, `pkgca_`, `pkgcn_`, `pkgln_`) según su responsabilidad?
- [ ] **Nombre DAO**: ¿Cumple con la sintaxis exacta `PKGSMY_<TABLA>_DAO`?
- [ ] **Plantilla DAO**: ¿Mantiene los nombres y firmas de los 18 métodos oficiales sin inventar variaciones?
- [ ] **Tipado**: ¿Se utilizan `%ROWTYPE` y `%TYPE` en lugar de tipos genéricos?
- [ ] **pkgcn_**: ¿Contiene únicamente sentencias DML de proceso que involucran más de una tabla (sin lógica de negocio ni commit)?
- [ ] **pkgln_**: ¿Lleva la lógica de negocio y está **completamente libre de sentencias DML directas** (usando `_DAO`, `pkgca_` y `pkgcn_`)?
- [ ] **Transaccionalidad en pkgln_**: ¿Se utilizó `p_do_commit('<objeto>.<metodo>')` en lugar de un `COMMIT;` directo?
- [ ] **Sin COMMITs espurios**: ¿Los DAOs, `pkgca_` y `pkgcn_` se abstienen de hacer `COMMIT;` / `p_do_commit`?
- [ ] **Trazabilidad de Errores**: ¿Se asignaron `nombre_programa`, `nombre_metodo` y `parametros` en `vro_error`?
- [ ] **Log Autónomo**: ¿Se usó `uti_ge_excepciones_pkg.p_grabar_log(vro_error)`?
- [ ] **Error al Cliente**: ¿Se utilizó `RAISE_APPLICATION_ERROR(-20000, '... Número error: ' || vro_error.id || ' - ' || SQLERRM);`?
- [ ] **Multi-fila**: ¿Se utilizó `SYS_REFCURSOR`?
- [ ] **JSON**: ¿Se utilizó `JSON_OBJECT` / `JSON_ARRAYAGG` con `RETURNING CLOB` sin concatenaciones manuales?

---

## 13. Formato Estándar de Respuesta al Usuario

Al responder solicitudes de desarrollo PL/SQL, estructurar la salida en este orden:
1. **Clasificación arquitectónica:** (e.g. `pkgln_archivos`, `pkgcn_consentimientos`)
2. **Justificación breve:** Explicación técnica de por qué pertenece a esa categoría según el estándar.
3. **Package Specification:** Código `.pks`
4. **Package Body:** Código `.pkb`
5. **Consideraciones técnicas y transaccionales**
6. **Validación contra el estándar arquitectónico**
