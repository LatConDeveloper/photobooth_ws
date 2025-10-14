# PhotoBooth Mobile App

React Native CLI app for PhotoBooth kiosk (iOS & Android).

## Prerequisites

- Node.js >= 18
- Xcode (for iOS development)
- Android Studio (for Android development)
- CocoaPods (for iOS): `sudo gem install cocoapods`

## Setup

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Install iOS pods:
```bash
npm run pod-install
# or
cd ios && pod install && cd ..
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your API URL
```

## Running the App

### iOS
```bash
npm run ios
# or for specific simulator
npx react-native run-ios --simulator="iPhone 15 Pro"
```

### Android
```bash
npm run android
# Make sure Android emulator is running or device is connected
```

## Project Structure

```
app/
├── config/          # Environment configuration
├── hooks/           # Custom React hooks (IdleTimer, etc.)
├── navigation/      # React Navigation setup
├── screens/         # Screen components
├── services/        # API client and external services
├── store/           # Zustand state management
└── App.tsx          # Root component
```

## Features Implemented

### ✅ Phase 1 (FE-E1 & FE-E2)
- React Native CLI setup with TypeScript
- Navigation structure (Attract → Layout → Capture → Customize → Product → Checkout)
- Global state management with Zustand
- Idle timer with configurable timeouts per screen
- API client with backend integration
- Layout selection screen with catalog loading
- Settings screen with PIN protection (5-tap hidden gesture)

### 🚧 Coming Next
- **FE-E3**: VisionCamera integration with preview and capture
- **FE-E4**: DslrBridge native module for external cameras
- **FE-E5**: Templates and filters application
- **FE-E6**: Product selection and payment flow

## Configuration

### Screen Timeouts
Edit `.env` to customize idle timeouts (in seconds):
```env
SCREEN_TIMEOUTS={"Attract":30,"Layout":45,"Capture":60,"Customize":60,"Product":120,"Checkout":180}
```

### Admin Settings
- Access via 5 taps on top-left corner of Attract screen
- Default PIN: `1234` (change in `SettingsScreen.tsx`)
- 3 failed attempts = 60s lockout

## Camera Permissions

### iOS (Info.plist)
Add to `ios/PhotoBooth/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to take photos</string>
<key>NSMicrophoneUsageDescription</key>
<string>We need microphone access for video features</string>
```

### Android (AndroidManifest.xml)
Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## Troubleshooting

### Metro bundler issues
```bash
npm start -- --reset-cache
```

### iOS build issues
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Android build issues
```bash
cd android
./gradlew clean
cd ..
```

## Development Notes

- All screens implement idle timeout that returns to Attract
- Navigation gestures are disabled for kiosk mode
- Status bar is hidden for fullscreen experience
- Minimum touch target size: 44pt (accessibility)
