# Estándar Arquitectónico PL/SQL Oracle

Este repositorio contiene y aplica el estándar arquitectónico corporativo para el desarrollo en Oracle PL/SQL.

## Directrices Mandatorias para el Agente

Cada vez que se solicite generar, modificar, revisar, optimizar, refactorizar o proponer código PL/SQL:

1. **Clasificación Previa Obligatoria**: Identificar la responsabilidad y ubicar el código en su familia correspondiente:
   - `pkg<tabla>_dao`: Acceso a datos exclusivo de UNA tabla por PK/ROWID (plantilla oficial de 18 métodos). Sin COMMIT/ROLLBACK.
   - `pkgca_`: Búsquedas, filtros multi-criterio (`SYS_REFCURSOR`), estados, fechas y DML masivo sin PK sobre una entidad.
     * **Parámetros de entrada**: Recibe obligatoriamente un parámetro `pcl_json IN CLOB` con el documento JSON.
     * **Extracción de campos**: Se extrae obligatoriamente utilizando `JSON_VALUE(pcl_json, '$.campo')`.
   - `pkgcn_`: Sentencias DML de proceso que involucran MÁS DE UNA TABLA en la misma sentencia SQL (ej. INSERT...SELECT, UPDATE...WHERE EXISTS, MERGE...USING).
     * **Solo debe tener UN método por cada sentencia DML**.
     * La sentencia DML debe involucrar **COMO MÍNIMO DOS TABLAS** en la misma sentencia SQL.
     * **NO contiene sentencias DML mono-tabla**: Si un proceso requiere modificar tabla A y tabla B con sentencias independientes, cada una se ejecuta vía su respectivo `_dao` o `pkgca_`, orquestándose en `pkgln_`.
     * **Parámetros de entrada**: Recibe obligatoriamente un parámetro `pcl_json IN CLOB` con el documento JSON y extrae usando `JSON_VALUE(pcl_json, '$.campo')`.
     * No contiene lógica de negocio, validaciones complejas ni COMMIT/ROLLBACK.
   - `pkgln_`: **Lógica de negocio**, validaciones y reglas de dominio del caso de uso.
     * **Parámetros de entrada**: Recibe obligatoriamente un parámetro `pcl_json IN CLOB` con el documento JSON y extrae usando `JSON_VALUE(pcl_json, '$.campo')`.
     * **Sin sentencias DML directas** (INSERT, UPDATE, DELETE) y **sin sentencias SELECT directas sobre tablas**.
     * **Búsquedas por ID / PK**: Se realizan exclusivamente mediante `pkg<tabla>_dao` (`f_traer`, `f_existe`).
     * **Búsquedas por otros criterios** (nombre, email, estado, filtros): Se realizan exclusivamente mediante paquetes `pkgca_<tabla>` llamando a la función de búsqueda.
     * **Asignación de secuencias**: Utilizar asignación directa (`vro_auditoria.id := SEQ_SMY_AUDITORIA_ACCESOS.NEXTVAL;`), **nunca hacer SELECT ... FROM DUAL**.
     * Orquesta el flujo: valida con DAO (`IF pkg<tabla>_dao.f_existe(...)`), actualiza con DAO (`pkg<tabla>_dao.p_actualizar(...)`), inserta con DAO (`pkgsmy_auditoria_accesos_dao.p_insertar(...)`), o invoca `pkgcn_` si aplica una sentencia multi-tabla.
     * **Control transaccional (COMMIT controlado)**: En `pkgln_` se ejecuta el COMMIT al completar el proceso, pero **nunca mediante `COMMIT;` directo**. Se debe invocar obligatoriamente el procedimiento `p_do_commit('<objeto>.<metodo>');` enviando como parámetro el contexto (nombre del paquete + nombre del método, ej: `p_do_commit('pkgln_auth.pr_registrar_dispositivo_push');`).
     * Captura `WHEN OTHERS`, ejecuta `ROLLBACK;`, puebla `vro_error smy_errores%ROWTYPE;`, invoca `uti_ge_excepciones_pkg.p_grabar_log(vro_error);` y lanza `RAISE_APPLICATION_ERROR(-20000, 'Se presento un error comunicarse con soporte. Número error: ' || vro_error.id || ' - ' || SQLERRM);`.

2. **Prohibición Absoluta de la Nomenclatura `JOIN`**:
   - **Queda terminantemente prohibido el uso de la sintaxis ANSI JOIN** (`JOIN`, `INNER JOIN`, `LEFT JOIN`, `LEFT OUTER JOIN`, `RIGHT JOIN`, `FULL JOIN`, `CROSS JOIN`).
   - Las consultas multi-tabla se construyen exclusivamente con la **sintaxis tradicional de Oracle**:
     * Tablas separadas por comas en el `FROM`: `FROM smy_residentes r, smy_centros c, smy_estados_residentes e`
     * Condiciones de relación en el `WHERE`: `WHERE r.id_centro = c.id AND r.id_estado_residente = e.id`
     * Outer Joins (uniones externas) exclusivamente con el operador nativo `(+)`: `WHERE r.id_nivel_movilidad = m.id(+)`

3. **Manejo de Parámetros y JSON**:
   - Parámetros de entrada en `pkgca_`, `pkgcn_` y `pkgln_`: siempre en un `pcl_json IN CLOB`, extrayendo los campos con `JSON_VALUE`.
   - Multi-fila siempre retorna `SYS_REFCURSOR`.
   - JSON de salida siempre nativo con `JSON_OBJECT` / `JSON_ARRAYAGG` y `RETURNING CLOB`. Cero concatenación de cadenas.

4. **Formato de Respuesta**:
   - 1. Clasificación arquitectónica.
   - 2. Justificación técnica.
   - 3. Package Specification (`.pks`).
   - 4. Package Body (`.pkb`).
   - 5. Consideraciones técnicas.
   - 6. Validación contra el estándar.

Para ver la especificación completa, consultar [oracle-plsql-architecture/SKILL.md](file:///c:/Repositorios/SAMANYA/.agents/skills/oracle-plsql-architecture/SKILL.md).
