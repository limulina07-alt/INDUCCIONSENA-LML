# Plan de Sincronización Automática con Google Sheets y Google Drive

Sincronización en tiempo real de los datos de caracterización, avance formativo y resultados evaluativos de los aprendices SENA hacia una hoja de cálculo estructurada y alojada automáticamente en Google Drive.

## Decisiones Críticas y Confirmaciones del Usuario

> [!IMPORTANT]
> Se han incorporado las preferencias confirmadas por el usuario para la integración con Google Workspace:
> - **Método de Autorización**: Conexión directa mediante Google OAuth institucional con scopes específicos (`spreadsheets` y `drive.file`).
> - **Frecuencia de Sincronización**: En tiempo real a medida que el aprendiz se registra, avanza en módulos, firma el acta y culmina la evaluación interactiva.
> - **Estructura de la Hoja**: Documento con 3 pestañas especializadas: `Caracterización de Aprendices`, `Avance en Módulos` y `Evaluaciones y Certificación`.

- **Decisión Confirmada 1**: Uso del flujo de OAuth oficial de Google con almacenamiento seguro de tokens en memoria para conectar la cuenta institucional del instructor o coordinador.
- **Decisión Confirmada 2**: Creación automática del archivo "SENA - Registro y Seguimiento de Inducción FPI 2026" en la unidad de Google Drive del usuario si aún no existe, o vinculación directa a una hoja existente.
- **Decisión Confirmada 3**: Mecanismo de reintento automático y cola local persistente (Offline Sync Queue) para garantizar que ningún dato de aprendiz se pierda si hay desconexión temporal de internet.

---

## 1. Visión General y Concepto Central

- **Qué hace**: Permite al instructor o coordinador institucional conectar su cuenta de Google mediante un botón oficial "Conectar con Google Drive". La aplicación crea o vincula automáticamente una hoja de cálculo en Google Sheets y, conforme los aprendices completan su caracterización en la página de inicio o avanzan en el aplicativo, cada evento actualiza la hoja en la nube al instante.
- **Audiencia Objetivo**: Instructores líderes de ficha, coordinadores académicos y aprendices SENA en proceso de inducción integral.
- **Valor Agregado**: Elimina la descarga y consolidación manual de archivos CSV, proporcionando una base de datos centralizada, colaborativa y auditable en la nube institucional de Google Drive.

---

## 2. Experiencia de Usuario y Diseño Visual

### Flujos Principales
1. **Flujo de Conexión del Instructor**:
   - En el panel de control del instructor (`CohortOverview`), se añade un bloque prominente de "Sincronización Google Drive / Sheets".
   - Muestra el estado actual: `Desconectado`, `Conectando...`, `Conectado y Sincronizado`.
   - Incluye el botón oficial de Google Sign-in y un enlace directo para "Abrir Hoja de Cálculo en Google Drive" (`target="_blank"`).
   - Indicador del último evento sincronizado con marca de tiempo y contador de filas enviadas.

2. **Flujo de Registro y Avance del Aprendiz**:
   - El aprendiz completa el formulario de caracterización en la página de bienvenida -> La fila se crea en la pestaña `Caracterización de Aprendices` con datos de contacto, ficha y situación socioeconómica.
   - El aprendiz avanza en los módulos formativos -> Se actualiza el progreso porcentual y la columna de módulos en `Avance en Módulos`.
   - El aprendiz aprueba o refuerza la prueba interactiva y firma el acta -> Se registra la nota obtenida, código de certificado, fecha y estado legal en `Evaluaciones y Certificación`.
   - Aparece un sutil indicador no invasivo tipo Toast: *"Sincronizado con Google Drive ✓"*.

### Identidad Visual y Estilo
- **Paleta de Colores Institucional**:
  - Verde SENA oficial (`#39A900`), acentos esmeralda y soporte nativo para Modo Claro y Modo Oscuro con desenfoque suave.
  - Acentos de Google Workspace (Verde Google Sheets `#0F9D58` y Azul Google Drive `#4285F4`) en los botones de enlace externo.
- **Estados Interactivos**:
  - Píldoras de estado animadas (Pulse para "Sincronizando...", Checkmark sólido para "Actualizado").
  - Modal de configuración de sincronización con visualización previa de columnas y opción de "Forzar Sincronización Total".

---

## 3. Decisiones de Producto y Compensaciones Técnicas

- **Decisión: Google OAuth Client-Side + REST APIs vs. Webhook Apps Script**:
  - *Enfoque Seleccionado*: Integración directa con Google Sheets API v4 y Google Drive API v3 utilizando tokens OAuth en memoria facilitados por la infraestructura del entorno.
  - *Por qué*: Mayor robustez, validación en tiempo real de errores, tipado fuerte y capacidad de crear/dar formato a las hojas de cálculo dinámicamente con estilos SENA (encabezados en verde institucional y texto en negrita).
  - *Alternativa descartada*: Google Apps Script intermediario (requiere despliegues externos manuales y URLs públicas complejas de mantener).

- **Decisión: Cola de Sincronización Local (Offline-First Sync Queue)**:
  - *Enfoque Seleccionado*: Los registros se guardan primero en `localStorage` / almacenamiento local y se despachan a la API de Google Sheets en paralelo. Si la petición falla o no hay conexión, se encolan para reintento automático al restablecer la conexión.
  - *Por qué*: Garantiza cero interrupciones en la experiencia de navegación del aprendiz y previene pérdidas de datos si el aprendiz tiene red inestable.

---

## 4. Arquitectura Técnica y Estrategia de Datos

### Diagrama de Componentes y Flujo de Datos

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Portal Inducción SENA                           │
├───────────────────────────────────┬────────────────────────────────────┤
│         Vistas del Aprendiz       │        Panel del Instructor        │
│  ┌─────────────────────────────┐  │  ┌──────────────────────────────┐  │
│  │ Formulario Caracterización  │  │  │ Google Workspace Sync Widget │  │
│  │ Módulos & Evaluación Quiz   │  │  │ Status / Abrir en Drive      │  │
│  └──────────────┬──────────────┘  │  └──────────────┬───────────────┘  │
└─────────────────┼───────────────────────────────────┼──────────────────┘
                  │ Dispara Eventos                   │ Autentica y Vincula
                  ▼                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 Google Sheets Sync Manager (Servicio)                  │
│  ┌───────────────────────┐                 ┌────────────────────────┐  │
│  │ Local Sync Event Queue│ ◄──────────────►│ Google OAuth In-Memory │  │
│  └───────────┬───────────┘                 └───────────┬────────────┘  │
└──────────────┼─────────────────────────────────────────┼───────────────┘
               │ Batch / Realtime Append                 │ Auth Bearer
               ▼                                         ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    Google Workspace Cloud APIs                         │
│  ┌──────────────────────────────┐   ┌───────────────────────────────┐  │
│  │ Google Drive API v3          │   │ Google Sheets API v4          │  │
│  │ (Creación/búsqueda archivo)  │   │ (Pestañas, filas y formato)   │  │
│  └──────────────────────────────┘   └───────────────────────────────┘  │
│                                                                        │
│  Hoja: "SENA - Registro y Seguimiento de Inducción FPI 2026"           │
│  ├── Pestaña 1: [1_Caracterizacion] (ID, Documento, Ficha, Contacto)   │
│  ├── Pestaña 2: [2_Avance_Modulos]  (ID, %, Módulos aprobados)         │
│  └── Pestaña 3: [3_Evaluaciones]    (Nota, Aprobó, Acta, Certificado)  │
└────────────────────────────────────────────────────────────────────────┘
```

### Estructura de Pestañas y Columnas

1. **Pestaña 1: `1_Caracterizacion`**
   - Columnas: `Fecha Registro`, `ID Aprendiz`, `Nombre Completo`, `Tipo Documento`, `Número Documento`, `Correo`, `Teléfono`, `Código Ficha`, `Programa de Formación`, `Centro`, `Regional`, `Situación Laboral`.

2. **Pestaña 2: `2_Avance_Modulos`**
   - Columnas: `Última Actualización`, `ID Aprendiz`, `Nombre`, `Ficha`, `Progreso %`, `Módulos Completados (Total)`, `Identidad`, `Reglamento Derechos`, `Reglamento Deberes`, `Bienestar`, `Ruta Formativa`.

3. **Pestaña 3: `3_Evaluaciones_Certificados`**
   - Columnas: `Fecha Evaluación`, `ID Aprendiz`, `Nombre`, `Ficha`, `Puntaje Obtenido (%)`, `Estado (Aprobado/Requiere Refuerzo)`, `Intentos`, `Acta de Compromiso Firmada`, `Fecha Firma Acta`, `Código Certificado`, `Enlace de Verificación`.

---

## 5. Fases de Ejecución

1. **Fase 1: Configuración de Permisos y OAuth**:
   - Activar la herramienta `set_up_oauth` para los scopes requeridos (`https://www.googleapis.com/auth/spreadsheets`, `https://www.googleapis.com/auth/drive.file`).
   - Crear el módulo cliente de autenticación con Firebase Auth / Google Auth Provider según directrices del entorno.

2. **Fase 2: Servicio de Google Sheets & Drive (`googleSheetsService.ts`)**:
   - Funciones para inicializar la hoja en Google Drive (verificar existencia por nombre o crear con las 3 pestañas y encabezados estilizados con color SENA).
   - Métodos `appendApprenticeRow`, `updateApprenticeProgressRow`, `updateApprenticeQuizResult`.
   - Sistema de cola local en caso de desconexión o fallo de red.

3. **Fase 3: Integración en Interfaz de Usuario**:
   - Componente `GoogleSyncCard` en el panel de control del instructor con botón de conexión, enlace directo al archivo de Google Drive, estado de sincronización y selector de sincronización manual/automática.
   - Despacho transparente desde el formulario de registro (`RoleSelectionLanding.tsx`), el visor de módulos (`ModuleViewer.tsx`), el acta (`CommitmentActModal.tsx`) y la prueba (`InteractiveQuiz.tsx`).

4. **Fase 4: Validación y Pruebas**:
   - Verificación de tipos TypeScript (`lint_applet`) y compilación Vite (`compile_applet`).
   - Prueba de inserción simulada y manejo de errores cuando el token expira o la red se interrumpe.
