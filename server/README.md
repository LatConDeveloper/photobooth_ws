# PhotoBooth Server

Backend API for PhotoBooth kiosk built with Hono and Supabase.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. Run migrations (see `/ops/supabase/migrations/`)

4. Start development server:
```bash
npm run dev
```

Server will run on `http://localhost:8787`

## API Endpoints

### Health
- `GET /health` - Health check with Supabase connection status

### Sessions
- `POST /sessions` - Create new kiosk session
- `GET /sessions/:id` - Get session details

### Catalogs
- `GET /catalogs/layouts` - List available photo layouts
- `GET /catalogs/templates` - List available templates/overlays

### Coming Soon
- `POST /captures` - Upload captured photos
- `POST /orders` - Create orders
- `POST /payments/intent` - Create payment intent
- `POST /deliveries/*` - Digital delivery endpoints
- `POST /print-jobs` - Queue print jobs
- `POST /events` - Telemetry events

## Architecture

- **Hono**: Lightweight web framework
- **Supabase**: PostgreSQL database, auth, and storage
- **TypeScript**: Strict type checking
- **Zod**: Runtime validation

## Payment Providers

Configured via `PAYMENTS_PROVIDER` env var:
- `demo` - Mock provider (default)
- `stripe` - Stripe integration (requires `STRIPE_SECRET`)
- `square` - Square integration (requires `SQUARE_ACCESS_TOKEN`)
