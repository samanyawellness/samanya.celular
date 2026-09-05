# SAMANYA OS - Aplicación Móvil (React Native + Expo)

Aplicación móvil multiplataforma (iOS y Android) para SAMANYA OS (Sistema de Gestión Integral para Centros Geriátricos), construida con Expo SDK 52+, TypeScript y React Navigation v7.

---

## 📱 Navegación por Roles

La app implementa un enrutador dinámico atómico condicional (`RootNavigator`):
- **CUIDADOR (Personal Asistencial):** 5 pestañas inferiores (*Perfil, Residentes, Inicio, Tareas, Consent.*) con acceso a escaneo QR, checklist masivo y ficha 360 del residente.
- **FAMILIAR (Acudientes y Tutores):** 4 pestañas inferiores (*Perfil, Bitácora, Inicio, Residente*) con selector de familiar, timeline de cuidados y firma digital de consentimientos.
- **ADMIN (Dirección y Coordinación):** 5 pestañas (*Dashboard, Personal, Admisiones, Auditoría, Ajustes*).

---

## 🔐 Seguridad y Almacenamiento Criptográfico

- Los tokens de sesión y la clave de refresco se almacenan en hardware seguro mediante `expo-secure-store` (Android KeyStore / iOS Keychain).
- Las credenciales de base de datos Oracle **nunca** están presentes en el cliente móvil; toda comunicación pasa por la API intermedia en Node.js/Express.

---

## 🚀 Puesta en Marcha Local

### 1. Iniciar Servidor de Desarrollo Expo
```bash
# En la carpeta mobile/
npm start

# O para correr directamente en Android o iOS:
npm run android
npm run ios
```

### 2. Configuración de Conexión a la API
En `app.json` (sección `extra.apiUrl`):
- **Emulador Android:** `http://10.0.2.2:4000/api/v1`
- **Simulador iOS:** `http://localhost:4000/api/v1`
- **Dispositivo físico en red local:** `http://<IP_LOCAL_DE_TU_PC>:4000/api/v1`
