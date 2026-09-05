# Skill: Estándar Arquitectónico PL/SQL para Oracle

Skill oficial y permanente para el diseño, desarrollo, refactorización y revisión de código PL/SQL en bases de datos Oracle bajo arquitectura modular por capas.

## Estructura del Skill

```text
oracle-plsql-architecture/
├── SKILL.md                                  # Instrucción maestra y estándar arquitectónico
├── README.md                                 # Guía de uso y despliegue del skill
├── references/
│   ├── architectural_decision_tree.md        # Árbol de decisión y matriz de responsabilidades
│   ├── dao_template_reference.md             # Especificación detallada de los 18 métodos DAO
│   └── error_handling_and_logging.md         # Estándar de excepciones, SMY_ERRORES y logging autónomo
└── examples/
    ├── pkgsmy_usuarios_dao.pks               # Especificación DAO de referencia
    ├── pkgsmy_usuarios_dao.pkb               # Implementación de los 18 métodos DAO
    ├── pkgcn_ordenes.pks                     # Especificación de orquestador de negocio
    ├── pkgcn_ordenes.pkb                     # Implementación transaccional con COMMIT/ROLLBACK
    ├── pkgca_usuarios.pks                    # Especificación para consultas sin PK (SYS_REFCURSOR)
    ├── pkgca_usuarios.pkb                    # Implementación de búsquedas multi-fila
    ├── pkgln_fechas.pks                      # Especificación de lógica funcional pura
    └── pkgln_fechas.pkb                      # Implementación de cálculos algorítmicos sin BD
```

## Reglas Clave

1. **Clasificación Estricta**:
   - `pkg<tabla>_dao`: Acceso exclusivo a una tabla mediante PK/ROWID.
   - `pkgca_`: Búsquedas multi-fila (`SYS_REFCURSOR`), filtros y DML masivo sin PK.
   - `pkgcn_`: Orquestador de negocio, operaciones multi-tabla, control atómico transaccional (`COMMIT` / `ROLLBACK`).
   - `pkgln_`: Funciones puras y algoritmos de dominio. Cero acceso a tablas de negocio.
2. **Plantilla DAO de 18 Métodos**: Nombres estandarizados (`p_insertar`, `f_traer`, `f_existe`, etc.).
3. **Manejo de Errores y Logging**:
   - Errores de negocio: `-20001` a `-20999`.
   - Inesperados (`WHEN OTHERS`): `ROLLBACK`, poblar `vro_error`, ejecutar `uti_ge_excepciones_pkg.p_grabar_log(vro_error)` y lanzar `RAISE_APPLICATION_ERROR(-20000, 'Se presento un error comunicarse con soporte. Número error: ' || vro_error.id || ' - ' || SQLERRM);`.
4. **JSON Nativo**: Uso obligatorio de `JSON_OBJECT` y `JSON_ARRAYAGG` con `RETURNING CLOB`. Prohibida la concatenación manual de cadenas.
