---
name: oracle-plsql-architecture
description: >-
  Estándar arquitectónico obligatorio de PL/SQL para Oracle. Debe activarse SIEMPRE que se solicite crear, modificar, revisar, optimizar, refactorizar o proponer código PL/SQL, paquetes Oracle, procedimientos, funciones, consultas, APIs PL/SQL, generación de JSON o manejo transaccional. Aplica la estricta separación de responsabilidades entre paquetes DAO (pkg<tabla>_dao por PK/ROWID sin commit), pkgca_ (acceso/filtros y DML sin PK), pkgcn_ (sentencias DML de proceso multi-tabla sin lógica de negocio) y pkgln_ (lógica de negocio, validaciones y reglas del caso de uso, sin DML directo, orquestando DAOs/pkgca/pkgcn con COMMIT/ROLLBACK transaccional y logging en SMY_ERRORES con uti_ge_excepciones_pkg.p_grabar_log). PROHÍBE terminantemente la sintaxis ANSI JOIN (usar exclusivamente FROM tabla1 t1, tabla2 t2 WHERE con operador (+) para outer joins). EXIGE que los parámetros de entrada en pkgca_, pkgcn_ y pkgln_ se reciban en un parámetro CLOB que contiene un JSON y se extraigan usando JSON_VALUE.
---

# Estándar Arquitectónico PL/SQL para Oracle

## 1. Misión y Carácter Obligatorio

Este skill define el **estándar arquitectónico oficial e innegociable** para cualquier desarrollo, modificación, refactorización, optimización o revisión de código PL/SQL en Oracle.

> [!IMPORTANT]
> Este documento **no es solo una guía de estilo**, sino una **regla arquitectónica vinculante**.
> Antes de generar cualquier línea de código PL/SQL, se DEBE clasificar la responsabilidad de la operación y ubicarla en la familia de paquete correspondiente. Queda estrictamente prohibido mezclar responsabilidades entre paquetes.

---

## 2. Reglas Mandatorias Fundamentales de Sintaxis y Parámetros

### 2.1 Prohibición Absoluta de la Nomenclatura `JOIN` (Sintaxis Relacional Tradicional Oracle)
> [!CAUTION]
> **QUEDA TERMINANTEMENTE PROHIBIDO EL USO DE LA NOMENCLATURA ANSI `JOIN`** (`JOIN`, `INNER JOIN`, `LEFT JOIN`, `LEFT OUTER JOIN`, `RIGHT JOIN`, `FULL JOIN`, `CROSS JOIN`).

- **Regla de Unión de Tablas**: Todas las consultas y sentencias que involucren más de una tabla deben formularse **exclusivamente mediante la sintaxis relacional tradicional de Oracle**:
  1. Las tablas se listan en la cláusula `FROM` separadas por comas (con sus respectivos alias).
  2. Las condiciones de relación / combinación se colocan obligatoriamente en la cláusula `WHERE`.
  3. **Outer Joins (Uniones Externas)**: Se deben realizar **únicamente con la sintaxis tradicional de Oracle utilizando el operador `(+)`** al lado de la columna de la tabla opcional/subordinada.

*Ejemplo Comparativo Mandatorio:*
```sql
-- ❌ PROHIBIDO (Sintaxis ANSI JOIN):
SELECT r.nombres, c.nombre_centro, m.nombre_nivel_movilidad
  FROM smy_residentes r
 INNER JOIN smy_centros c ON r.id_centro = c.id
  LEFT JOIN smy_niveles_movilidad m ON r.id_nivel_movilidad = m.id;

-- ✅ OBLIGATORIO (Sintaxis Tradicional Oracle con (+)):
SELECT r.nombres, c.nombre_centro, m.nombre_nivel_movilidad
  FROM smy_residentes r,
       smy_centros c,
       smy_niveles_movilidad m
 WHERE r.id_centro = c.id
   AND r.id_nivel_movilidad = m.id(+);
```

---

### 2.2 Parámetros de Entrada en `CLOB` JSON y Extracción con `JSON_VALUE`
> [!IMPORTANT]
> En todos los procedimientos y funciones de las familias **`pkgca_`**, **`pkgcn_`** y **`pkgln_`**, los parámetros de entrada **DEBEN RECIBIRSE OBLIGATORIAMENTE EN UN ÚNICO PARÁMETRO DE TIPO `CLOB` QUE CONTIENE UN DOCUMENTO JSON**.

- **Firma estándar de entrada**: `pcl_json IN CLOB` (o `p_json IN CLOB`).
- **Parámetros de salida**: Se mantienen los parámetros de salida según el propósito técnico del método (ej. `p_cursor OUT SYS_REFCURSOR` para consultas multi-fila, o retorno de función `RETURN CLOB` / `RETURN SYS_REFCURSOR`).
- **Extracción Obligatoria con `JSON_VALUE`**: Para leer o utilizar cualquier valor contenido en el JSON de entrada, se debe emplear **exclusivamente la función SQL/JSON nativa de Oracle `JSON_VALUE`**:
  ```sql
  v_id_centro   := TO_NUMBER(JSON_VALUE(pcl_json, '$.idCentro'));
  v_id_estado   := TO_NUMBER(JSON_VALUE(pcl_json, '$.idEstado'));
  v_filtro      := JSON_VALUE(pcl_json, '$.filtroTexto');
  v_fecha_corte := TO_DATE(JSON_VALUE(pcl_json, '$.fechaCorte'), 'YYYY-MM-DD');
  ```
  También es válido usar `JSON_VALUE(pcl_json, '$.campo')` directamente dentro de la cláusula `WHERE` de una consulta SQL:
  ```sql
  WHERE (JSON_VALUE(pcl_json, '$.idCentro') IS NULL OR r.id_centro = TO_NUMBER(JSON_VALUE(pcl_json, '$.idCentro')))
  ```
- **Excepción para `pkg<tabla>_dao`**: La familia DAO mantiene su plantilla oficial de 18 métodos tipada fuertemente con `%ROWTYPE` y `%TYPE` por ser la capa base atómica de persistencia mono-tabla por PK/ROWID.

---

## 3. Clasificación Obligatoria de Familias de Paquetes

Todo artefacto PL/SQL pertenece obligatoriamente a una de estas cuatro familias:

| Familia | Prefijo / Sufijo | Propósito Principal | Parámetros de Entrada | DML Directo Tabla | Transacciones (COMMIT/ROLLBACK) | Manejo de Excepciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **DAO** | `pkg<tabla>_dao` | Acceso a datos de UNA tabla específica por PK / ROWID (plantilla oficial de 18 métodos). | `%ROWTYPE`, `%TYPE` por PK/ROWID | Sí (su tabla exclusiva) | **PROHIBIDO** (Cero COMMIT/ROLLBACK; propaga errores al nivel superior) | Propagación hacia capas superiores |
| **pkgca_** | `pkgca_<entidad>` | Consultas, filtros multi-criterio (`SYS_REFCURSOR`), estados, fechas y DML masivo sin PK sobre una entidad. | **`pcl_json IN CLOB`** (Extracción vía `JSON_VALUE`) | Sí (tablas de la entidad) | **PROHIBIDO** salvo proceso batch explícito aislado | Propagación hacia capas superiores |
| **pkgcn_** | `pkgcn_<proceso>` | Sentencias DML de proceso que involucran **MÁS DE UNA TABLA en la misma sentencia SQL**. | **`pcl_json IN CLOB`** (Extracción vía `JSON_VALUE`) | Sí (las tablas involucradas en el proceso) | **PROHIBIDO** (El commit lo controla el orquestador `pkgln_`) | Propagación hacia capa `pkgln_` |
| **pkgln_** | `pkgln_<dominio>` | **LÓGICA DE NEGOCIO**, validaciones, reglas de dominio, flujos y orquestación del caso de uso. | **`pcl_json IN CLOB`** (Extracción vía `JSON_VALUE`) | **PROHIBIDO** (Cero DML directo; usa `_dao`, `pkgca_` y `pkgcn_`) | **OBLIGATORIO** (Control atómico: `p_do_commit;` al éxito, `ROLLBACK;` al fallo) | Bloque `WHEN OTHERS` con registro en `SMY_ERRORES` y `-20000` |

---

## 4. Árbol de Decisión Arquitectónico Obligatorio

Antes de escribir cualquier procedimiento o función, aplicar estrictamente este árbol de decisión:

```text
¿Es lógica de negocio, validaciones, reglas de dominio o la orquestación de un caso de uso?
│
├── SÍ ─────────────────────────────────────────────────────────────► Pertenece a: pkgln_
│                                                                     (Recibe pcl_json IN CLOB, usa JSON_VALUE.
│                                                                      Lógica de negocio, reglas y validaciones.
│                                                                      SIN DML directo. Consulta y modifica a través
│                                                                      de _DAO, pkgca_ y pkgcn_. Aquí va p_do_commit).
└── NO (Es una operación de acceso o modificación de datos técnica)
    │
    ├── ¿Es una sentencia SQL DML técnica que involucra en su
    │   propia sintaxis MÁS DE UNA TABLA (WHERE EXISTS / subconsulta / MERGE sin JOIN)?
    │   │
    │   └── SÍ ──────────────────────────────────────────────────────► Pertenece a: pkgcn_
    │                                                                 (Recibe pcl_json IN CLOB, usa JSON_VALUE.
    │                                                                  Un método por cada sentencia DML.
    │                                                                  Mínimo 2 tablas en la sentencia.
    │                                                                  Sin sintaxis JOIN. Sin negocio ni COMMIT).
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
                                                                      (Recibe pcl_json IN CLOB, usa JSON_VALUE.
                                                                       Búsquedas SYS_REFCURSOR, sintaxis Oracle FROM t1, t2 WHERE,
                                                                       (+) para outer joins, updates por estado/fecha sin PK).
```

---

## 5. Paquetes DAO (`pkg<tabla>_dao`)

### 5.1 Convención de Nomenclatura
El nombre del paquete DAO debe formarse **exactamente** con la fórmula:
$$\text{pkg} + \text{nombre\_tabla} + \text{\_dao}$$

*Ejemplos:*
- Tabla: `SMY_USUARIOS` $\rightarrow$ Paquete: `PKGSMY_USUARIOS_DAO`
- Tabla: `SMY_ARCHIVOS` $\rightarrow$ Paquete: `PKGSMY_ARCHIVOS_DAO`
- Tabla: `SMY_RESIDENTES` $\rightarrow$ Paquete: `PKGSMY_RESIDENTES_DAO`

### 5.2 Métodos de la Plantilla Oficial DAO
Todo DAO implementa los 18 métodos estándar adaptados a la tabla correspondiente:

```sql
CREATE OR REPLACE PACKAGE PKGSMY_TABLA_DAO
AS
    TYPE ta_smy_tabla IS TABLE OF smy_tabla%ROWTYPE INDEX BY BINARY_INTEGER;

    PROCEDURE p_insertar (pro_smy_tabla IN smy_tabla%ROWTYPE);
    FUNCTION f_traer (pty_id IN smy_tabla.id%TYPE) RETURN smy_tabla%ROWTYPE;
    PROCEDURE p_consultar_registros (pta_smy_tabla OUT PKGSMY_TABLA_DAO.ta_smy_tabla);
    PROCEDURE p_eliminar_rowid (p_rowid IN VARCHAR2);
    PROCEDURE p_eliminar (pty_id IN smy_tabla.id%TYPE);
    PROCEDURE p_eliminar_registros;
    FUNCTION f_existe (pty_id IN smy_tabla.id%TYPE) RETURN BOOLEAN;
    FUNCTION f_existe (pty_id IN smy_tabla.id%TYPE, pro_smy_tabla OUT smy_tabla%ROWTYPE) RETURN BOOLEAN;
    FUNCTION f_existe (pty_id IN smy_tabla.id%TYPE, pro_smy_tabla OUT smy_tabla%ROWTYPE, p_rowid OUT VARCHAR2) RETURN BOOLEAN;
    FUNCTION f_existe_rowid (p_rowid IN VARCHAR2) RETURN BOOLEAN;
    FUNCTION f_existe_rowid (p_rowid IN VARCHAR2, pro_smy_tabla OUT smy_tabla%ROWTYPE) RETURN BOOLEAN;
    PROCEDURE p_actualizar_rowid (p_rowid IN VARCHAR2, pro_smy_tabla IN smy_tabla%ROWTYPE);
    PROCEDURE p_actualizar (pro_smy_tabla IN smy_tabla%ROWTYPE);
    PROCEDURE p_bloquear_rowid (p_rowid IN VARCHAR2, pro_smy_tabla OUT smy_tabla%ROWTYPE);
    PROCEDURE p_bloquear (pty_id IN smy_tabla.id%TYPE, pro_smy_tabla OUT smy_tabla%ROWTYPE);
    PROCEDURE p_bloquear_registros;
    FUNCTION f_traer_todos RETURN SYS_REFCURSOR;
    FUNCTION f_json (p_id IN smy_tabla.id%TYPE) RETURN CLOB;

END PKGSMY_TABLA_DAO;
/
```

### 5.3 Reglas Específicas para DAO
1. **Un DAO por tabla física**: No crear DAOs compartidos para múltiples tablas.
2. **Tipado fuerte**: Usar siempre `%ROWTYPE` para registros y `<tabla>.<columna>%TYPE` para parámetros escalares.
3. **Cero Lógica de Negocio**: No incluir validaciones de reglas de dominio ni cálculos empresariales en el DAO.
4. **Cero Orquestación Multi-tabla**: El DAO jamás consulta ni actualiza tablas ajenas a la suya.
5. **Cero COMMIT / ROLLBACK**: El DAO nunca controla la transacción. Los errores deben propagarse limpiamente al nivel superior (`pkgln_`).

---

## 6. Paquetes de Consulta y Acceso No-PK (`pkgca_`)

- **Propósito**: Encapsular consultas complejas, filtros dinámicos, búsquedas, rangos de fechas, operaciones por estado y DML masivo sobre una entidad sin depender de una única PK.
- **Nomenclatura**: `pkgca_<entidad>` (ej. `pkgca_residentes`, `pkgca_turnos`, `pkgca_medicamentos`).
- **Parámetros de Entrada**: Recibe obligatoriamente **`pcl_json IN CLOB`**.
- **Extracción de Valores**: Obligatorio mediante **`JSON_VALUE(pcl_json, '$.campo')`**.
- **Retorno Multi-Fila**: Retorna **`SYS_REFCURSOR`**.
- **Sintaxis SQL**: **Sin JOIN**. Lista de tablas separada por comas en `FROM` y condiciones en `WHERE` con `(+)` para uniones externas.

*Ejemplo Oficial de `pkgca_`:*
```sql
CREATE OR REPLACE PACKAGE PKGCA_RESIDENTES
AS
    /**
     * Consulta censo de residentes activos
     * Parámetro pcl_json: Documento JSON con filtros: { idCentro: 1, idEstado: 1, filtroTexto: "Gomez" }
     */
    PROCEDURE p_consultar_censo (
        pcl_json    IN  CLOB,
        p_cursor    OUT SYS_REFCURSOR
    );

    /**
     * Retorna ficha clínica en JSON nativo
     * Parámetro pcl_json: { idResidente: 105 }
     */
    FUNCTION f_obtener_ficha_json (
        pcl_json    IN  CLOB
    ) RETURN CLOB;

END PKGCA_RESIDENTES;
/

CREATE OR REPLACE PACKAGE BODY PKGCA_RESIDENTES
AS

    PROCEDURE p_consultar_censo (
        pcl_json    IN  CLOB,
        p_cursor    OUT SYS_REFCURSOR
    ) IS
        v_id_centro    smy_residentes.id_centro%TYPE;
        v_id_estado    smy_residentes.id_estado_residente%TYPE;
        v_filtro_texto VARCHAR2(150);
    BEGIN
        -- Extracción obligatoria mediante JSON_VALUE
        v_id_centro    := TO_NUMBER(JSON_VALUE(pcl_json, '$.idCentro'));
        v_id_estado    := TO_NUMBER(JSON_VALUE(pcl_json, '$.idEstado'));
        v_filtro_texto := JSON_VALUE(pcl_json, '$.filtroTexto');

        -- Sintaxis tradicional Oracle (CERO JOIN, uniones externas con (+))
        OPEN p_cursor FOR
            SELECT r.id,
                   r.id_centro,
                   c.nombre_centro,
                   r.codigo_expediente,
                   r.identificacion,
                   r.nombres,
                   r.apellidos,
                   r.nombres || ' ' || r.apellidos AS nombre_completo,
                   TRUNC(MONTHS_BETWEEN(SYSDATE, r.fecha_nacimiento) / 12) AS edad,
                   r.habitacion,
                   r.cama,
                   r.foto_url,
                   NVL(m.nombre_nivel_movilidad, 'Independiente') AS nivel_movilidad,
                   NVL(d.nombre_tipo_dieta, 'Normal / General') AS tipo_dieta,
                   r.alertas_clinicas,
                   NVL(e.nombre_estado_residente, 'Activo') AS estado
              FROM smy_residentes r,
                   smy_centros c,
                   smy_estados_residentes e,
                   smy_niveles_movilidad m,
                   smy_tipos_dietas d
             WHERE r.id_centro = c.id
               AND r.id_estado_residente = e.id
               AND r.id_nivel_movilidad = m.id(+)
               AND r.id_tipo_dieta = d.id(+)
               AND (v_id_centro IS NULL OR r.id_centro = v_id_centro)
               AND (v_id_estado IS NULL OR r.id_estado_residente = v_id_estado)
               AND (v_filtro_texto IS NULL OR (
                     UPPER(r.nombres) LIKE '%' || UPPER(v_filtro_texto) || '%' OR
                     UPPER(r.apellidos) LIKE '%' || UPPER(v_filtro_texto) || '%' OR
                     UPPER(r.habitacion) LIKE '%' || UPPER(v_filtro_texto) || '%' OR
                     UPPER(r.cama) LIKE '%' || UPPER(v_filtro_texto) || '%'
                   ))
             ORDER BY r.habitacion, r.cama;
    END p_consultar_censo;

    FUNCTION f_obtener_ficha_json (
        pcl_json    IN  CLOB
    ) RETURN CLOB IS
        v_id_residente smy_residentes.id%TYPE;
        vcl_resultado  CLOB;
    BEGIN
        v_id_residente := TO_NUMBER(JSON_VALUE(pcl_json, '$.idResidente'));

        SELECT JSON_OBJECT(
            'id'                  VALUE r.id,
            'idCentro'            VALUE r.id_centro,
            'nombreCentro'        VALUE c.nombre_centro,
            'codigoExpediente'    VALUE r.codigo_expediente,
            'identificacion'      VALUE r.identificacion,
            'nombres'             VALUE r.nombres,
            'apellidos'           VALUE r.apellidos,
            'nombreCompleto'      VALUE r.nombres || ' ' || r.apellidos,
            'edad'                VALUE TRUNC(MONTHS_BETWEEN(SYSDATE, r.fecha_nacimiento) / 12),
            'habitacion'          VALUE r.habitacion,
            'cama'                VALUE r.cama,
            'fotoUrl'             VALUE r.foto_url,
            'movilidad'           VALUE m.nombre_nivel_movilidad,
            'dieta'               VALUE d.nombre_tipo_dieta,
            'alertasClinicas'     VALUE r.alertas_clinicas,
            'estado'              VALUE e.nombre_estado_residente,
            'responsables'        VALUE (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id'            VALUE a.id,
                        'nombres'       VALUE a.nombres,
                        'apellidos'     VALUE a.apellidos,
                        'parentesco'    VALUE p.nombre_parentesco,
                        'telefono'      VALUE a.telefono_principal,
                        'email'         VALUE a.email
                    ) RETURNING CLOB
                )
                FROM smy_residente_acudiente ra,
                     smy_acudientes a,
                     smy_parentescos p
               WHERE ra.id_acudiente = a.id
                 AND ra.id_parentesco = p.id
                 AND ra.id_residente = r.id
            )
            RETURNING CLOB
        )
        INTO vcl_resultado
        FROM smy_residentes r,
             smy_centros c,
             smy_estados_residentes e,
             smy_niveles_movilidad m,
             smy_tipos_dietas d
       WHERE r.id_centro = c.id
         AND r.id_estado_residente = e.id
         AND r.id_nivel_movilidad = m.id(+)
         AND r.id_tipo_dieta = d.id(+)
         AND r.id = v_id_residente;

        RETURN vcl_resultado;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN NULL;
    END f_obtener_ficha_json;

END PKGCA_RESIDENTES;
/
```

---

## 7. Paquetes de Sentencias DML Multi-Tabla (`pkgcn_`)

- **Propósito Exclusivo**: Contener sentencias DML de proceso que involucran **MÁS DE UNA TABLA en la misma sentencia SQL** (ej. `INSERT ... SELECT`, `UPDATE ... WHERE EXISTS (...)`, `MERGE ... USING (...)`).
- **Nomenclatura**: `pkgcn_<proceso>` (ej. `pkgcn_residentes`, `pkgcn_facturacion`).
- **Parámetros de Entrada**: Recibe obligatoriamente **`pcl_json IN CLOB`**.
- **Extracción de Valores**: Obligatorio mediante **`JSON_VALUE(pcl_json, '$.campo')`**.
- **Sintaxis SQL**: **Sin JOIN**. Se usan subconsultas tradicionales correlacionadas, listas en `FROM` con comas y operadores relacionales.
- **Reglas Mandatorias para `pkgcn_`**:
  1. **UN SOLO MÉTODO POR CADA SENTENCIA DML**.
  2. **MÍNIMO DOS TABLAS POR SENTENCIA**.
  3. **PROHIBIDO INCLUIR SECUENCIAS DE SENTENCIAS MONO-TABLA**: Cada una se ejecuta en su DAO y se orquesta en `pkgln_`.
  4. **Cero Lógica de Negocio ni Validaciones Complejas**.
  5. **Cero COMMIT / ROLLBACK**: El control transaccional es potestad de `pkgln_`.

*Ejemplo Oficial de `pkgcn_`:*
```sql
CREATE OR REPLACE PACKAGE PKGCN_RESIDENTES
AS
    /**
     * Inactiva residentes que cuenten con egreso registrado
     * Parámetro pcl_json: { idEstadoInactivo: 2 }
     */
    PROCEDURE pr_inactivar_residentes_egresados (
        pcl_json IN CLOB
    );
END PKGCN_RESIDENTES;
/

CREATE OR REPLACE PACKAGE BODY PKGCN_RESIDENTES
AS
    PROCEDURE pr_inactivar_residentes_egresados (
        pcl_json IN CLOB
    ) IS
        v_id_estado_inactivo smy_residentes.id_estado_residente%TYPE;
    BEGIN
        -- Extracción obligatoria con JSON_VALUE
        v_id_estado_inactivo := TO_NUMBER(JSON_VALUE(pcl_json, '$.idEstadoInactivo'));

        -- Sentencia DML única multi-tabla sin sintaxis JOIN
        UPDATE smy_residentes r
           SET r.id_estado_residente       = v_id_estado_inactivo,
               r.fecha_ultima_modificacion = CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE)
         WHERE EXISTS (
             SELECT 1
               FROM smy_egresos e
              WHERE e.id_residente = r.id
                AND e.fecha_egreso <= CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE)
         );
    END pr_inactivar_residentes_egresados;

END PKGCN_RESIDENTES;
/
```

---

## 8. Paquetes de Lógica de Negocio (`pkgln_`)

- **Propósito**: **LLEVAR LA LÓGICA DE NEGOCIO**, reglas de dominio, validaciones, flujos de procesos y orquestación del caso de uso.
- **Nomenclatura**: `pkgln_<dominio>` (ej. `pkgln_archivos`, `pkgln_auth`, `pkgln_consentimientos`, `pkgln_residentes`).
- **Parámetros de Entrada**: Recibe obligatoriamente **`pcl_json IN CLOB`**.
- **Extracción de Valores**: Obligatorio mediante **`JSON_VALUE(pcl_json, '$.campo')`**.
- **Reglas Mandatorias para `pkgln_`**:
  1. **Sin Sentencias DML Directas ni SELECT Directos sobre Tablas**: `pkgln_` no escribe `INSERT INTO`, `UPDATE`, `DELETE` ni `SELECT ... FROM tabla`.
  2. **Búsquedas por PK / ID**: Exclusivamente mediante DAO (`pkgsmy_<tabla>_dao.f_traer` o `f_existe`).
  3. **Búsquedas por otros criterios**: Exclusivamente mediante `pkgca_<tabla>`.
  4. **Asignación de Secuencias Directa**: En PL/SQL:
     ```sql
     vro_auditoria.id := SEQ_SMY_AUDITORIA_ACCESOS.NEXTVAL;
     ```
     **PROHIBIDO** `SELECT secuencia.NEXTVAL INTO ... FROM DUAL;`.
  5. **Modificación Delegada**: A través de `_DAO`, `pkgca_` o `pkgcn_`.
  6. **Control Transaccional (COMMIT CONTROLADO - PROHIBIDO COMMIT DIRECTO)**:
     - `p_do_commit('<objeto>.<metodo>');` al completar el proceso exitosamente.
     - En excepción: **`ROLLBACK;`**, registro en `SMY_ERRORES` mediante `uti_ge_excepciones_pkg.p_grabar_log(vro_error);` y lanzamiento con `RAISE_APPLICATION_ERROR(-20000, ...)`.

*Ejemplo Oficial de `pkgln_`:*
```sql
CREATE OR REPLACE PACKAGE PKGLN_USUARIOS
AS
    /**
     * Actualiza el nombre de un usuario
     * Parámetro pcl_json: { idUsuario: 5, nombres: "Carlos Ramirez" }
     */
    PROCEDURE pr_actualizar_nombre_usuario (
        pcl_json IN CLOB
    );

    /**
     * Registra auditoría de acceso exitoso
     * Parámetro pcl_json: { idUsuario: 5, direccionIp: "192.168.1.50", dispositivoInfo: "Chrome Android" }
     */
    PROCEDURE pr_registrar_acceso_exitoso (
        pcl_json IN CLOB
    );
END PKGLN_USUARIOS;
/

CREATE OR REPLACE PACKAGE BODY PKGLN_USUARIOS
AS
    vro_error smy_errores%ROWTYPE;

    PROCEDURE pr_actualizar_nombre_usuario (
        pcl_json IN CLOB
    ) IS
        v_id_usuario  smy_usuarios.id%TYPE;
        v_nombres     VARCHAR2(150);
        vro_usuario   smy_usuarios%ROWTYPE;
    BEGIN
        -- 1. Extracción de parámetros con JSON_VALUE
        v_id_usuario := TO_NUMBER(JSON_VALUE(pcl_json, '$.idUsuario'));
        v_nombres    := TRIM(JSON_VALUE(pcl_json, '$.nombres'));

        -- 2. Validaciones de negocio
        IF v_id_usuario IS NULL THEN
            RAISE_APPLICATION_ERROR(-20001, 'El identificador de usuario es obligatorio.');
        END IF;
        IF v_nombres IS NULL THEN
            RAISE_APPLICATION_ERROR(-20002, 'El nombre del usuario no puede estar vacío.');
        END IF;

        -- 3. Consultar y verificar mediante DAO
        IF PKGSMY_USUARIOS_DAO.f_existe(v_id_usuario, vro_usuario) = TRUE THEN
            vro_usuario.nombre_completo            := v_nombres;
            vro_usuario.fecha_ultima_modificacion := CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE);
            
            -- 4. Modificación delegada al DAO
            PKGSMY_USUARIOS_DAO.p_actualizar(vro_usuario);
        ELSE
            RAISE_APPLICATION_ERROR(-20003, 'El usuario indicado no existe en el sistema.');
        END IF;

        -- 5. Control transaccional mediante p_do_commit
        p_do_commit('pkgln_usuarios.pr_actualizar_nombre_usuario');

    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            IF SQLCODE BETWEEN -20999 AND -20001 THEN
                RAISE;
            END IF;
            vro_error.nombre_programa := 'PKGLN_USUARIOS';
            vro_error.nombre_metodo   := 'PR_ACTUALIZAR_NOMBRE_USUARIO';
            vro_error.parametros      := SUBSTR(pcl_json, 1, 4000);
            uti_ge_excepciones_pkg.p_grabar_log(vro_error);
            RAISE_APPLICATION_ERROR(-20000, 'Se presento un error comunicarse con soporte. Número error: ' || vro_error.id || ' - ' || SQLERRM);
    END pr_actualizar_nombre_usuario;

    PROCEDURE pr_registrar_acceso_exitoso (
        pcl_json IN CLOB
    ) IS
        v_id_usuario          smy_usuarios.id%TYPE;
        v_direccion_ip        VARCHAR2(50);
        v_dispositivo_info    VARCHAR2(250);
        vro_usuario           smy_usuarios%ROWTYPE;
        vro_auditoria_accesos smy_auditoria_accesos%ROWTYPE;
    BEGIN
        -- 1. Extracción con JSON_VALUE
        v_id_usuario       := TO_NUMBER(JSON_VALUE(pcl_json, '$.idUsuario'));
        v_direccion_ip     := JSON_VALUE(pcl_json, '$.direccionIp');
        v_dispositivo_info := JSON_VALUE(pcl_json, '$.dispositivoInfo');

        -- 2. Actualización en primera tabla vía DAO
        IF PKGSMY_USUARIOS_DAO.f_existe(v_id_usuario, vro_usuario) = TRUE THEN
            vro_usuario.ultimo_acceso := CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE);
            PKGSMY_USUARIOS_DAO.p_actualizar(vro_usuario);
        END IF;

        -- 3. Inserción en segunda tabla vía DAO (Asignación directa de secuencia)
        vro_auditoria_accesos.id              := SEQ_SMY_AUDITORIA_ACCESOS.NEXTVAL;
        vro_auditoria_accesos.id_usuario      := v_id_usuario;
        vro_auditoria_accesos.accion          := 'LOGIN_EXITOSO';
        vro_auditoria_accesos.direccion_ip    := SUBSTR(v_direccion_ip, 1, 45);
        vro_auditoria_accesos.detalles        := 'Dispositivo: ' || SUBSTR(v_dispositivo_info, 1, 200) || ' | Autenticación exitosa';
        vro_auditoria_accesos.fecha_creacion  := CAST(SYSTIMESTAMP AT TIME ZONE '-05:00' AS DATE);
        PKGSMY_AUDITORIA_ACCESOS_DAO.p_insertar(vro_auditoria_accesos);

        -- 4. En pkgln_ va el COMMIT controlado
        p_do_commit('pkgln_usuarios.pr_registrar_acceso_exitoso');
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            vro_error.nombre_programa     := 'PKGLN_USUARIOS';
            vro_error.nombre_metodo       := 'PR_REGISTRAR_ACCESO_EXITOSO';
            vro_error.parametros          := SUBSTR(pcl_json, 1, 4000);
            uti_ge_excepciones_pkg.p_grabar_log(vro_error);
            RAISE_APPLICATION_ERROR(-20000, 'Se presento un error comunicarse con soporte. Número error: ' || vro_error.id || ' - ' || SQLERRM);
    END pr_registrar_acceso_exitoso;

END PKGLN_USUARIOS;
/
```

---

## 9. Procedimiento Centralizado de Transacciones (`p_do_commit`)

- **Definición Oficial del Procedimiento**:
```sql
CREATE OR REPLACE PROCEDURE p_do_commit (
    p_contexto IN VARCHAR2 DEFAULT 'General'
) AS
BEGIN
    DBMS_OUTPUT.PUT_LINE('Ejecutando COMMIT controlado para: ' || p_contexto);
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error al ejecutar COMMIT en ' || p_contexto || ': ' || SQLERRM);
        RAISE;
END;
/
```
- **Reglas Mandatorias**:
  1. Donde antes existía un `COMMIT;` directo, debe reemplazarse obligatoriamente por `p_do_commit(...)`.
  2. Parámetro `p_contexto`: Obligatorio `<nombre_paquete>.<nombre_metodo>` (ej. `p_do_commit('pkgln_auth.pr_registrar_dispositivo_push');`).

---

## 10. Estándar Obligatorio de Manejo de Excepciones y Logging

### 10.1 Errores Inesperados (`WHEN OTHERS`)
En paquetes `pkgln_`, toda excepción no anticipada debe capturarse bajo este esquema:

```sql
EXCEPTION
    WHEN OTHERS THEN
        -- 1. Rollback inmediato
        ROLLBACK;

        -- 2. Re-lanzar errores de negocio conocidos (-20001 a -20999)
        IF SQLCODE BETWEEN -20999 AND -20001 THEN
            RAISE;
        END IF;

        -- 3. Asignación de metadatos de depuración
        vro_error.nombre_programa := 'PKGLN_DOMINIO';
        vro_error.nombre_metodo   := 'PR_METODO';
        vro_error.parametros      := SUBSTR(pcl_json, 1, 4000);

        -- 4. Persistencia autónoma del error
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

---

## 11. Lista de Chequeo Arquitectónica Obligatoria (Pre-entrega)

Antes de entregar cualquier código PL/SQL, el agente debe auto-verificar:
- [ ] **Sin JOIN (Regla Mandatoria)**: ¿Se eliminó completamente la sintaxis ANSI `JOIN` (`INNER JOIN`, `LEFT JOIN`, etc.) y se usó exclusivamente `FROM tabla1 t1, tabla2 t2 WHERE t1.id = t2.id_t1` con `(+)` para outer joins?
- [ ] **Parámetros CLOB JSON (Regla Mandatoria)**: En `pkgca_`, `pkgcn_` y `pkgln_`, ¿los parámetros de entrada se reciben en un `pcl_json IN CLOB`?
- [ ] **Extracción con JSON_VALUE (Regla Mandatoria)**: ¿Los valores de entrada se extraen obligatoriamente usando `JSON_VALUE(pcl_json, '$.campo')`?
- [ ] **Clasificación**: ¿El código está en el paquete correcto (`_DAO`, `pkgca_`, `pkgcn_`, `pkgln_`) según su responsabilidad?
- [ ] **Nombre DAO**: ¿Cumple con la sintaxis exacta `PKGSMY_<TABLA>_DAO`?
- [ ] **Plantilla DAO**: ¿Mantiene los nombres y firmas de los 18 métodos oficiales sin inventar variaciones?
- [ ] **pkgcn_**: ¿Contiene sentencias DML multi-tabla de proceso sin lógica de negocio ni commit?
- [ ] **pkgln_**: ¿Lleva la lógica de negocio y está libre de DML directo y libre de SELECTs directos a tablas?
- [ ] **Transaccionalidad en pkgln_**: ¿Se utilizó `p_do_commit('<objeto>.<metodo>')` en lugar de un `COMMIT;` directo?
- [ ] **Sin COMMITs espurios**: ¿Los DAOs, `pkgca_` y `pkgcn_` se abstienen de hacer `COMMIT;` / `p_do_commit`?
- [ ] **Trazabilidad de Errores**: ¿Se asignaron `nombre_programa`, `nombre_metodo` y `parametros` en `vro_error`?
- [ ] **Log Autónomo**: ¿Se usó `uti_ge_excepciones_pkg.p_grabar_log(vro_error)`?
- [ ] **Multi-fila**: ¿Se utilizó `SYS_REFCURSOR`?
- [ ] **JSON de Salida**: ¿Se utilizó `JSON_OBJECT` / `JSON_ARRAYAGG` con `RETURNING CLOB` sin concatenaciones manuales?

---

## 12. Formato Estándar de Respuesta al Usuario

Al responder solicitudes de desarrollo PL/SQL, estructurar la salida en este orden:
1. **Clasificación arquitectónica:** (e.g. `pkgca_residentes`, `pkgln_usuarios`)
2. **Justificación técnica:** Explicación técnica de por qué pertenece a esa categoría.
3. **Package Specification:** Código `.pks`
4. **Package Body:** Código `.pkb`
5. **Consideraciones técnicas y transaccionales**
6. **Validación contra el estándar arquitectónico**
