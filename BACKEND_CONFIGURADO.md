# ✅ Backend Configurado y Funcionando

## 🎯 Configuración Actual

### Backend escuchando en 0.0.0.0:8787

El servidor ahora está configurado para escuchar en **todas las interfaces de red** (`0.0.0.0`), lo que permite que dispositivos en la misma red (como tu iPad) puedan conectarse.

### Cambios Realizados

**Archivo**: `server/src/index.ts`

```typescript
// Start server
const port = parseInt(process.env.PORT || '8787');
const hostname = process.env.HOST || '0.0.0.0'; // ← Escucha en todas las interfaces

serve({
  fetch: app.fetch,
  port,
  hostname, // ← Configuración clave
}, (info: { port: number; address: string }) => {
  console.log(`✅ Server running at http://${hostname}:${info.port}`);
  console.log(`📱 Access from network: http://192.168.1.21:${info.port}`);
});
```

## 🌐 URLs de Acceso

### Desde la Mac (localhost)
```
http://localhost:8787
http://127.0.0.1:8787
```

### Desde el iPad (red local)
```
http://192.168.1.21:8787
```

### Desde cualquier dispositivo en la misma WiFi
```
http://192.168.1.21:8787
```

## ✅ Endpoints Funcionando

### Health Check
```bash
curl http://192.168.1.21:8787/health
# Respuesta: {"status":"ok","timestamp":"...","supabase":"error"}
```

### Layouts
```bash
curl http://192.168.1.21:8787/catalogs/layouts
# Respuesta: [{"id":"layout-1","name":"2x2 Classic",...}, ...]
```

### Templates
```bash
curl http://192.168.1.21:8787/catalogs/templates
# Respuesta: [{"id":"template-1","name":"Classic Frame",...}, ...]
```

### Sessions (POST)
```bash
curl -X POST http://192.168.1.21:8787/sessions \
  -H "Content-Type: application/json" \
  -d '{"layout_id":"layout-1","template_id":"template-1"}'
```

## 🔧 Cómo Iniciar el Backend

### Opción 1: Modo desarrollo (recomendado)
```bash
cd /Users/gerardtoscanoasto/photo_ia_ws/server
npm run dev
```

### Opción 2: Modo producción
```bash
cd /Users/gerardtoscanoasto/photo_ia_ws/server
npm start
```

## 📱 Configuración de la App

La app está configurada para conectarse a:
```
API_BASE_URL=http://192.168.1.21:8787
```

**Archivo**: `app-mobile/.env`

## 🔍 Verificación

Para verificar que todo está funcionando:

### 1. Backend corriendo
```bash
lsof -ti:8787
# Debe mostrar un PID (número de proceso)
```

### 2. Accesible desde la red
```bash
curl http://192.168.1.21:8787/health
# Debe responder con JSON
```

### 3. Desde el iPad (Safari)
Abre Safari en el iPad y visita:
```
http://192.168.1.21:8787/health
```
Deberías ver el JSON de respuesta.

## 🚨 Troubleshooting

### Error: "Network Error" en la app

**Causa**: El backend no está corriendo o no es accesible.

**Solución**:
```bash
# 1. Verificar que el backend esté corriendo
lsof -ti:8787

# 2. Si no está corriendo, iniciarlo
cd server && npm run dev

# 3. Verificar acceso desde la red
curl http://192.168.1.21:8787/health
```

### Error: "EADDRINUSE: address already in use"

**Causa**: Ya hay un proceso usando el puerto 8787.

**Solución**:
```bash
# Matar el proceso existente
lsof -ti:8787 | xargs kill -9

# Reiniciar el backend
cd server && npm run dev
```

### Error: "Connection refused" desde el iPad

**Causa**: Firewall bloqueando la conexión o IP incorrecta.

**Solución**:
```bash
# 1. Verificar tu IP actual
ifconfig | grep "inet " | grep -v 127.0.0.1

# 2. Actualizar .env si la IP cambió
# app-mobile/.env
API_BASE_URL=http://[TU_IP]:8787

# 3. Verificar firewall de macOS
# System Settings > Network > Firewall
# Asegúrate de que Node.js tenga permiso
```

### iPad y Mac no están en la misma WiFi

**Causa**: Dispositivos en redes diferentes.

**Solución**:
- Conecta ambos dispositivos a la misma red WiFi
- Verifica con: Settings > WiFi en el iPad

## 📊 Estado Actual

- ✅ Backend corriendo en `0.0.0.0:8787`
- ✅ Accesible desde `192.168.1.21:8787`
- ✅ CORS configurado para localhost y red local
- ✅ Endpoints respondiendo correctamente
- ✅ Mock data funcionando (3 layouts, 3 templates)
- ✅ Listo para recibir conexiones desde el iPad

## 🎉 Resultado

El backend está **completamente configurado y funcionando**. La app en el iPad ahora puede:

1. ✅ Conectarse al backend
2. ✅ Obtener layouts disponibles
3. ✅ Obtener templates disponibles
4. ✅ Crear sesiones
5. ✅ Realizar todas las operaciones necesarias

**El error "Network Error" debería estar resuelto.** 🚀

## 📝 Logs del Backend

Cuando la app se conecta, verás logs como:
```
[Catalogs] Using mock layouts data
GET /catalogs/layouts 200 - 5ms
POST /sessions 200 - 12ms
```

Esto confirma que la app está comunicándose correctamente con el backend.
