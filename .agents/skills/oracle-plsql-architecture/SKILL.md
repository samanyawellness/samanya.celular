---
name: oracle-plsql-architecture
description: >-
  Estándar arquitectónico obligatorio de PL/SQL para Oracle. Debe activarse SIEMPRE que se solicite crear, modificar, revisar, optimizar, refactorizar o proponer código PL/SQL, paquetes Oracle, procedimientos, funciones, consultas, APIs PL/SQL, generación de JSON o manejo transaccional. Aplica la estricta separación de responsabilidades entre paquetes DAO (pkg<tabla>_dao), pkgca_ (acceso/DML sin PK, filtros y búsquedas), pkgcn_ (lógica de negocio transaccional con COMMIT/ROLLBACK) y pkgln_ (lógica funcional/algoritmos de dominio puros), control atómico de transacciones, logging persistente en SMY_ERRORES con uti_ge_excepciones_pkg.p_grabar_log, SYS_REFCURSOR y JSON nativo.
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
| **DAO** | `pkg<tabla>_dao` | Acceso a datos de UNA tabla específica por PK / ROWID (CRUD básico y plantilla oficial). | Sí (su tabla exclusiva) | **PROHIBIDO** (COMMIT/ROLLBACK arbitrario prohibido, propaga errores) | Propagación hacia capas superiores |
| **pkgca_** | `pkgca_<entidad>` | Consultas y DML multi-registro o sin PK (filtros, rangos, estados, búsquedas, batch). | Sí (tablas de la entidad) | **PROHIBIDO** salvo proceso batch explícito aislado | Propagación o log si es batch |
| **pkgcn_** | `pkgcn_<dominio>` | Orquestación de lógica de negocio transaccional multi-tabla / multi-operación. | A través de DAO / pkgca_ | **OBLIGATORIO** (Control atómico: COMMIT al éxito, ROLLBACK al fallo) | Bloque `WHEN OTHERS` con registro en `SMY_ERRORES` y `-20000` |
| **pkgln_** | `pkgln_<utilidad>` | Lógica funcional reusable, cálculos matemáticos y algoritmos puros de dominio. | **PROHIBIDO** (Cero dependencias de tablas de negocio) | **NO APLICA** | Bloque `WHEN OTHERS` con registro en `SMY_ERRORES` y `-20000` |

---

## 3. Árbol de Decisión Arquitectónico Obligatorio

Antes de escribir cualquier procedimiento o función, aplicar estrictamente este árbol de decisión:

```text
¿La operación necesita interactuar con tablas de la base de datos?
│
├── NO ─────────────────────────────────────────────────────────────► Pertenece a: pkgln_
│                                                                     (Algoritmos puros, utilitarios,
│                                                                      cálculos de fechas, parsing)
└── SÍ
    │
    ├── ¿Es una operación CRUD directa sobre una única tabla
    │   identificando registros por PK o ROWID?
    │   │
    │   └── SÍ ──────────────────────────────────────────────────────► Pertenece a: pkg<tabla>_dao
    │                                                                 (Plantilla estándar oficial)
    │
    ├── ¿Es una consulta, filtro, búsqueda o DML masivo
    │   sobre una entidad sin depender exclusivamente de su PK?
    │   │
    │   └── SÍ ──────────────────────────────────────────────────────► Pertenece a: pkgca_
    │                                                                 (Búsquedas SYS_REFCURSOR,
    │                                                                  updates por estado/fecha)
    │
    └── ¿Es una operación de negocio que coordina múltiples tablas,
        validaciones funcionales o requiere integridad transaccional?
        │
        └── SÍ ──────────────────────────────────────────────────────► Pertenece a: pkgcn_
                                                                      (Orquestador transaccional)
```

> [!NOTE]
> Si existe duda entre dos categorías, se debe explicar brevemente la justificación antes de generar el código. Si una petición del usuario ubica código en el paquete incorrecto, se debe advertir la infracción y reubicarlo.

---

## 4. Paquetes DAO (`pkg<tabla>_dao`)

### 4.1 Convención de Nomenclatura
El nombre del paquete DAO debe formarse **exactamente** con la fórmula:
$$\text{pkg} + \text{nombre\_tabla} + \text{\_dao}$$

*Ejemplos:*
- Tabla: `SMY_USUARIOS` $\rightarrow$ Paquete: `PKGSMY_USUARIOS_DAO`
- Tabla: `SMY_CITAS` $\rightarrow$ Paquete: `PKGSMY_CITAS_DAO`
- Tabla: `SMY_CONSULTAS` $\rightarrow$ Paquete: `PKGSMY_CONSULTAS_DAO`

*(Nunca omitir el prefijo `PKG` inicial; no usar nombres como `SMY_USUARIOS_DAO`).*

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
5. **Cero COMMIT / ROLLBACK**: El DAO nunca controla la transacción. Los errores deben propagarse limpiamente al nivel superior (`pkgcn_`).

---

## 5. Paquetes de Consulta y Acceso No-PK (`pkgca_`)

- **Propósito**: Encapsular consultas complejas, filtros dinámicos, búsquedas, rangos de fechas, operaciones por estado y DML masivo que no dependen exclusivamente de una clave primaria.
- **Nomenclatura**: `pkgca_<entidad>` (ej. `pkgca_usuarios`, `pkgca_citas`, `pkgca_horarios`).
- **Retorno de Conjuntos Multi-fila**: Debe usar `SYS_REFCURSOR`.
- **Límites**: No debe coordinar procesos transaccionales de negocio complejos ni reemplazar a `pkgcn_`.

*Ejemplo:*
```sql
FUNCTION fn_buscar_usuarios (
    p_nombre IN VARCHAR2,
    p_estado IN NUMBER
) RETURN SYS_REFCURSOR;

PROCEDURE pr_actualizar_estado_citas (
    p_fecha_desde IN DATE,
    p_fecha_hasta IN DATE,
    p_estado      IN NUMBER
);
```

---

## 6. Paquetes de Lógica de Negocio Transaccional (`pkgcn_`)

- **Propósito**: Representar acciones de negocio que involucran validaciones, reglas de dominio, afectación de múltiples tablas y que deben ejecutarse como una **unidad atómica de trabajo**.
- **Nomenclatura**: `pkgcn_<dominio>` (ej. `pkgcn_ordenes`, `pkgcn_citas`, `pkgcn_facturacion`).
- **Arquitectura de Llamadas**:
  $$\text{pkgcn\_} \longrightarrow \text{DAO / pkgca\_ / pkgln\_} \longrightarrow \text{COMMIT}$$

### 6.1 Manejo Transaccional en `pkgcn_`
- Cada procedimiento de negocio debe garantizar atomicidad:
  1. Ejecutar validaciones de negocio.
  2. Invocar DAOs / `pkgca_` necesarios.
  3. Ejecutar `COMMIT;` al completar con éxito todas las operaciones.
  4. En caso de cualquier error inesperado, ejecutar inmediatamente `ROLLBACK;` antes del logging.

---

## 7. Paquetes de Lógica Funcional Pura (`pkgln_`)

- **Propósito**: Contener algoritmos de dominio, formateo, utilidades matemáticas, cálculos de fechas y transformaciones reutilizables.
- **Nomenclatura**: `pkgln_<utilidad>` (ej. `pkgln_fechas`, `pkgln_textos`, `pkgln_calculos`, `pkgln_agenda`).
- **Regla Estricta**: No debe depender de tablas de negocio ni realizar DML funcional.
- **Excepción Permitida**: Se permite la invocación a `uti_ge_excepciones_pkg.p_grabar_log(vro_error);` porque funciona bajo `PRAGMA AUTONOMOUS_TRANSACTION`. Jamás consultar o insertar en `SMY_ERRORES` de forma directa.

---

## 8. Estándar Obligatorio de Manejo de Excepciones y Logging

### 8.1 Errores de Negocio Conocidos
- Deben dispararse explícitamente con códigos entre `-20001` y `-20999` y mensajes claros.
- No deben confundirse con errores inesperados del sistema.

```sql
IF l_stock < p_cantidad THEN
    RAISE_APPLICATION_ERROR(
        -20001,
        'No existe inventario suficiente para completar la operación solicitada.'
    );
END IF;
```

### 8.2 Errores Inesperados (`WHEN OTHERS`)
En paquetes `pkgcn_` y `pkgln_`, toda excepción no anticipada debe capturarse obligatoriamente bajo este esquema:

```sql
CREATE OR REPLACE PACKAGE BODY pkgcn_modulo
AS
    vro_error smy_errores%ROWTYPE;

    PROCEDURE pr_operacion (
        p_id_entidad IN NUMBER,
        p_json_datos IN CLOB
    )
    IS
    BEGIN
        -- Operaciones de negocio...

        COMMIT;
    EXCEPTION
        WHEN OTHERS THEN
            -- 1. Rollback inmediato de la transacción principal
            ROLLBACK;

            -- 2. Asignación exacta de metadatos de depuración
            vro_error.nombre_programa := 'pkgcn_modulo';
            vro_error.nombre_metodo   := 'pr_operacion';

            -- 3. Registro formateado y legible de parámetros
            vro_error.parametros :=
                   'p_id_entidad: ' || p_id_entidad
                || CHR(10)
                || 'p_json_datos: '
                || CASE 
                       WHEN DBMS_LOB.GETLENGTH(p_json_datos) > 3000 
                       THEN SUBSTR(p_json_datos, 1, 3000) || '... [TRUNCADO]'
                       ELSE p_json_datos
                   END;

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
    END pr_operacion;
END pkgcn_modulo;
```

### 8.3 Prohibiciones Estrictas de Manejo de Errores
> [!CAUTION]
> 1. **Prohibido:** `WHEN OTHERS THEN NULL;` (Nunca silenciar ni ocultar excepciones).
> 2. **Prohibido:** `WHEN OTHERS THEN RAISE_APPLICATION_ERROR(...)` sin haber ejecutado `uti_ge_excepciones_pkg.p_grabar_log(vro_error);`.
> 3. **Prohibido:** Inserciones manuales directas como `INSERT INTO SMY_ERRORES...`.
> 4. **Prohibido:** Nombres genéricos en `vro_error.nombre_programa` (e.g. `'PACKAGE'`, `'PROCESO'`).

---

## 9. Retorno Multi-Fila y Generación de JSON en Oracle

### 9.1 Consultas Multi-Fila: `SYS_REFCURSOR`
Cualquier procedimiento o función de consulta multi-registro debe retornar un `SYS_REFCURSOR`:
```sql
FUNCTION fn_buscar_citas (
    p_id_profesional IN NUMBER,
    p_fecha          IN DATE
) RETURN SYS_REFCURSOR
IS
    l_cursor SYS_REFCURSOR;
BEGIN
    OPEN l_cursor FOR
        SELECT id_cita, id_paciente, fecha_hora, estado
          FROM smy_citas
         WHERE id_profesional = p_id_profesional
           AND TRUNC(fecha_hora) = TRUNC(p_fecha);
    RETURN l_cursor;
END fn_buscar_citas;
```

### 9.2 Generación Nativa de JSON (APIs / Frontends / APEX / Node)
Cuando el consumidor requiera JSON, se debe generar **directamente en el motor Oracle** con funciones SQL/JSON nativas y cláusula `RETURNING CLOB`.
> [!WARNING]
> Queda **terminantemente prohibida** la concatenación manual de cadenas para formar JSON (e.g. `'{ "id": ' || id || '}'`).

```sql
-- Objeto individual
SELECT JSON_OBJECT(
           'id' VALUE id,
           'nombre' VALUE nombre,
           'estado' VALUE estado
           RETURNING CLOB
       )
  INTO p_json_clob
  FROM smy_usuarios
 WHERE id = p_id;

-- Colección de objetos (Array)
SELECT JSON_ARRAYAGG(
           JSON_OBJECT(
               'id' VALUE u.id,
               'nombre' VALUE u.nombre,
               'correo' VALUE u.correo
               RETURNING CLOB
           )
           RETURNING CLOB
       )
  INTO p_json_clob
  FROM smy_usuarios u
 WHERE u.estado = 1;
```

---

## 10. Nomenclatura de Subprogramas

| Ámbito | Funciones | Procedimientos |
| :--- | :--- | :--- |
| **Plantilla DAO oficial** | Prefijo `f_` (`f_traer`, `f_existe`, `f_json`) | Prefijo `p_` (`p_insertar`, `p_actualizar`, `p_eliminar`) |
| **Nuevos pkgca_, pkgcn_, pkgln_** | Prefijo `fn_` (`fn_buscar_citas`, `fn_calcular`) | Prefijo `pr_` (`pr_confirmar_orden`, `pr_actualizar_estado`) |

---

## 11. Lista de Chequeo Arquitectónica Obligatoria (Pre-entrega)

Antes de entregar cualquier código, el agente debe auto-verificar:
- [ ] **Clasificación**: ¿El código está en el paquete correcto (`_DAO`, `pkgca_`, `pkgcn_`, `pkgln_`) según su responsabilidad?
- [ ] **Nombre DAO**: ¿Cumple con la sintaxis exacta `PKGSMY_<TABLA>_DAO`?
- [ ] **Plantilla DAO**: ¿Mantiene los nombres y firmas de los 18 métodos oficiales sin inventar variaciones?
- [ ] **Tipado**: ¿Se utilizan `%ROWTYPE` y `%TYPE` en lugar de tipos genéricos?
- [ ] **Pureza Funcional**: ¿`pkgln_` está completamente libre de dependencias de tablas de negocio y DML?
- [ ] **Transaccionalidad**: ¿`pkgcn_` maneja atomicidad (`COMMIT` al final, `ROLLBACK` previo al log)?
- [ ] **Sin COMMITs espurios**: ¿Los DAOs y subprogramas de bajo nivel se abstienen de hacer `COMMIT`?
- [ ] **Trazabilidad de Errores**: ¿Se asignaron `nombre_programa`, `nombre_metodo` y `parametros` en `vro_error`?
- [ ] **Log Autónomo**: ¿Se usó `uti_ge_excepciones_pkg.p_grabar_log(vro_error)`?
- [ ] **Error al Cliente**: ¿Se utilizó `RAISE_APPLICATION_ERROR(-20000, '... Número error: ' || vro_error.id || ' - ' || SQLERRM);`?
- [ ] **Multi-fila**: ¿Se utilizó `SYS_REFCURSOR`?
- [ ] **JSON**: ¿Se utilizó `JSON_OBJECT` / `JSON_ARRAYAGG` con `RETURNING CLOB` sin concatenaciones manuales?

---

## 12. Formato Estándar de Respuesta al Usuario

Al responder solicitudes de desarrollo PL/SQL, estructurar la salida en este orden:
1. **Clasificación arquitectónica:** (e.g. `pkgcn_citas`)
2. **Justificación breve:** Explicación técnica de por qué pertenece a esa categoría.
3. **Package Specification:** Código `.pks`
4. **Package Body:** Código `.pkb`
5. **Consideraciones técnicas y transaccionales**
6. **Validación contra el estándar arquitectónico**
