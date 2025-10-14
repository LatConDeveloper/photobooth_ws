# Configuración para iPad Real

## Pasos para ejecutar en iPad

### 1. Backend - Configurar y Lanzar

```bash
cd server

# Crear archivo .env con esta configuración:
cat > .env << 'EOF'
PORT=8787
NODE_ENV=development

# Supabase - Temporal (puedes dejarlo así por ahora)
SUPABASE_URL=https://placeholder.supabase.co
SUPABASE_SERVICE_KEY=placeholder-key
SUPABASE_ANON_KEY=placeholder-key

# Payments
PAYMENTS_PROVIDER=demo

# CORS - Permite conexiones desde red local
ALLOWED_ORIGINS=http://localhost:*,http://192.168.*:*,http://172.*:*,http://10.*:*
EOF

# Lanzar el backend
npm run dev
```

El backend estará corriendo en `http://localhost:8787`

### 2. Obtener la IP de tu Mac

En otra terminal, ejecuta:

```bash
# macOS
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Busca tu IP local (ejemplo: `192.168.1.100` o `10.0.0.5`)

### 3. Frontend - Actualizar Dependencias

```bash
cd app-mobile

# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Eliminar pods y reinstalar
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### 4. Crear archivo .env para Frontend

```bash
# Desde app-mobile/, crea el archivo .env
# IMPORTANTE: Reemplaza 192.168.1.100 con la IP de tu Mac

cat > .env << 'EOF'
API_BASE_URL=http://192.168.1.100:8787
SCREEN_TIMEOUTS={"Attract":30,"Layout":45,"Capture":60,"Customize":60,"Product":120,"Checkout":180}
PAYMENTS_PROVIDER=demo
MAX_RETAKES=2
EOF
```

### 5. Configurar Info.plist para iPad

Necesitas agregar permisos de cámara. Crea el archivo si no existe:

```bash
# Desde app-mobile/
mkdir -p ios/PhotoBooth

# Si el archivo Info.plist no existe, créalo con este contenido mínimo
```

Agrega estas líneas al `ios/PhotoBooth/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>Necesitamos acceso a la cámara para tomar fotos</string>
<key>NSMicrophoneUsageDescription</key>
<string>Necesitamos acceso al micrófono para funciones de video</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Necesitamos acceso a la galería para guardar fotos</string>
```

### 6. Conectar iPad y Ejecutar

```bash
# Conecta tu iPad con cable USB
# Asegúrate de que esté en modo desarrollador

# Verifica que Xcode detecta tu iPad
xcrun xctrace list devices

# Ejecutar en iPad
npx react-native run-ios --device "nombre-de-tu-ipad"

# O abre Xcode y selecciona tu iPad como destino
open ios/PhotoBooth.xcworkspace
```

### 7. Verificar Conexión

Una vez que la app esté corriendo en el iPad:

1. Ve a la pantalla Attract
2. Toca "TAP TO START"
3. Deberías ver los layouts cargándose desde el backend

Si hay error de conexión:
- Verifica que el backend esté corriendo (`curl http://localhost:8787/health`)
- Verifica que el iPad y Mac estén en la misma red WiFi
- Verifica que la IP en `.env` sea correcta
- Verifica que no haya firewall bloqueando el puerto 8787

## Troubleshooting

### Error: "Unable to connect to backend"
```bash
# En tu Mac, verifica que el backend responde:
curl http://localhost:8787/health

# Desde el iPad (usando Safari), intenta abrir:
http://TU_IP_MAC:8787/health
```

### Error: "Pod install failed"
```bash
cd ios
pod deintegrate
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Error: "Build failed in Xcode"
- Limpia el build: Product > Clean Build Folder (Cmd+Shift+K)
- Cierra Xcode
- Elimina DerivedData: `rm -rf ~/Library/Developer/Xcode/DerivedData`
- Vuelve a abrir y compilar

### Metro Bundler no se conecta
```bash
# Reinicia Metro con cache limpio
npm start -- --reset-cache
```

## Comandos Rápidos

```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Metro Bundler
cd app-mobile && npm start

# Terminal 3: Instalar en iPad
cd app-mobile && npx react-native run-ios --device "iPad"
```

## Notas Importantes

1. **Red WiFi**: iPad y Mac deben estar en la misma red
2. **Firewall**: Asegúrate de que macOS permite conexiones al puerto 8787
3. **Certificados**: Necesitas una cuenta de desarrollador Apple (puede ser gratuita)
4. **Trust Device**: La primera vez, el iPad te pedirá confiar en el certificado
5. **Hot Reload**: Funciona en red local, pero puede ser más lento que en simulador
