# PhotoBooth MVP

Full-stack PhotoBooth kiosk application with React Native CLI (no Expo) and Hono backend.

## 📋 Project Structure

```
/
├── docs/                    # Specifications
│   ├── instructions.md      # Architecture & stack decisions
│   ├── user_stories.md      # User stories & acceptance criteria
│   └── prompt_agente.md     # Execution plan
├── server/                  # Hono backend + Supabase
├── app-mobile/              # React Native CLI app
└── ops/                     # Infrastructure & migrations
    └── supabase/
        └── migrations/
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18
- **Supabase** account and project
- **iOS**: Xcode + CocoaPods
- **Android**: Android Studio + JDK 11+

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

Server runs on `http://localhost:8787`

**Database Setup:**
1. Create Supabase project at https://supabase.com
2. Run migrations from `ops/supabase/migrations/` in SQL Editor
3. Create storage buckets: `photos/raw` and `photos/exports`

See [ops/supabase/README.md](ops/supabase/README.md) for detailed setup.

### 2. Mobile App Setup

```bash
cd app-mobile
npm install
npm run pod-install  # iOS only
cp .env.example .env
# Edit .env with API_BASE_URL

# Run iOS
npm run ios

# Run Android
npm run android
```

See [app-mobile/README.md](app-mobile/README.md) for detailed setup.

## 📱 Features

### ✅ Implemented (Phase 1)

**Backend (BE-1):**
- ✅ Hono server with CORS and health check
- ✅ Supabase client with service role
- ✅ Payment provider abstraction (demo/stripe/square)
- ✅ Simple queue implementation
- ✅ Storage helpers for photo uploads
- ✅ Sessions API (`POST /sessions`, `GET /sessions/:id`)
- ✅ Catalogs API (`GET /catalogs/layouts`, `GET /catalogs/templates`)
- ✅ SQL migrations with base schema
- ✅ Seed data for layouts and templates

**Frontend (FE-E1 & FE-E2):**
- ✅ React Native CLI setup (TypeScript)
- ✅ Navigation structure (6 screens + settings)
- ✅ Global state management (Zustand)
- ✅ Idle timer with configurable timeouts
- ✅ API client with backend integration
- ✅ Attract screen with tap-to-start
- ✅ Layout selection with catalog loading
- ✅ Settings screen with PIN protection
- ✅ Placeholder screens for full flow

### 🚧 Coming Next

**BE-2: Core Endpoints**
- `POST /captures` - Photo upload
- `POST /orders` - Order creation
- `POST /payments/intent` - Payment processing
- `POST /deliveries/*` - Digital delivery (email/sms/qr/airdrop)
- `POST /print-jobs` - Print queue

**FE-E3: Camera Integration**
- VisionCamera setup with preview
- Countdown timer (3-2-1)
- Capture with retakes
- Photo upload to backend

**FE-E4: DSLR Support**
- Native module `DslrBridge` (iOS/Android)
- External camera detection
- Fallback to built-in camera

**FE-E5: Customization**
- Template/overlay application
- Filter selection (B&W, sepia, cool)
- Preview rendering

**FE-E6: Checkout Flow**
- Product selection (print/digital)
- Delivery options
- Payment integration
- Order completion

**BE-3: Hardening**
- Telemetry (`POST /events`)
- Rate limiting
- Enhanced logging

## 🎯 User Flow

```
Attract Screen (tap to start)
    ↓
Layout Selection (choose 2x2, 3-strip, etc.)
    ↓
Capture (take photos with countdown)
    ↓
Customize (apply templates & filters)
    ↓
Product Selection (digital/print, quantity)
    ↓
Checkout (payment & delivery)
    ↓
Return to Attract
```

## 🔧 Configuration

### Backend Environment Variables

```env
PORT=8787
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
SUPABASE_ANON_KEY=your-anon-key
PAYMENTS_PROVIDER=demo  # or stripe, square
```

### Mobile Environment Variables

```env
API_BASE_URL=http://localhost:8787
SCREEN_TIMEOUTS={"Attract":30,"Layout":45,"Capture":60,"Customize":60,"Product":120,"Checkout":180}
PAYMENTS_PROVIDER=demo
MAX_RETAKES=2
```

## 🧪 Testing

### Backend Health Check
```bash
curl http://localhost:8787/health
```

### Mobile Flow Test
1. Start backend: `cd server && npm run dev`
2. Start mobile: `cd app-mobile && npm run ios`
3. Tap "TAP TO START" on Attract screen
4. Navigate through Layout → Capture → Customize → Product → Checkout
5. Verify idle timeout returns to Attract

## 📚 Documentation

- [instructions.md](docs/instructions.md) - Architecture decisions & stack
- [user_stories.md](docs/user_stories.md) - Features & acceptance criteria
- [prompt_agente.md](docs/prompt_agente.md) - Implementation plan
- [server/README.md](server/README.md) - Backend API documentation
- [app-mobile/README.md](app-mobile/README.md) - Mobile app guide

## 🔐 Security Notes

- **RLS Policies**: Currently simplified for MVP, implement proper session validation in production
- **Admin PIN**: Default is `1234`, change in `SettingsScreen.tsx` and use secure storage
- **API Keys**: Never commit `.env` files, use environment-specific configs
- **CORS**: Configure `ALLOWED_ORIGINS` for production domains

## 📝 Development Standards

- **TypeScript**: Strict mode enabled
- **Commits**: Conventional commits (`feat:`, `fix:`, `chore:`)
- **Code Style**: ESLint + Prettier
- **Accessibility**: Minimum 44pt touch targets
- **Performance**: 60 FPS camera preview target

## 🐛 Troubleshooting

### Backend won't start
- Check Supabase credentials in `.env`
- Verify migrations ran successfully
- Check port 8787 is available

### Mobile build fails
- iOS: Run `cd ios && pod install`
- Android: Run `cd android && ./gradlew clean`
- Clear Metro cache: `npm start -- --reset-cache`

### Camera permissions
- iOS: Add `NSCameraUsageDescription` to Info.plist
- Android: Add `CAMERA` permission to AndroidManifest.xml

## 📄 License

MIT

## 👥 Contributors

Built following specifications in `docs/` directory.
