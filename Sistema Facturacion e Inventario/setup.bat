@echo off
REM Script de instalación rápida para Windows

echo.
echo ===================================
echo Sistema de Facturación e Inventario
echo ===================================
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python no está instalado o no está en PATH
    echo Por favor instala Python desde https://www.python.org/
    pause
    exit /b 1
)

echo [1/5] Creando entorno virtual...
if not exist "venv" (
    python -m venv venv
    call venv\Scripts\activate.bat
) else (
    call venv\Scripts\activate.bat
)

echo [2/5] Instalando dependencias...
pip install -r requirements.txt

echo [3/5] Configurando archivo .env...
if not exist ".env" (
    copy .env.example .env
    echo Archivo .env creado. Por favor actualiza los valores si es necesario.
) else (
    echo Archivo .env ya existe.
)

echo [4/5] Ejecutando migraciones...
python manage.py migrate

echo [5/5] Creando datos de ejemplo...
python manage.py load_sample_data

echo.
echo ===================================
echo ¡Instalación completada!
echo ===================================
echo.
echo Para iniciar el servidor, ejecuta:
echo   python manage.py runserver
echo.
echo Credenciales de prueba:
echo   Email: admin@example.com
echo   Password: admin123456
echo.
echo URLs útiles:
echo   http://localhost:8000/admin/       (Panel Admin)
echo   http://localhost:8000/api/docs/    (Documentación API)
echo.

pause
