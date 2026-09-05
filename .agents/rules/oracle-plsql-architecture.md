---
description: Reglas y directrices obligatorias de arquitectura PL/SQL para Oracle en SAMANYA
---

# Reglas Arquitectónicas PL/SQL Oracle

Cada vez que se solicite generar, modificar, revisar, optimizar, refactorizar o proponer código PL/SQL:

1. **Clasificación Previa Obligatoria**: Identificar la responsabilidad y ubicar el código en su familia correspondiente:
   - `pkg<tabla>_dao`: Acceso a datos de una tabla por PK/ROWID (plantilla oficial de 18 métodos). Sin COMMIT/ROLLBACK. Prefijo obligatorio `PKGSMY_<TABLA>_DAO`.
   - `pkgca_`: Búsquedas, filtros multi-criterio (`SYS_REFCURSOR`), estados, fechas y DML masivo sin PK.
   - `pkgcn_`: Transacciones de negocio atómicas, coordinación multi-tabla, orquestación de llamadas y control de `COMMIT`/`ROLLBACK`.
   - `pkgln_`: Lógica pura, utilidades y algoritmos sin dependencias de tablas de negocio ni DML.

2. **Logging en SMY_ERRORES**:
   - Todo fallo imprevisto en `pkgcn_` y `pkgln_` captura `WHEN OTHERS`, ejecuta `ROLLBACK;`, puebla `vro_error smy_errores%ROWTYPE;`, invoca `uti_ge_excepciones_pkg.p_grabar_log(vro_error);` y lanza `RAISE_APPLICATION_ERROR(-20000, 'Se presento un error comunicarse con soporte. Número error: ' || vro_error.id || ' - ' || SQLERRM);`.

3. **Manejo de JSON y Cursors**:
   - Multi-fila siempre retorna `SYS_REFCURSOR`.
   - JSON siempre nativo con `JSON_OBJECT` / `JSON_ARRAYAGG` y `RETURNING CLOB`. Cero concatenación de cadenas.

4. **Formato de Respuesta**:
   - 1. Clasificación arquitectónica.
   - 2. Justificación técnica.
   - 3. Package Specification (`.pks`).
   - 4. Package Body (`.pkb`).
   - 5. Consideraciones técnicas.
   - 6. Validación contra el estándar.

Para la especificación completa, remitirse al skill [oracle-plsql-architecture](file:///c:/Orlando/Repositorios/SAMANYA/.agents/skills/oracle-plsql-architecture/SKILL.md).
