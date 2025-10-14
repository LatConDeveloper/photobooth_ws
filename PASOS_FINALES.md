# Pasos Finales para Ejecutar en iPad

## ✅ Backend - LISTO

El backend está corriendo correctamente en `http://192.168.1.21:8787`

Puedes verificarlo:
```bash
curl http://localhost:8787/health
curl http://localhost:8787/catalogs/layouts
```

## 📱 Frontend - Necesita Inicialización

El proyecto React Native necesita ser inicializado correctamente. Aquí están las opciones:

### Opción 1: Inicializar proyecto nuevo y copiar código (RECOMENDADO)

```bash
cd /Users/gerardtoscanoasto/photo_ia_ws

# 1. Crear backup del código actual
mv app-mobile app-mobile-backup

# 2. Crear nuevo proyecto React Native CLI
npx @react-native-community/cli@latest init PhotoBooth --version 0.76.5

# 3. Renombrar a app-mobile
mv PhotoBooth app-mobile

# 4. Copiar nuestro código
cp -r app-mobile-backup/app app-mobile/
cp app-mobile-backup/package.json app-mobile/package.json
cp app-mobile-backup/tsconfig.json app-mobile/tsconfig.json
cp app-mobile-backup/babel.config.js app-mobile/babel.config.js
cp app-mobile-backup/.env app-mobile/.env

# 5. Instalar dependencias
cd app-mobile
npm install

# 6. Instalar pods
cd ios && pod install && cd ..

# 7. Ejecutar en iPad
npx react-native run-ios --device "iPad"
```

### Opción 2: Usar Expo (Más Rápido para Pruebas)

Si solo quieres probar rápido en el iPad:

```bash
cd /Users/gerardtoscanoasto/photo_ia_ws

# Crear proyecto Expo
npx create-expo-app@latest photobooth-expo --template blank-typescript

cd photobooth-expo

# Instalar dependencias
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npm install axios zustand
npx expo install expo-camera

# Copiar código (adaptar para Expo)
# Nota: Necesitarás adaptar el código de VisionCamera a expo-camera

# Ejecutar
npx expo start

# Escanear QR con Expo Go en tu iPad
```

### Opción 3: Continuar con el proyecto actual (Más Complejo)

El proyecto actual tiene problemas de inicialización. Necesitarías:

1. Crear manualmente los archivos de configuración iOS/Android
2. Configurar Xcode project
3. Configurar Gradle para Android

Esto es más complejo y no recomendado.

## 📝 Archivos de Configuración Listos

Ya tienes configurados:
- ✅ `server/.env` - Backend configurado
- ✅ `app-mobile/.env` - Frontend con IP: 192.168.1.21
- ✅ Backend corriendo y respondiendo
- ✅ Código de la app en `app-mobile/app/`

## 🎯 Recomendación

**Usa la Opción 1** para mantener React Native CLI sin Expo (como especifica el proyecto).

Los pasos son:
1. Backup del código actual ✓
2. Crear proyecto nuevo con CLI oficial ✓
3. Copiar nuestro código ✓
4. Instalar dependencias ✓
5. Ejecutar en iPad ✓

## 📱 Configuración iPad

Una vez que tengas el proyecto funcionando:

### 1. Conectar iPad
```bash
# Conecta tu iPad con USB
# Verifica que Xcode lo detecta
xcrun xctrace list devices
```

### 2. Configurar permisos en Info.plist

Agrega a `ios/PhotoBooth/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>Necesitamos acceso a la cámara para tomar fotos</string>
<key>NSMicrophoneUsageDescription</key>
<string>Necesitamos acceso al micrófono</string>
```

### 3. Ejecutar en iPad
```bash
# Desde app-mobile/
npx react-native run-ios --device "nombre-de-tu-ipad"

# O abrir en Xcode
open ios/PhotoBooth.xcworkspace
# Selecciona tu iPad como destino y presiona Run (Cmd+R)
```

## 🔧 Troubleshooting

### Si el iPad no se conecta al backend:
```bash
# Verifica que ambos estén en la misma WiFi
# Verifica la IP en .env
cat app-mobile/.env

# Prueba desde Safari en el iPad:
http://192.168.1.21:8787/health
```

### Si hay error de certificado:
- Necesitas una cuenta de desarrollador Apple (puede ser gratuita)
- En Xcode: Signing & Capabilities > Team > Selecciona tu cuenta
- Confía en el certificado en el iPad: Settings > General > Device Management

## 📞 Siguiente Paso

¿Quieres que te ayude con la Opción 1 (reinicializar el proyecto correctamente)?
