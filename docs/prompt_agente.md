# PhotoBooth — **prompt_agente.md**
> Prompt listo para Windsurf/Copilot (modo agente)

**Contexto disponible en workspace:**
- `instructions.md` (reglas de arquitectura, contratos, estructura)
- `user_stories.md` (historias y criterios)
- Objetivo: implementar MVP siguiendo la maqueta, **sin Expo**, con cámara VisionCamera y backend Hono+Supabase.

## Rol del agente
Actúas como *Tech Lead* + *Implementer*. Debes:
1) Leer `instructions.md` y `user_stories.md`.  
2) Proponer un **plan iterativo** (issues/PRs) y ejecutarlo, con commits pequeños.  
3) Asegurar que RN CLI funcione en iOS y Android.  
4) Generar código listo para correr y scripts de setup.

## Plan de ejecución (ordena y ejecuta)
1. **Server BE-1**
   - Scaffold Hono (`/server`), CORS, `/health` y `.env.example`.
   - Cliente Supabase (service key) y rutas: `/catalogs/layouts`, `/catalogs/templates` (mock al inicio).
   - SQL inicial en `/ops/supabase/migrations/0001_base.sql` (tablas mínimas).
2. **App FE-E1 a E6**
   - RN CLI (TS), navegación, screens vacías según flujo. IdleTimer global.
   - Integrar **react-native-vision-camera**. `CaptureScreen` con preview, countdown y `capture()`.
   - `DslrBridge` nativo (stub). API pública: `isAvailable`, `startPreview`, `capture`, `stop`.
   - Templates/Filtros: overlay PNG + filtros básicos (lib nativa o ImageFilterKit).
   - Product Selection: toggles Print/Digital, stepper, totals.
   - Checkout: proveedor de pagos `demo` (aprobado/rechazado aleatorio o monto 0.01).
3. **Server BE-2**
   - Endpoints `POST /captures`, `POST /orders`, `POST /deliveries/*`, `POST /payments/intent`, `POST /print-jobs`, `POST /events`.
   - Colas (Redis o supabase-queue). Webhooks de pago (simulados en demo).
4. **Telemetría y Hardening (BE-3)**
   - `POST /events`, rate-limit por dispositivo, logs.
5. **QA smoke**
   - Script para correr todo localmente y flujo feliz end-to-end.

## Convenciones de entrega
- Usa TypeScript estricto.
- Commits convencionales (`feat:`, `fix:`, `chore:`).
- Cada PR incluye: checklist de A11y, pasos de prueba manual y gif corto (si aplica).

## Comandos sugeridos
```bash
# Backend
cd server && cp .env.example .env && npm run dev
# Mobile (iOS)
cd app-mobile && yarn ios
# Mobile (Android)
cd app-mobile && yarn android
```

## Definition of Done (en cada etapa)
- Compila en iOS/Android (RN CLI) y el servidor responde `/health`.
- Flujo de pantallas navegable: Attract → Checkout.
- Captura con VisionCamera estable; si `dslr` no disponible, fallback claro.
- Si impresora no disponible, Print oculto; Digital operativo.
- Pagos demo funcionales; órdenes cambian de estado.
- Entregas encoladas y estados visibles.
