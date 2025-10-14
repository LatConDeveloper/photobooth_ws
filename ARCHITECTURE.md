# PhotoBooth MVP - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     PhotoBooth Kiosk                        │
│                   (React Native CLI)                        │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Attract  │→ │  Layout  │→ │ Capture  │→ │Customize │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                             │
│  ┌──────────┐  ┌──────────┐                                │
│  │ Product  │→ │ Checkout │→ Return to Attract             │
│  └──────────┘  └──────────┘                                │
│                                                             │
│  State: Zustand │ API: Axios │ Nav: React Navigation       │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    Hono Backend (Node/Bun)                  │
│                                                             │
│  Routes:                                                    │
│  ├─ GET  /health                                           │
│  ├─ POST /sessions                                         │
│  ├─ GET  /catalogs/layouts                                 │
│  ├─ GET  /catalogs/templates                               │
│  ├─ POST /captures          [BE-2]                         │
│  ├─ POST /orders            [BE-2]                         │
│  ├─ POST /payments/intent   [BE-2]                         │
│  ├─ POST /deliveries/*      [BE-2]                         │
│  ├─ POST /print-jobs        [BE-2]                         │
│  └─ POST /events            [BE-3]                         │
│                                                             │
│  Services:                                                  │
│  ├─ Payment Providers (demo/stripe/square)                 │
│  ├─ Queue (in-memory → Redis)                              │
│  └─ Storage (Supabase)                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                      Supabase                               │
│                                                             │
│  PostgreSQL:                                                │
│  ├─ sessions        ├─ orders         ├─ deliveries        │
│  ├─ layouts         ├─ order_items    ├─ print_jobs        │
│  ├─ templates       ├─ payments       ├─ events            │
│  └─ photos                                                  │
│                                                             │
│  Storage Buckets:                                           │
│  ├─ photos/raw      (original captures)                    │
│  └─ photos/exports  (processed with templates)             │
│                                                             │
│  Auth: (future)                                             │
│  RLS: Row-level security by session_id                     │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Session Creation
```
Mobile App                Backend              Supabase
    │                        │                     │
    ├─ POST /sessions ──────→│                     │
    │                        ├─ INSERT sessions ──→│
    │                        │←─ session_id ───────┤
    │←─ {session_id} ────────┤                     │
    │                        │                     │
```

### 2. Layout Selection
```
Mobile App                Backend              Supabase
    │                        │                     │
    ├─ GET /catalogs/layouts→│                     │
    │                        ├─ SELECT layouts ───→│
    │                        │←─ layouts[] ────────┤
    │←─ layouts[] ───────────┤                     │
    │                        │                     │
    │ [User selects layout]  │                     │
    │ Store in Zustand       │                     │
```

### 3. Photo Capture (FE-E3)
```
Mobile App                Backend              Supabase
    │                        │                     │
    │ [VisionCamera]         │                     │
    │ capture() → photo.jpg  │                     │
    │                        │                     │
    ├─ POST /captures ───────→│                     │
    │   (multipart/form-data)│                     │
    │                        ├─ Upload to storage ─→│
    │                        │←─ photo_url ────────┤
    │                        ├─ INSERT photos ─────→│
    │                        │←─ photo_id ─────────┤
    │←─ {photo_id, url} ─────┤                     │
```

### 4. Order & Payment (FE-E6 + BE-2)
```
Mobile App                Backend              Supabase         Payment Provider
    │                        │                     │                    │
    ├─ POST /orders ─────────→│                     │                    │
    │                        ├─ INSERT orders ─────→│                    │
    │                        │←─ order_id ─────────┤                    │
    │←─ {order_id} ──────────┤                     │                    │
    │                        │                     │                    │
    ├─ POST /payments/intent →│                     │                    │
    │                        ├─ createIntent() ────────────────────────→│
    │                        │←─ {clientSecret} ──────────────────────┤
    │                        ├─ INSERT payments ───→│                    │
    │←─ {clientSecret} ──────┤                     │                    │
    │                        │                     │                    │
    │ [User completes payment]                     │                    │
    │                        │                     │                    │
    │                        │←─ Webhook ─────────────────────────────┤
    │                        ├─ UPDATE orders ─────→│                    │
    │                        ├─ Enqueue delivery ──→│                    │
```

### 5. Digital Delivery (BE-2)
```
Backend Queue Worker      Supabase         External Service
    │                        │                    │
    ├─ Dequeue delivery ─────→│                    │
    │←─ delivery job ─────────┤                    │
    │                        │                    │
    ├─ Send email/SMS ──────────────────────────→│
    │←─ Success ─────────────────────────────────┤
    │                        │                    │
    ├─ UPDATE deliveries ────→│                    │
    │   status='delivered'   │                    │
```

## Component Architecture

### Mobile App (React Native)

```
App.tsx
  └─ RootNavigator
      ├─ AttractScreen
      │   ├─ useIdleTimer (30s)
      │   ├─ api.createSession()
      │   └─ navigation.navigate('Layout')
      │
      ├─ LayoutScreen
      │   ├─ useIdleTimer (45s)
      │   ├─ api.getLayouts()
      │   ├─ useStore (selectedLayout)
      │   └─ navigation.navigate('Capture')
      │
      ├─ CaptureScreen [FE-E3]
      │   ├─ useIdleTimer (60s)
      │   ├─ VisionCamera
      │   ├─ Countdown (3-2-1)
      │   ├─ api.uploadPhoto()
      │   └─ navigation.navigate('Customize')
      │
      ├─ CustomizeScreen [FE-E5]
      │   ├─ useIdleTimer (60s)
      │   ├─ api.getTemplates()
      │   ├─ Template overlay
      │   ├─ Filter selection
      │   └─ navigation.navigate('Product')
      │
      ├─ ProductScreen [FE-E6]
      │   ├─ useIdleTimer (120s)
      │   ├─ Print/Digital selection
      │   ├─ Quantity stepper
      │   └─ navigation.navigate('Checkout')
      │
      ├─ CheckoutScreen [FE-E6]
      │   ├─ useIdleTimer (180s)
      │   ├─ Order summary
      │   ├─ api.createPaymentIntent()
      │   └─ navigation.navigate('Attract')
      │
      └─ SettingsScreen
          ├─ PIN input
          ├─ 3-attempt lockout
          └─ Admin configuration
```

### Backend (Hono)

```
index.ts
  ├─ CORS middleware
  ├─ Logger middleware
  │
  ├─ /health
  │   └─ health.ts
  │       └─ Check Supabase connection
  │
  ├─ /sessions
  │   └─ sessions.ts
  │       ├─ POST / → Create session
  │       └─ GET /:id → Get session
  │
  ├─ /catalogs
  │   └─ catalogs.ts
  │       ├─ GET /layouts → List layouts
  │       └─ GET /templates → List templates
  │
  ├─ /captures [BE-2]
  │   └─ captures.ts
  │       └─ POST / → Upload photo
  │
  ├─ /orders [BE-2]
  │   └─ orders.ts
  │       └─ POST / → Create order
  │
  ├─ /payments [BE-2]
  │   └─ payments.ts
  │       ├─ POST /intent → Create payment
  │       └─ POST /webhook → Handle webhook
  │
  ├─ /deliveries [BE-2]
  │   └─ deliveries.ts
  │       ├─ POST /email
  │       ├─ POST /sms
  │       ├─ POST /qr
  │       └─ POST /airdrop
  │
  ├─ /print-jobs [BE-2]
  │   └─ print-jobs.ts
  │       └─ POST / → Queue print job
  │
  └─ /events [BE-3]
      └─ events.ts
          └─ POST / → Log telemetry
```

### Libraries & Services

```
lib/
  ├─ db.ts
  │   ├─ supabase (service role)
  │   └─ supabaseAnon (anon key)
  │
  ├─ storage.ts
  │   ├─ uploadFile()
  │   ├─ getSignedUrl()
  │   └─ deleteFile()
  │
  ├─ queue.ts
  │   ├─ enqueue()
  │   ├─ dequeue()
  │   ├─ complete()
  │   └─ fail()
  │
  └─ payments/
      ├─ provider.ts (interface)
      ├─ demo.ts (mock)
      ├─ stripe.ts (stub)
      └─ square.ts (stub)
```

## Database Schema

```sql
sessions
  ├─ id (PK)
  ├─ device_id
  ├─ status
  ├─ metadata
  ├─ created_at
  └─ expires_at

layouts
  ├─ id (PK)
  ├─ name
  ├─ shots
  ├─ price
  └─ enabled

templates
  ├─ id (PK)
  ├─ name
  ├─ category
  ├─ overlay_url
  └─ enabled

photos
  ├─ id (PK)
  ├─ session_id (FK)
  ├─ layout_id (FK)
  ├─ template_id (FK)
  ├─ raw_url
  └─ processed_url

orders
  ├─ id (PK)
  ├─ session_id (FK)
  ├─ status
  ├─ subtotal
  ├─ tax
  └─ total

order_items
  ├─ id (PK)
  ├─ order_id (FK)
  ├─ photo_id (FK)
  ├─ type (digital/print)
  ├─ quantity
  └─ total_price

deliveries
  ├─ id (PK)
  ├─ order_id (FK)
  ├─ type (email/sms/qr/airdrop)
  ├─ recipient
  └─ status

print_jobs
  ├─ id (PK)
  ├─ order_id (FK)
  ├─ photo_id (FK)
  ├─ copies
  └─ status

payments
  ├─ id (PK)
  ├─ order_id (FK)
  ├─ provider
  ├─ intent_id
  └─ status

events
  ├─ id (PK)
  ├─ session_id (FK)
  ├─ event_type
  ├─ event_name
  └─ properties
```

## Security Model

### Authentication
- **Current**: Session-based (session_id)
- **Future**: Supabase Auth with JWT

### Authorization
- **RLS Policies**: Row-level security by session_id
- **Service Role**: Backend uses service key (bypasses RLS)
- **Anon Key**: Client uses anon key (respects RLS)

### API Security
- **CORS**: Restricted origins
- **Rate Limiting**: [BE-3] By device_id
- **Input Validation**: Zod schemas
- **SQL Injection**: Prevented by Supabase client

## Deployment Architecture (Future)

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Setup                         │
│                                                             │
│  Kiosk Device (iPad/Android Tablet)                        │
│  ├─ PhotoBooth App (React Native)                          │
│  ├─ Local Storage (photos cache)                           │
│  └─ Network: WiFi/Ethernet                                 │
│                                                             │
│  Backend Server (VPS/Cloud)                                │
│  ├─ Hono API (PM2/Docker)                                  │
│  ├─ Redis (queue)                                          │
│  └─ Print Bridge (optional service)                        │
│                                                             │
│  Supabase (Cloud)                                          │
│  ├─ PostgreSQL (managed)                                   │
│  ├─ Storage (S3-compatible)                                │
│  └─ Auth (JWT)                                             │
│                                                             │
│  External Services                                         │
│  ├─ Stripe/Square (payments)                               │
│  ├─ SendGrid (email)                                       │
│  ├─ Twilio (SMS)                                           │
│  └─ Printer (USB/Network)                                  │
└─────────────────────────────────────────────────────────────┘
```

## Technology Choices

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Mobile Framework | React Native CLI | Native modules (DSLR), no Expo limitations |
| Backend Framework | Hono | Lightweight, fast, modern, TypeScript-first |
| Database | Supabase (PostgreSQL) | Managed, RLS, Storage, Auth built-in |
| State Management | Zustand | Simple, less boilerplate than Redux |
| API Client | Axios | Mature, interceptors, TypeScript support |
| Validation | Zod | Runtime type checking, TypeScript integration |
| Navigation | React Navigation | Industry standard, native stack |
| Camera | VisionCamera | Modern, performant, frame processors |
| Payments | Abstracted | Swap providers easily (demo/stripe/square) |
| Queue | In-memory → Redis | Start simple, scale later |

## Performance Targets

- **API Response**: < 100ms (catalog endpoints)
- **Screen Transition**: < 300ms
- **Camera Preview**: 60 FPS
- **Photo Upload**: < 2s (5MB photo)
- **Idle Timeout**: Configurable per screen
- **Touch Target**: ≥ 44pt (accessibility)

## Scalability Considerations

- **Horizontal Scaling**: Stateless backend, load balancer ready
- **Queue**: Upgrade to Redis for distributed processing
- **Storage**: Supabase Storage scales automatically
- **Database**: PostgreSQL connection pooling
- **CDN**: Serve processed photos via CDN (future)
- **Caching**: Redis for catalog data (future)
