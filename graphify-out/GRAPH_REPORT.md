# Graph Report - SAMANYA  (2026-09-18)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 923 nodes · 1618 edges · 182 communities (59 shown, 123 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fbfb0423`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useAuthStore
- useApp
- AppContext.tsx
- mobile/package.json
- GoogleDriveService
- expo
- dependencies
- backend/package.json
- V_SMY_TIMELINE_RESIDENTE
- package.json
- compilerOptions
- api.ts
- app.ts
- withConnection
- devices.controller.ts
- compilerOptions
- creacion_modelo_relacional.sql
- ref_express
- maestras.routes.ts
- dependencies
- ClinicalHistorySection.tsx
- ExampleInstrumentedTest.java
- auth.service.ts
- test_archivos_logic.ts
- dependencies
- devDependencies
- ResidentesController
- components/ConsentsScreen.tsx
- auth.routes.ts
- consentimientos.controller.ts
- devDependencies
- auth.middleware.ts
- authenticate
- auth.repository.ts
- tareas.controller.ts
- VW_SMY_ARCHIVOS_ACTIVOS
- taskFormatters.ts
- notificaciones.controller.ts
- compilerOptions
- RoleDropdownSelector.tsx
- TaskItem
- scripts
- archivos.service.ts
- scripts
- DevicesRepository
- SMY_ORGANIZACIONES
- gradlew
- notificaciones.routes.ts
- residentes.routes.ts
- tareas.routes.ts
- main.tsx
- IncidentReportScreen.tsx
- MainActivity.java
- capacitor.config.ts
- IDX_SMY_CEN_USR_CEN
- IDX_SMY_EMP_CENTRO
- IDX_SMY_ERR_FECHA
- IDX_SMY_ORG_DUE_ORG
- IDX_SMY_PAR_GRUPO
- SMY_REGISTROS_ADMIN_MED
- IDX_SMY_TR_RES
- SMY_USUARIOS
- IDX_SMY_MC_CONV
- IDX_SMY_NOTIF_USER_LEI
- IDX_SMY_RAD_RES_FEC
- IDX_SMY_SOL_CENTRO
- IDX_SMY_SUM_RES_FEC

## God Nodes (most connected - your core abstractions)
1. `useApp()` - 79 edges
2. `lucide-react` - 45 edges
3. `useAuthStore` - 37 edges
4. `withConnection()` - 35 edges
5. `AppContextType` - 22 edges
6. `Colors` - 18 edges
7. `lucide-react-native` - 16 edges
8. `react-native` - 15 edges
9. `compilerOptions` - 15 edges
10. `V_SMY_TIMELINE_RESIDENTE` - 13 edges

## Surprising Connections (you probably didn't know these)
- `AdminProfileScreen()` --calls--> `useApp()`  [EXTRACTED]
  src/components/admin/AdminProfileScreen.tsx → src/context/AppContext.tsx
- `AdminShiftsScreen()` --calls--> `useApp()`  [EXTRACTED]
  src/components/admin/AdminShiftsScreen.tsx → src/context/AppContext.tsx
- `AdminTasksScreen()` --calls--> `useApp()`  [EXTRACTED]
  src/components/admin/AdminTasksScreen.tsx → src/context/AppContext.tsx
- `FamiliarCalendarioScreen()` --calls--> `useApp()`  [EXTRACTED]
  src/components/familiar/FamiliarCalendarioScreen.tsx → src/context/AppContext.tsx
- `App()` --calls--> `useAuthStore`  [EXTRACTED]
  mobile/App.tsx → mobile/src/store/auth.store.ts

## Import Cycles
- None detected.

## Communities (182 total, 123 thin omitted)

### Community 0 - "useAuthStore"
Cohesion: 0.08
Nodes (62): Colors, BitacoraEntry, ConsentRecord, MOCK_BITACORA, MOCK_CONSENTS, MOCK_RESIDENTS, MOCK_TASKS, Resident (+54 more)

### Community 1 - "useApp"
Cohesion: 0.10
Nodes (34): lucide-react, ref_react, MainLayout(), AdminBottomNav(), AdminHomeScreen(), AdminShiftDetailModal(), AdminTaskDetailModal(), SedeSelectorChip() (+26 more)

### Community 2 - "AppContext.tsx"
Cohesion: 0.11
Nodes (40): AdminShiftsScreen(), AppContext, AppContextType, INITIAL_ACTIVITY_TIMELINE, INITIAL_BITACORA, INITIAL_CLINICAL_RECORDS, INITIAL_CONSENTS, INITIAL_DELETED_CLINICAL_RECORDS (+32 more)

### Community 3 - "mobile/package.json"
Cohesion: 0.05
Nodes (37): App(), queryClient, devDependencies, @babel/core, @types/react, typescript, react, main (+29 more)

### Community 4 - "GoogleDriveService"
Cohesion: 0.11
Nodes (15): GDriveUploadResult, GoogleDriveService, main(), SCOPES, testDriveUpload(), ref_child_process, ref_fs, googleapis (+7 more)

### Community 5 - "expo"
Cohesion: 0.09
Nodes (22): backgroundColor, foregroundImage, adaptiveIcon, package, expo, android, extra, icon (+14 more)

### Community 6 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, axios, expo, expo-camera, expo-constants, expo-font, expo-linear-gradient, expo-notifications (+13 more)

### Community 7 - "backend/package.json"
Cohesion: 0.10
Nodes (19): description, engines, node, express, tsx, main, name, private (+11 more)

### Community 8 - "V_SMY_TIMELINE_RESIDENTE"
Cohesion: 0.11
Nodes (18): IDX_SMY_BIT_RES_FEC, IDX_SMY_CONS_RES_EST, IDX_SMY_INC_FEC_SEV, IDX_SMY_IR_INC, IDX_SMY_IR_RES, IDX_SMY_MP_RES_EST, IDX_SMY_SV_RES_FEC, V_SMY_TIMELINE_RESIDENTE (+10 more)

### Community 9 - "package.json"
Cohesion: 0.11
Nodes (17): express, react, tsx, @types/express, @types/node, typescript, name, private (+9 more)

### Community 10 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 11 - "api.ts"
Cohesion: 0.20
Nodes (13): @capacitor/core, CentroSelectionModal(), CentroSelectionModalProps, LoginScreen(), AppProvider(), getActiveCentroContext(), getApiBaseUrl(), getAuthToken() (+5 more)

### Community 12 - "app.ts"
Cohesion: 0.27
Nodes (10): createApp(), env, envSchema, parsed, closeOraclePool(), initOraclePool(), errorHandler(), bootstrap() (+2 more)

### Community 13 - "withConnection"
Cohesion: 0.23
Nodes (3): withConnection(), ArchivosService, ResidentesService

### Community 14 - "devices.controller.ts"
Cohesion: 0.21
Nodes (6): DevicesController, RegisterDeviceDto, registerDeviceSchema, UnregisterDeviceDto, unregisterDeviceSchema, DevicesService

### Community 15 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, outDir, resolveJsonModule (+6 more)

### Community 16 - "creacion_modelo_relacional.sql"
Cohesion: 0.19
Nodes (14): IDX_SMY_ARC_CEN_EST, IDX_SMY_ARC_CLA_EST, IDX_SMY_ARC_DIR_BD, IDX_SMY_ARC_HASH, IDX_SMY_ARC_ORIGEN, IDX_SMY_ARC_RES_EST, IDX_SMY_DP_USU_ACT, IDX_SMY_RA_ACU (+6 more)

### Community 17 - "ref_express"
Cohesion: 0.16
Nodes (5): ArchivosController, archivosRoutes, upload, ref_express, multer

### Community 18 - "maestras.routes.ts"
Cohesion: 0.16
Nodes (6): MaestrasController, controller, maestrasRoutes, router, MaestrasService, TABLAS_MAESTRAS_ORGANIZACION

### Community 19 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, @capacitor/android, @capacitor/core, dotenv, express, @google/genai, lucide-react, motion (+5 more)

### Community 20 - "ClinicalHistorySection.tsx"
Cohesion: 0.26
Nodes (9): ClinicalHistorySection(), ClinicalHistorySectionProps, FamiliarResidenteScreen(), ResidentDetailModal(), ResidentQRPlaceholderScreen(), ResidentQRPlaceholderScreenProps, api, ClinicalRecordCategory (+1 more)

### Community 21 - "ExampleInstrumentedTest.java"
Cohesion: 0.24
Nodes (8): ExampleInstrumentedTest, ExampleUnitTest, androidx.test.ext.junit.runners.AndroidJUnit4, assert, context, instrumentationregistry, org.junit.runner.RunWith, org.junit.Test

### Community 22 - "auth.service.ts"
Cohesion: 0.29
Nodes (5): LoginDto, loginSchema, RefreshTokenDto, refreshTokenSchema, AuthService

### Community 23 - "test_archivos_logic.ts"
Cohesion: 0.24
Nodes (11): construirRutaDocumentos(), construirRutaResidente(), construirRutaSede(), generarNombreAlmacenado(), nombreAlmacenado, normalizarExtension(), rutaDoc, rutaRes (+3 more)

### Community 24 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, bcryptjs, cors, dotenv, express, googleapis, helmet, jsonwebtoken (+3 more)

### Community 25 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, rimraf, tsx, @types/bcryptjs, @types/cors, @types/express, @types/jsonwebtoken, @types/multer (+3 more)

### Community 26 - "ResidentesController"
Cohesion: 0.18
Nodes (3): ResidentesController, residentesService, ResidenteResumenDTO

### Community 27 - "components/ConsentsScreen.tsx"
Cohesion: 0.20
Nodes (8): ConsentsScreen(), BitacoraTypeFilter, FamiliarBitacoraScreen(), CaregiverFilterCategory, FamiliarCalendarioScreen(), TimelineItem, ConsentRecord, ConsentStatus

### Community 28 - "auth.routes.ts"
Cohesion: 0.20
Nodes (4): AuthController, authRoutes, controller, router

### Community 29 - "consentimientos.controller.ts"
Cohesion: 0.22
Nodes (4): ConsentimientosController, consentimientosService, ConsentimientosService, FirmarConsentimientoDTO

### Community 30 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, autoprefixer, @capacitor/cli, esbuild, tailwindcss, tsx, @types/express, @types/node (+2 more)

### Community 31 - "auth.middleware.ts"
Cohesion: 0.31
Nodes (6): Express, Request, ApiResponse, TokenPayload, UserRole, jsonwebtoken

### Community 32 - "authenticate"
Cohesion: 0.22
Nodes (7): authenticate(), consentimientosRoutes, controller, router, controller, deviceRoutes, router

### Community 33 - "auth.repository.ts"
Cohesion: 0.22
Nodes (3): AuthRepository, UserCentroDbRow, UserDbRow

### Community 34 - "tareas.controller.ts"
Cohesion: 0.25
Nodes (3): TareasController, tareasService, TareasService

### Community 35 - "VW_SMY_ARCHIVOS_ACTIVOS"
Cohesion: 0.22
Nodes (9): IDX_SMY_CEN_ORG, IDX_SMY_RES_CENTRO, IDX_SMY_RES_ESTADO, IDX_SMY_RES_HAB, VW_SMY_ARCHIVOS_ACTIVOS, SMY_CENTROS, SMY_CLASES_ARCHIVOS, SMY_ESTADOS_ARCHIVOS (+1 more)

### Community 36 - "taskFormatters.ts"
Cohesion: 0.28
Nodes (6): TaskStatus, getTaskRelativeTime(), isTaskOverdue(), parseTimeToMinutes(), RelativeTimeInfo, TaskVisual

### Community 37 - "notificaciones.controller.ts"
Cohesion: 0.33
Nodes (3): NotificacionesController, notificacionesService, NotificacionesService

### Community 38 - "compilerOptions"
Cohesion: 0.29
Nodes (6): compilerOptions, baseUrl, paths, strict, extends, expo/tsconfig.base

### Community 39 - "RoleDropdownSelector.tsx"
Cohesion: 0.38
Nodes (5): AdminProfileScreen(), ROLE_OPTIONS, RoleDropdownSelector(), RoleOption, UserRole

### Community 40 - "TaskItem"
Cohesion: 0.33
Nodes (4): AdminTasksScreen(), EntityFilter, TaskDetailModalProps, TaskItem

### Community 41 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, oauth:setup, start, typecheck

### Community 42 - "archivos.service.ts"
Cohesion: 0.47
Nodes (4): ArchivoDTO, SubirArchivoParams, readResultSet(), oracledb

### Community 43 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, clean, dev, lint, preview

### Community 45 - "SMY_ORGANIZACIONES"
Cohesion: 0.40
Nodes (4): IDX_SMY_ORG_EST, SMY_ESTADOS_ORGANIZACIONES, SMY_ORGANIZACIONES, SMY_TIPOS_IDENTIFICACION

### Community 46 - "gradlew"
Cohesion: 0.83
Nodes (3): gradlew script, die(), warn()

### Community 47 - "notificaciones.routes.ts"
Cohesion: 0.50
Nodes (3): controller, notificacionesRoutes, router

### Community 48 - "residentes.routes.ts"
Cohesion: 0.50
Nodes (3): controller, residentesRoutes, router

### Community 49 - "tareas.routes.ts"
Cohesion: 0.50
Nodes (3): controller, router, tareasRoutes

### Community 50 - "main.tsx"
Cohesion: 0.50
Nodes (3): ref_react_dom_client, App(), src_index

### Community 51 - "IncidentReportScreen.tsx"
Cohesion: 0.50
Nodes (3): IncidentReportScreen(), IncidentSeverity, IncidentType

### Community 54 - "IDX_SMY_CEN_USR_CEN"
Cohesion: 0.67
Nodes (3): IDX_SMY_CEN_USR_CEN, IDX_SMY_CEN_USR_USR, SMY_CENTRO_USUARIOS

### Community 55 - "IDX_SMY_EMP_CENTRO"
Cohesion: 0.67
Nodes (3): IDX_SMY_EMP_CENTRO, IDX_SMY_EMPLEADOS_USU, SMY_EMPLEADOS

### Community 56 - "IDX_SMY_ERR_FECHA"
Cohesion: 0.67
Nodes (3): IDX_SMY_ERR_FECHA, IDX_SMY_ERR_PROG, SMY_ERRORES

### Community 57 - "IDX_SMY_ORG_DUE_ORG"
Cohesion: 0.67
Nodes (3): IDX_SMY_ORG_DUE_ORG, IDX_SMY_ORG_DUE_USR, SMY_ORGANIZACION_DUENOS

### Community 58 - "IDX_SMY_PAR_GRUPO"
Cohesion: 0.67
Nodes (3): IDX_SMY_PAR_GRUPO, IDX_SMY_PAR_ORG_CEN, SMY_PARAMETROS

### Community 59 - "SMY_REGISTROS_ADMIN_MED"
Cohesion: 0.67
Nodes (3): IDX_SMY_RAM_PRES_FEC, IDX_SMY_RAM_RES_FEC, SMY_REGISTROS_ADMIN_MED

### Community 60 - "IDX_SMY_TR_RES"
Cohesion: 0.67
Nodes (3): IDX_SMY_TR_RES, IDX_SMY_TR_TAREA, SMY_TAREA_RESIDENTES

### Community 61 - "SMY_USUARIOS"
Cohesion: 0.67
Nodes (3): IDX_SMY_USUARIOS_ROL, IDX_SMY_USUARIOS_TIPO, SMY_USUARIOS

## Knowledge Gaps
- **252 isolated node(s):** `ResidentMedication`, `AuthStackParamList`, `RootStackParamList`, `HomeScreenProps`, `IncidentReportModalProps` (+247 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 433 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **123 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `lucide-react` connect `useApp` to `AppContext.tsx`, `taskFormatters.ts`, `RoleDropdownSelector.tsx`, `TaskItem`, `package.json`, `api.ts`, `IncidentReportScreen.tsx`, `ClinicalHistorySection.tsx`, `components/ConsentsScreen.tsx`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Why does `typescript` connect `package.json` to `mobile/package.json`, `backend/package.json`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Why does `oracledb` connect `archivos.service.ts` to `auth.repository.ts`, `tareas.controller.ts`, `notificaciones.controller.ts`, `backend/package.json`, `app.ts`, `maestras.routes.ts`, `ResidentesController`, `consentimientos.controller.ts`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **What connects `ResidentMedication`, `AuthStackParamList`, `RootStackParamList` to the rest of the system?**
  _252 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useAuthStore` be split into smaller, more focused modules?**
  _Cohesion score 0.07552159858947988 - nodes in this community are weakly interconnected._
- **Should `useApp` be split into smaller, more focused modules?**
  _Cohesion score 0.10218579234972677 - nodes in this community are weakly interconnected._
- **Should `AppContext.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10808080808080808 - nodes in this community are weakly interconnected._