# Soluciones Aplicadas - Errores de Compilación

## Error: "No matching constructor for initialization of 'RawProps'"

### Causa
React Native 0.76.5 tiene la Nueva Arquitectura (Fabric) habilitada por defecto, pero react-native-reanimated 3.6.3 no era totalmente compatible con esta versión.

### Soluciones Aplicadas

#### 1. Actualización de react-native-reanimated
```bash
npm install react-native-reanimated@3.8.1
```

#### 2. Deshabilitación de Nueva Arquitectura
Modificamos `ios/Podfile` para deshabilitar Fabric temporalmente:

```ruby
use_react_native!(
  :path => config[:reactNativePath],
  :app_path => "#{Pod::Config.instance.installation_root}/..",
  # Disable New Architecture for compatibility
  :fabric_enabled => false,
  :hermes_enabled => true
)
```

#### 3. Limpieza completa y reinstalación
```bash
cd ios
rm -rf Pods Podfile.lock
rm -rf ~/Library/Developer/Xcode/DerivedData/PhotoBooth-*
pod install
```

## Configuración Final

### package.json
```json
{
  "dependencies": {
    "react": "18.3.1",
    "react-native": "0.76.5",
    "react-native-reanimated": "^3.8.1",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "react-native-safe-area-context": "^4.12.0",
    "react-native-screens": "^4.2.0",
    "react-native-vision-camera": "^4.6.1",
    "react-native-gesture-handler": "^2.20.2",
    "react-native-permissions": "^5.0.0",
    "axios": "^1.6.5",
    "zustand": "^4.4.7"
  }
}
```

### Podfile (Configuración clave)
```ruby
platform :ios, min_ios_version_supported
prepare_react_native_project!

target 'PhotoBooth' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    :app_path => "#{Pod::Config.instance.installation_root}/..",
    :fabric_enabled => false,  # ← CLAVE: Deshabilitar Fabric
    :hermes_enabled => true
  )
  
  # ... resto del archivo
end
```

## Verificación

Después de aplicar estas soluciones:

```bash
cd /Users/gerardtoscanoasto/photo_ia_ws/app-mobile
npx react-native run-ios --device "iPad de Tania layda"
```

## Notas Importantes

### ¿Por qué deshabilitar la Nueva Arquitectura?

- **Nueva Arquitectura (Fabric)**: Es el futuro de React Native, pero aún está en fase de adopción
- **Compatibilidad**: No todas las librerías son 100% compatibles aún
- **Reanimated**: Versiones < 3.10 tienen problemas con Fabric en RN 0.76+
- **Solución temporal**: Deshabilitamos Fabric para garantizar estabilidad en Fase 1

### ¿Cuándo habilitar la Nueva Arquitectura?

En **Fase 2 o 3**, cuando:
1. Actualicemos a react-native-reanimated >= 3.10
2. Verifiquemos que todas las dependencias sean compatibles
3. Tengamos tiempo para probar exhaustivamente

Para habilitar en el futuro:
```ruby
:fabric_enabled => true,  # Cambiar a true
```

## Alternativas Consideradas

### Opción 1: Actualizar React Native a 0.78+ ❌
- Reanimated 3.8.1 requiere RN 0.78+
- Pero RN 0.78 aún no está estable (beta)
- **Descartada**: Demasiado riesgo para MVP

### Opción 2: Downgrade a React Native 0.74 ❌
- RN 0.74 es más estable
- Pero perdemos mejoras de 0.76
- **Descartada**: Preferimos versión más reciente

### Opción 3: Deshabilitar Fabric ✅
- Mantiene RN 0.76.5 (reciente y estable)
- Usa arquitectura legacy (probada)
- Compatible con todas nuestras dependencias
- **Seleccionada**: Balance perfecto para MVP

## Troubleshooting Futuro

### Si aparece el error de nuevo:

1. **Verificar Podfile**:
   ```bash
   cat ios/Podfile | grep fabric_enabled
   # Debe mostrar: :fabric_enabled => false,
   ```

2. **Limpiar completamente**:
   ```bash
   cd ios
   rm -rf Pods Podfile.lock build
   rm -rf ~/Library/Developer/Xcode/DerivedData/PhotoBooth-*
   pod install
   ```

3. **Verificar versión de Reanimated**:
   ```bash
   cat package.json | grep reanimated
   # Debe mostrar: "react-native-reanimated": "^3.8.1"
   ```

4. **En Xcode**:
   - Product > Clean Build Folder (Cmd+Shift+K)
   - Cerrar Xcode completamente
   - Volver a abrir y compilar

### Si necesitas usar Nueva Arquitectura:

```bash
# 1. Actualizar Reanimated
npm install react-native-reanimated@latest

# 2. Modificar Podfile
# Cambiar :fabric_enabled => true

# 3. Reinstalar
cd ios && pod install && cd ..

# 4. Compilar
npx react-native run-ios --device "iPad de Tania layda"
```

## Estado Actual

✅ **Solución aplicada**: Nueva Arquitectura deshabilitada
✅ **Versión Reanimated**: 3.8.1
✅ **Pods instalados**: 71 pods sin errores
✅ **Listo para compilar**: Sí

## Referencias

- [React Native New Architecture](https://reactnative.dev/docs/new-architecture-intro)
- [Reanimated Compatibility](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation)
- [Fabric Migration Guide](https://reactnative.dev/docs/new-architecture-app-intro)
