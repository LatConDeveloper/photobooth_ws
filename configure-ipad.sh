#!/bin/bash

# Script de configuración para ejecutar PhotoBooth en iPad

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📱 PhotoBooth - Configuración para iPad${NC}"
echo "=========================================="
echo ""

# Obtener IP local
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
echo -e "${GREEN}✓ IP de tu Mac: ${IP}${NC}"
echo ""

# Configurar backend .env
echo -e "${YELLOW}1. Configurando backend...${NC}"
cd server

if [ ! -f ".env" ]; then
    cat > .env << EOF
PORT=8787
NODE_ENV=development

# Supabase - Temporal
SUPABASE_URL=https://placeholder.supabase.co
SUPABASE_SERVICE_KEY=placeholder-key
SUPABASE_ANON_KEY=placeholder-key

# Payments
PAYMENTS_PROVIDER=demo

# CORS - Permite red local
ALLOWED_ORIGINS=http://localhost:*,http://192.168.*:*,http://172.*:*,http://10.*:*
EOF
    echo -e "${GREEN}✓ Archivo server/.env creado${NC}"
else
    echo -e "${GREEN}✓ Archivo server/.env ya existe${NC}"
fi

cd ..

# Configurar frontend .env
echo ""
echo -e "${YELLOW}2. Configurando frontend...${NC}"
cd app-mobile

cat > .env << EOF
API_BASE_URL=http://${IP}:8787
SCREEN_TIMEOUTS={"Attract":30,"Layout":45,"Capture":60,"Customize":60,"Product":120,"Checkout":180}
PAYMENTS_PROVIDER=demo
MAX_RETAKES=2
EOF
echo -e "${GREEN}✓ Archivo app-mobile/.env creado con IP: ${IP}${NC}"

cd ..

# Resumen
echo ""
echo -e "${GREEN}✅ Configuración completa!${NC}"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Iniciar backend:"
echo "   ${BLUE}cd server && npm run dev${NC}"
echo ""
echo "2. En otra terminal, instalar pods iOS:"
echo "   ${BLUE}cd app-mobile/ios && pod install && cd ..${NC}"
echo ""
echo "3. Conectar iPad con USB y ejecutar:"
echo "   ${BLUE}npx react-native run-ios --device \"iPad\"${NC}"
echo ""
echo "4. O abrir en Xcode:"
echo "   ${BLUE}open ios/PhotoBooth.xcworkspace${NC}"
echo ""
echo "📝 Notas:"
echo "  - iPad y Mac deben estar en la misma red WiFi"
echo "  - Backend estará en: http://${IP}:8787"
echo "  - Verifica firewall si hay problemas de conexión"
echo ""
