#!/bin/bash

# Script para ejecutar PhotoBooth en iPad

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}📱 PhotoBooth - Ejecutar en iPad${NC}"
echo "===================================="
echo ""

# Verificar que el backend esté corriendo
echo -e "${YELLOW}1. Verificando backend...${NC}"
if curl -s http://localhost:8787/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend corriendo en http://192.168.1.21:8787${NC}"
else
    echo -e "${YELLOW}⚠️  Backend no responde. Iniciándolo...${NC}"
    cd server
    npm run dev &
    sleep 3
    cd ..
    echo -e "${GREEN}✓ Backend iniciado${NC}"
fi

echo ""
echo -e "${YELLOW}2. Dispositivos iOS disponibles:${NC}"
xcrun xctrace list devices 2>&1 | grep -i ipad | head -5

echo ""
echo -e "${YELLOW}3. Ejecutando en iPad...${NC}"
cd app-mobile

# Detectar el iPad físico
IPAD_NAME=$(xcrun xctrace list devices 2>&1 | grep -i ipad | grep -v Simulator | head -1 | sed 's/ (.*//')

if [ -z "$IPAD_NAME" ]; then
    echo -e "${YELLOW}⚠️  No se detectó iPad físico. Usando simulador...${NC}"
    npx react-native run-ios --simulator "iPad (10th generation)"
else
    echo -e "${GREEN}✓ iPad detectado: ${IPAD_NAME}${NC}"
    echo ""
    echo -e "${BLUE}Ejecutando en: ${IPAD_NAME}${NC}"
    echo ""
    npx react-native run-ios --device "$IPAD_NAME"
fi
