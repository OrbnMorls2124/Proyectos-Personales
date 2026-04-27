#!/bin/bash
# Script de instalación rápida para Linux/macOS

echo ""
echo "==================================="
echo "Sistema de Facturación e Inventario"
echo "==================================="
echo ""

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 no está instalado"
    echo "Por favor instala Python 3.9 o superior"
    exit 1
fi

echo "[1/5] Creando entorno virtual..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate

echo "[2/5] Instalando dependencias..."
pip install -r requirements.txt

echo "[3/5] Configurando archivo .env..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Archivo .env creado. Por favor actualiza los valores si es necesario."
else
    echo "Archivo .env ya existe."
fi

echo "[4/5] Ejecutando migraciones..."
python manage.py migrate

echo "[5/5] Creando datos de ejemplo..."
python manage.py load_sample_data

echo ""
echo "==================================="
echo "¡Instalación completada!"
echo "==================================="
echo ""
echo "Para iniciar el servidor, ejecuta:"
echo "  python manage.py runserver"
echo ""
echo "Credenciales de prueba:"
echo "  Email: admin@example.com"
echo "  Password: admin123456"
echo ""
echo "URLs útiles:"
echo "  http://localhost:8000/admin/       (Panel Admin)"
echo "  http://localhost:8000/api/docs/    (Documentación API)"
echo ""
