# PhotoBooth MVP - Setup & Testing Checklist

Use this checklist to verify your setup and test the implementation.

## 📋 Initial Setup

### 1. Prerequisites
- [ ] Node.js >= 18 installed (`node -v`)
- [ ] Supabase account created
- [ ] Xcode installed (for iOS development)
- [ ] Android Studio installed (for Android development)
- [ ] CocoaPods installed (for iOS): `sudo gem install cocoapods`

### 2. Supabase Configuration
- [ ] Create new Supabase project at https://supabase.com
- [ ] Copy project URL and keys from Settings > API
- [ ] Go to SQL Editor in Supabase dashboard
- [ ] Run `ops/supabase/migrations/0001_base.sql`
- [ ] Run `ops/supabase/migrations/0002_seed_data.sql`
- [ ] Go to Storage section
- [ ] Create bucket: `photos/raw` (private)
- [ ] Create bucket: `photos/exports` (private)
- [ ] Verify tables exist in Table Editor

### 3. Backend Setup
- [ ] `cd server`
- [ ] `npm install`
- [ ] `cp .env.example .env`
- [ ] Edit `.env` with Supabase credentials:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_KEY`
  - [ ] `SUPABASE_ANON_KEY`
- [ ] `npm run dev`
- [ ] Verify server starts on port 8787
- [ ] Test health endpoint: `curl http://localhost:8787/health`
- [ ] Should return: `{"status":"ok","supabase":"connected"}`

### 4. Mobile App Setup
- [ ] `cd app-mobile`
- [ ] `npm install`
- [ ] `cp .env.example .env`
- [ ] Edit `.env` with API URL: `API_BASE_URL=http://localhost:8787`
- [ ] (iOS only) `npm run pod-install`
- [ ] Add camera permissions to `ios/PhotoBooth/Info.plist`:
  ```xml
  <key>NSCameraUsageDescription</key>
  <string>We need camera access to take photos</string>
  ```
- [ ] Add camera permissions to `android/app/src/main/AndroidManifest.xml`:
  ```xml
  <uses-permission android:name="android.permission.CAMERA" />
  ```

## 🧪 Testing Phase 1 (Current Implementation)

### Backend Tests
- [ ] Health check returns OK
- [ ] `curl http://localhost:8787/catalogs/layouts` returns 4 layouts
- [ ] `curl http://localhost:8787/catalogs/templates` returns 8 templates
- [ ] `curl -X POST http://localhost:8787/sessions -H "Content-Type: application/json" -d '{}'` creates session
- [ ] Session ID is returned in format `session_TIMESTAMP_RANDOM`

### Mobile App Tests (iOS)
- [ ] `npm run ios` builds successfully
- [ ] App launches in simulator
- [ ] **Attract Screen**:
  - [ ] "TAP TO START" button pulses
  - [ ] Tapping button navigates to Layout screen
  - [ ] 5 taps on top-left corner opens Settings
- [ ] **Layout Screen**:
  - [ ] 4 layout cards display (2x2, 3-strip, single, 4-strip)
  - [ ] Selecting a layout highlights it
  - [ ] "Confirm Layout" button is disabled until selection
  - [ ] "Confirm Layout" navigates to Capture screen
  - [ ] After 45 seconds of inactivity, returns to Attract
- [ ] **Capture Screen**:
  - [ ] Shows placeholder text
  - [ ] "Continue (Mock)" button navigates to Customize
  - [ ] "Back" button returns to Layout
- [ ] **Customize Screen**:
  - [ ] Shows placeholder text
  - [ ] "Continue (Mock)" button navigates to Product
- [ ] **Product Screen**:
  - [ ] Shows placeholder text
  - [ ] "Continue (Mock)" button navigates to Checkout
- [ ] **Checkout Screen**:
  - [ ] Shows placeholder text
  - [ ] "Pay Now (Mock)" shows alert and returns to Attract
- [ ] **Settings Screen**:
  - [ ] PIN input accepts 4 digits
  - [ ] Entering "1234" shows success alert
  - [ ] Wrong PIN shows error with remaining attempts
  - [ ] 3 wrong attempts locks for 60 seconds
  - [ ] "Close" button returns to Attract

### Mobile App Tests (Android)
- [ ] `npm run android` builds successfully
- [ ] Repeat all iOS tests above on Android emulator/device

## 🔍 Verification Checklist

### Code Quality
- [ ] No TypeScript errors in `server/` (except missing node types - expected)
- [ ] No TypeScript errors in `app-mobile/`
- [ ] All imports resolve correctly
- [ ] No console errors in Metro bundler

### Functionality
- [ ] Backend connects to Supabase successfully
- [ ] Mobile app connects to backend API
- [ ] Session creation works end-to-end
- [ ] Layout catalog loads from backend
- [ ] Navigation flows through all screens
- [ ] Idle timers work on each screen
- [ ] Settings PIN protection works

### User Experience
- [ ] All buttons are >= 44pt (easy to tap)
- [ ] Animations are smooth (pulse on Attract)
- [ ] Text is readable (good contrast)
- [ ] Navigation is intuitive
- [ ] No crashes or freezes

## 🚀 Next Phase Preparation

### For FE-E3 (Camera Integration)
- [ ] Verify camera permissions are added
- [ ] Test camera access on physical device
- [ ] Review `react-native-vision-camera` documentation

### For BE-2 (Additional Endpoints)
- [ ] Verify Supabase storage buckets are created
- [ ] Test file upload to Supabase storage manually
- [ ] Review payment provider documentation (if using Stripe/Square)

## 📝 Notes

**Common Issues:**
- If Metro bundler fails: `npm start -- --reset-cache`
- If iOS build fails: `cd ios && pod install && cd ..`
- If Android build fails: `cd android && ./gradlew clean && cd ..`
- If backend can't connect to Supabase: Check `.env` credentials
- If mobile can't connect to backend: Check `API_BASE_URL` in `.env`

**Performance:**
- Backend should respond in < 100ms for catalog endpoints
- Screen transitions should be smooth (< 300ms)
- Idle timers should trigger at configured intervals

**Security:**
- Never commit `.env` files
- Change default PIN from "1234" before production
- Review RLS policies before production deployment

## ✅ Sign-off

- [ ] All setup steps completed
- [ ] All backend tests pass
- [ ] All mobile tests pass (iOS)
- [ ] All mobile tests pass (Android)
- [ ] Code quality verified
- [ ] Ready for Phase 2 (FE-E3)

**Date Completed:** _______________  
**Tested By:** _______________  
**Notes:** _______________
