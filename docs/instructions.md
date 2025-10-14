# PhotoBooth — **instructions.md**
> Stack y reglas para el agente (Windsurf/Copilot) y para el equipo

## 1) Objetivo del MVP
Implementar el flujo mostrado en la maqueta (Attract → Layout → Capture → Template/Filters → Product Selection → Payment & Checkout) con:
- **Frontend:** React Native **CLI** (sin Expo). Cámara con **react-native-vision-camera** y soporte **cámara externa/DSLR** vía módulo nativo.
- **Backend:** **Hono** (Node/Bun) + **Supabase** (Auth, Postgres, Storage, RLS).
- **Pagos:** capa abstracta (Stripe/Square). Iniciar con modo “demo $0.01”.
- **Entregas:** Digital (email/sms/qr/airdrop) y Print (en cola). Si no hay impresora, **ocultar** Print y continuar Digital-only.

## 2) Decisiones de arquitectura
- **No Expo**. RN CLI puro para habilitar módulos nativos (cámara externa).
- **Cámara**: `react-native-vision-camera` + `react-native-reanimated` + `react-native-gesture-handler`.  
  Modo `CameraMode = 'front'|'rear'|'dslr'`. En `dslr`, invocar **NativeModule** (UVC/HDMI/Tether). Si no hay hardware, fallback: guía + deshabilitado.
- **Backend Hono** con rutas REST delgadas y colas de trabajo para entregas e impresión.
- **Supabase**:
  - Buckets: `photos/raw`, `photos/exports`.
  - RLS: acceso por `session_id` y rol kiosk.
  - **Service Role** solo en backend.
- **Payments**: interfaz `PaymentsProvider` y adaptadores (`StripeProvider`, `SquareProvider`). Selección por env var.
- **Impresión**: `print-bridge` opcional como servicio aparte (LAN/daemon) que observa cola y envía a driver/WCM.
- **Telemetría**: endpoint `POST /events` y logger en FE.

## 3) Estructura de repos
```
/app-mobile/            # React Native CLI (TypeScript)
  app/                  # screens, components, hooks, navigation
  native/               # módulos nativos (dslr bridge)
  ios/, android/
  package.json, tsconfig.json

/server/                # Hono + Supabase SDK
  src/
    routes/
      health.ts
      sessions.ts
      captures.ts
      catalogs.ts      # layouts/templates
      deliveries.ts    # email/sms/qr/airdrop
      print-jobs.ts
      payments.ts
      events.ts
    lib/
      db.ts            # supabase (service key)
      storage.ts
      queue.ts         # redis/supabase-queue
      payments/
        provider.ts
        stripe.ts
        square.ts
    index.ts
  .env.example
  package.json

/ops/
  supabase/
    migrations/        # SQL reproducibles
  docker/              # opcional (server/bridge)
README.md
```

## 4) Variables de entorno (resumen)
**server/.env**
```
PORT=8787
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
SUPABASE_ANON_KEY=
PAYMENTS_PROVIDER=stripe|square|demo
STRIPE_SECRET=
SQUARE_ACCESS_TOKEN=
QUEUE_URL=redis://...
ALLOWED_ORIGINS=https://kiosk.local,https://*
```

**app-mobile/.env**
```
API_BASE_URL=http://localhost:8787
SCREEN_TIMEOUTS='{"Attract":30,"Layout":45,"Capture":60,"Customize":60,"Product":120,"Checkout":180}'
PAYMENTS_PROVIDER=stripe|square|demo
```

## 5) Setup rápido

### 5.1 React Native (sin Expo)
```bash
npx react-native@latest init PhotoBooth --template react-native-template-typescript
cd PhotoBooth
yarn add react-native-vision-camera react-native-reanimated react-native-gesture-handler \
          react-native-permissions @react-navigation/native @react-navigation/native-stack
npx pod-install
```
- iOS: habilitar `NSCameraUsageDescription` y permisos.
- Android: permisos `CAMERA`, `WRITE_EXTERNAL_STORAGE` si export.

**Módulo nativo `DslrBridge`** (esqueleto):
- iOS: capturar de UVC/HDMI (si disponible) o exponer tether (stub).
- Android: soporte UVC con Camera2 si aplica (stub si no).
- Debe exponer: `isAvailable()`, `startPreview(viewTag)`, `capture()`, `stop()`.

### 5.2 Hono + Supabase
```bash
mkdir -p server && cd server
npm init -y
npm i hono @supabase/supabase-js zod undici
npm i -D typescript tsx @types/node
npx tsc --init
```
**index.ts (bootstrap)**:
```ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
const app = new Hono()
app.use('*', cors({ origin: (o) => (o?.includes('localhost') ? o : 'https://*') }))
app.get('/health', c => c.text('ok'))
export default app
```
Ejecutar con `tsx src/index.ts` o `bun run dev` (si usas Bun).

### 5.3 SQL inicial (Supabase)
Tablas mínimas: `sessions`, `photos`, `orders`, `order_items`, `templates`, `layouts`, `deliveries`, `payments`, `print_jobs`.  
- Claves: `session_id` (scoped), `photo_id` (UUID), `order_id` (UUID).  
- RLS: permitir `select/insert` si `auth.uid()` corresponde a `session.user_id` o si header kiosk válido.

## 6) Contratos de API (MVP)
- `POST /sessions` → `{ session_id }`
- `GET /catalogs/layouts` → lista de layouts con `price`, `shots`, `enabled`
- `GET /catalogs/templates` → overlays/filtros disponibles
- `POST /captures` → guarda foto en `photos/raw` (URL firmada de descarga)
- `POST /orders` → crea borrador; items `digital|print`
- `POST /payments/intent` → `{clientSecret|checkoutUrl}`
- `POST /deliveries/email|sms|qr|airdrop`
- `POST /print-jobs`
- `POST /events`

## 7) Reglas de UX críticas
- Todo botón táctil ≥ 44pt; enfoque visible; textos legibles.
- Si impresora **no** disponible → ocultar “Print Copies” (continúa Digital-only).
- `Retake` solo de la **última** captura; configurable `maxRetakes`.
- “Digital included with Print”: si elige Print, solicitar contacto y encolar Digital.

## 8) Estándares de código
- TypeScript estricto, ESLint + Prettier.
- Commits convencionales (`feat:`, `fix:`…). PR con checklist de accesibilidad.
- Tests: unit (Zod, helpers) + e2e frontend Smoke con Detox o Maestro (básico).

## 9) Done Definition (MVP)
- Flujo completo navegable offline-online.
- Captura estable en VisionCamera, cuenta regresiva y subida.
- Plantilla/overlay aplicada y preview fluida.
- Selección de productos con totales correctos.
- Pago demo funcionando y transición de `order → paid` por webhook simulado.
- Entrega digital encolada; impresión encolada (puede ser stub) con estados.
- Logs y telemetría mínimos.
