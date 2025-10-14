# ✅ Todo Listo para Ejecutar en iPad

## Estado Actual

✅ Backend corriendo en `http://192.168.1.21:8787`
✅ Frontend configurado con todas las dependencias
✅ Pods de iOS instalados correctamente
✅ Archivo `.env` configurado con tu IP

## Pasos para Ejecutar en iPad

### 1. Conectar iPad

```bash
# Conecta tu iPad con cable USB
# Asegúrate de que esté desbloqueado
```

### 2. Verificar que Xcode detecta tu iPad

```bash
xcrun xctrace list devices
```

Deberías ver tu iPad en la lista.

### 3. Opción A: Ejecutar desde Terminal (Recomendado)

```bash
cd /Users/gerardtoscanoasto/photo_ia_ws/app-mobile

# Lista los dispositivos disponibles
npx react-native run-ios --list-devices

# Ejecuta en tu iPad (reemplaza con el nombre exacto de tu iPad)
npx react-native run-ios --device "iPad de Gerard"

# O simplemente:
npx react-native run-ios --device
```

### 3. Opción B: Ejecutar desde Xcode

```bash
cd /Users/gerardtoscanoasto/photo_ia_ws/app-mobile

# Abrir el workspace en Xcode
open ios/PhotoBooth.xcworkspace
```

En Xcode:
1. Selecciona tu iPad en la lista de dispositivos (arriba a la izquierda)
2. Ve a Signing & Capabilities
3. Selecciona tu equipo de desarrollo (Team)
4. Presiona Cmd+R o el botón ▶️ Run

### 4. Primera Vez - Confiar en el Certificado

La primera vez que ejecutes la app en tu iPad:

1. En el iPad, ve a: **Settings > General > VPN & Device Management**
2. Busca tu certificado de desarrollador
3. Toca "Trust [Tu Nombre]"
4. Confirma

### 5. Verificar Conexión al Backend

Una vez que la app esté corriendo:

1. Toca "TAP TO START" en la pantalla Attract
2. Deberías ver la pantalla de Layout Selection
3. Deberían cargar 3 layouts desde el backend

Si no carga:
- Verifica que el backend esté corriendo: `curl http://localhost:8787/health`
- Verifica que iPad y Mac estén en la misma WiFi
- Abre Safari en el iPad y visita: `http://192.168.1.21:8787/health`

## Comandos Útiles

### Ver logs del backend
```bash
# El backend ya está corriendo, pero si necesitas reiniciarlo:
cd /Users/gerardtoscanoasto/photo_ia_ws/server
npm run dev
```

### Ver logs de Metro Bundler
```bash
# En otra terminal
cd /Users/gerardtoscanoasto/photo_ia_ws/app-mobile
npm start
```

### Limpiar cache si hay problemas
```bash
cd /Users/gerardtoscanoasto/photo_ia_ws/app-mobile

# Limpiar cache de Metro
npm start -- --reset-cache

# Limpiar build de iOS
cd ios
rm -rf build
xcodebuild clean
cd ..
```

## Troubleshooting

### Error: "No devices found"
```bash
# Asegúrate de que el iPad esté conectado y desbloqueado
# Confía en la computadora si el iPad lo pide
xcrun xctrace list devices
```

### Error: "Code signing error"
- Abre el proyecto en Xcode
- Ve a Signing & Capabilities
- Selecciona tu Apple ID en Team
- Cambia el Bundle Identifier si es necesario (ej: com.tunombre.photobooth)

### Error: "Unable to connect to backend"
```bash
# Verifica la IP en el .env
cat /Users/gerardtoscanoasto/photo_ia_ws/app-mobile/.env

# Debería mostrar: API_BASE_URL=http://192.168.1.21:8787

# Prueba desde el iPad en Safari:
# http://192.168.1.21:8787/health
```

### Error: "Metro bundler not connecting"
```bash
# Asegúrate de que Metro esté corriendo
cd /Users/gerardtoscanoasto/photo_ia_ws/app-mobile
npm start

# Si ya está corriendo, reinicia con cache limpio
npm start -- --reset-cache
```

## Flujo de Prueba

Una vez que la app esté corriendo en el iPad:

1. **Attract Screen**: Toca "TAP TO START"
2. **Layout Screen**: Selecciona un layout (2x2, 3-Strip, o Single)
3. **Capture Screen**: Verás placeholder (cámara en Fase 2)
4. **Customize Screen**: Verás placeholder (templates en Fase 2)
5. **Product Screen**: Verás placeholder (selección en Fase 2)
6. **Checkout Screen**: Toca "Pay Now" para volver a Attract

### Probar Idle Timer
- En cualquier pantalla, espera sin tocar
- Después del timeout configurado, debería volver a Attract

### Probar Settings
- En Attract, toca 5 veces rápido en la esquina superior izquierda
- Debería abrir Settings
- PIN por defecto: `1234`

## 🎉 ¡Listo!

Tu app PhotoBooth está lista para ejecutarse en el iPad.

**Backend**: `http://192.168.1.21:8787` ✅
**Frontend**: Configurado y listo ✅
**Pods iOS**: Instalados ✅

Ejecuta: `npx react-native run-ios --device` desde `app-mobile/`
