# PhotoBooth — **user_stories.md**
Historias + criterios de aceptación alineados a la maqueta.

## Epic 1 — Attract & Engagement
**US-1.1 Tap-to-Start**  
Como *Guest*, quiero tocar en la pantalla de atracción para iniciar.  
**AC:** tap navega a *LayoutSelection* < 500ms; si no hay interacción por `timeout`, vuelve a *Attract*.

**US-1.2 Timeout por pantalla**  
Como *Admin*, quiero configurar tiempo de inactividad por pantalla.  
**AC:** mapa de timeouts en app; al expirar regresa a *Attract*.

**US-1.3 Gesto oculto + PIN**  
Como *Admin*, quiero abrir configuración con gesto oculto seguido de PIN.  
**AC:** 5 taps en esquina → modal PIN; 3 intentos fallidos → cooldown 60s.

## Epic 2 — Layout Selection
**US-2.1 Seleccionar layout con precio y shots**  
Como *Guest*, quiero ver opciones de layout con precio y cantidad de tomas para elegir.  
**AC:** grid de cards (habilitados/deshabilitados), botón **Confirm Layout**; accesible (≥44pt).

## Epic 3 — Photo Capture (RN CLI, sin Expo)
**US-3.1 Preview + Countdown + Capture**  
Como *Guest*, quiero ver previa de cámara, cuenta regresiva (3..1) y capturar.  
**AC:** VisionCamera operativa; permisos OK; al capturar → `POST /captures` y registro en `photos`.

**US-3.2 Retake (última)**  
Como *Guest*, quiero repetir solo la última toma hasta `maxRetakes`.  
**AC:** muestra contador; guarda solo la última como activa.

**US-3.3 Modo de cámara (front/rear/dslr)**  
Como *Staff*, quiero alternar cámara frontal, trasera y DSLR externa.  
**AC:** al elegir *dslr* y no disponible → aviso + deshabilitado; si disponible → preview/capture por `DslrBridge`.

## Epic 4 — Templates & Filters
**US-4.1 Aplicar plantilla (overlay PNG)**  
Como *Guest*, quiero aplicar un template (marco o overlay) sobre mi foto.  
**AC:** lista de templates desde backend; preview <300ms; se guarda referencia de template.

**US-4.2 Filtros básicos**  
Como *Guest*, quiero aplicar filtro (B/N, cálido, frío).  
**AC:** filtros togglables; preview fluida; se persiste elección.

## Epic 5 — Product Selection & Delivery
**US-5.1 Elegir Print/Digital**  
Como *Guest*, quiero elegir copias impresas (stepper) y/o entrega digital.  
**AC:** si `printer!=ok` se oculta Print. Totales actualizados en vivo.

**US-5.2 Canales Digitales (email/sms/qr/airdrop)**  
Como *Guest*, quiero recibir mi foto por correo, SMS, QR o AirDrop.  
**AC:** validaciones de email/phone; QR inmediato; se crean entregas y estados.

**US-5.3 Digital incluido con Print**  
Como *Guest*, si imprimo, quiero recibir también versión digital sin costo.  
**AC:** al seleccionar Print, se exige contacto y se crea entrega digital asociada.

## Epic 6 — Payment & Checkout
**US-6.1 Resumen + Pay Now**  
Como *Guest*, quiero ver subtotal/impuestos/total y pagar.  
**AC:** resumen idéntico a maqueta; botón **Pay Now**; manejo de rechazado con retry/backoff.

**US-6.2 Proveedor de pagos abstracto**  
Como *Staff*, quiero poder cambiar el proveedor de pagos por configuración.  
**AC:** `PaymentsProvider` intercambiable (demo/Stripe/Square).

## Epic 7 — Admin & Telemetry
**US-7.1 Catálogos**  
Como *Admin*, quiero gestionar `layouts/templates` y habilitar/deshabilitar opciones.  
**AC:** endpoints CRUD y flags de disponibilidad.

**US-7.2 Telemetría**  
Como *Admin*, quiero ver métricas básicas (impressions, taps, captures, deliveries, payments).  
**AC:** `POST /events` desde app; agregación en backend.

## Epic 8 — Backend services
**US-8.1 Sesiones**  
Como *Kiosk*, quiero crear sesión para escopar datos.  
**AC:** `POST /sessions` devuelve `session_id` y expiración.

**US-8.2 Entregas**  
Como *Sistema*, quiero encolar entregas digital/print y actualizar estados.  
**AC:** colas con reintentos exponenciales; webhooks de delivered/failed.

**US-8.3 Pagos**  
Como *Sistema*, quiero registrar pagos y cerrar ordenes.  
**AC:** webhooks cambian `orders.status` a `paid`; error → `declined`.

## No funcionales
- A11y y UI responsiva; ≥60 FPS en preview.
- Tiempos de carga < 1s en navegación intra-app.
- Observabilidad básica (logs + event trail).
- Seguridad: rate-limit por dispositivo y CORS restringido.
