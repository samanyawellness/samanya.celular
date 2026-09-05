# SAMANYA OS - Backend REST API

API REST intermedia desarrollada en Node.js + Express + TypeScript con conexión segura a Oracle Database para SAMANYA OS (Sistema de Gestión Integral para Centros Geriátricos).

---

## 🏗️ Arquitectura y Estándares

- **Conexión a Base de Datos:** `node-oracledb` mediante pool administrado con reconexión automática y release seguro.
- **Autenticación:** JWT con arquitectura de doble token:
  - `Access Token` (corta duración: 15 min, en memoria).
  - `Refresh Token` (larga duración: 15 días, rotativo).
- **Control por Roles (RBAC):** Middleware de autorización (`ADMIN`, `CUIDADOR`, `FAMILIAR`).
- **Trazabilidad y Auditoría:** Registro de cada intento de acceso en la tabla `SMY_AUDITORIA_ACCESOS`.
- **Notificaciones Push:** Control de dispositivos móviles en `SMY_DISPOSITIVOS_PUSH` (FCM / APNs).
- **Estándar PL/SQL:** Todo objeto de base de datos sigue estrictamente la especificación `oracle-plsql-architecture`.

---

## 🚀 Puesta en Marcha Local

### 1. Variables de Entorno (`.env`)
Asegúrate de tener configurado el archivo `.env` en la raíz de `backend/`:
```ini
NODE_ENV=development
PORT=4000

DB_USER=SAMANYA
DB_PASSWORD=T3k3r_2025_DEV
DB_CONNECT_STRING=tekersalud-db.maxapex.net:1521/orclpdb1
DB_POOL_MIN=2
DB_POOL_MAX=10

JWT_SECRET=samanya_secret_jwt_key_2025_geriatric_care_secure
JWT_REFRESH_SECRET=samanya_refresh_jwt_key_2025_geriatric_care_secure
```

### 2. Scripts Disponibles
```bash
# Instalar dependencias
npm install

# Iniciar servidor en modo desarrollo con recarga en caliente
npm run dev

# Validar tipos TypeScript
npm run typecheck

# Compilar para producción
npm run build

# Iniciar bundle de producción
npm start
```

---

## 📜 Scripts PL/SQL para Compilación Manual

Los scripts PL/SQL propuestos se encuentran en `db/scripts/` para su revisión y compilación manual:
1. `01_pkgsmy_dispositivos_push_dao.sql`: Paquete DAO oficial de 18 métodos para la tabla `SMY_DISPOSITIVOS_PUSH`.
2. `02_pkgcn_auth.sql`: Paquete transaccional con `COMMIT`/`ROLLBACK` y registro de excepciones autónomo en `SMY_ERRORES`.
