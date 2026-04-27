# Guía de Instalación Completa - Sistema de Facturación e Inventario

## Requisitos Previos

### Para Windows

1. **Python 3.9+**
   - Descargar desde: https://www.python.org/downloads/
   - Durante la instalación: **MARCAR "Add Python to PATH"**
   - Versión recomendada: Python 3.11 o 3.12

2. **PostgreSQL 12+**
   - Descargar desde: https://www.postgresql.org/download/windows/
   - Durante la instalación:
     - Usuario: `postgres`
     - Contraseña: Recordar la contraseña
     - Puerto: `5432` (por defecto)
   - Asegurarse de que PostgreSQL está ejecutándose

3. **Git** (Opcional pero recomendado)
   - Descargar desde: https://git-scm.com/download/win

4. **Visual Studio Code** (Editor recomendado)
   - Descargar desde: https://code.visualstudio.com/

### Verificar instalación

Abre PowerShell y ejecuta:

```powershell
# Verificar Python
python --version

# Verificar PostgreSQL
psql --version

# Verificar conexión a PostgreSQL
psql -U postgres
```

---

## Paso 1: Descargar el Proyecto

### Opción A: Usando Git

```powershell
git clone https://github.com/tu-usuario/billing_system.git
cd billing_system
```

### Opción B: Descargar ZIP

1. Descargar el ZIP desde el repositorio
2. Extraer en una carpeta (ej: `C:\Proyectos\billing_system`)
3. Abrir PowerShell en esa carpeta

---

## Paso 2: Crear Base de Datos

1. Abre PowerShell como Administrador

2. Conectar a PostgreSQL:
   ```powershell
   psql -U postgres
   ```

3. Crear la base de datos:
   ```sql
   CREATE DATABASE billing_system_db;
   \q
   ```

---

## Paso 3: Configurar Entorno Virtual

En PowerShell, en la carpeta del proyecto:

```powershell
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# (Se ejecutará automáticamente cada vez que abras PowerShell en la carpeta)
venv\Scripts\activate

# Deberías ver: (venv) al inicio de la línea
```

---

## Paso 4: Instalar Dependencias

Con el entorno virtual activado:

```powershell
# Actualizar pip
python -m pip install --upgrade pip

# Instalar requirements
pip install -r requirements.txt

# Esto tomará 2-3 minutos
```

---

## Paso 5: Configurar Variables de Entorno

1. Copiar archivo de ejemplo:
   ```powershell
   copy .env.example .env
   ```

2. Abrir `.env` con VS Code o Notepad

3. Actualizar los valores (especialmente):
   ```
   DEBUG=True
   SECRET_KEY=django-insecure-tu-clave-secreta
   
   DB_NAME=billing_system_db
   DB_USER=postgres
   DB_PASSWORD=tu-contraseña-postgre  # La contraseña que pusiste en PostgreSQL
   DB_HOST=localhost
   DB_PORT=5432
   ```

---

## Paso 6: Ejecutar Migraciones

Con el entorno virtual activado:

```powershell
# Ejecutar migraciones
python manage.py migrate

# Deberías ver algo como:
# Running migrations:
# ...
# OK
```

---

## Paso 7: Crear Usuario Administrador

```powershell
python manage.py createsuperuser
```

Sigue las instrucciones:
- Email: `admin@example.com`
- First name: `Administrador`
- Last name: `Sistema`
- Password: Una contraseña segura
- Repeat password: Confirmar

---

## Paso 8: Cargar Datos de Ejemplo (Opcional pero Recomendado)

```powershell
python manage.py load_sample_data

# Verás:
# ✓ Usuario admin creado
# ✓ Usuario empleado creado
# ✓ Categoría "Electrónica" creada
# ... etc
```

---

## Paso 9: Ejecutar el Servidor

```powershell
python manage.py runserver

# Verás algo como:
# Starting development server at http://127.0.0.1:8000/
# Quit the server with CONTROL-C.
```

---

## Paso 10: Acceder a la Aplicación

Abre tu navegador (Chrome, Firefox, Edge) y visita:

### Interfaz de Admin
- **URL:** http://localhost:8000/admin/
- **Usuario:** admin@example.com
- **Contraseña:** La que creaste en el paso 7

### Documentación de API (Swagger)
- **URL:** http://localhost:8000/api/docs/
- Aquí puedes probar todos los endpoints

### Documentación ReDoc
- **URL:** http://localhost:8000/api/redoc/
- Otra vista de la documentación

---

## Solución de Problemas

### Problema: "ModuleNotFoundError: No module named 'django'"

**Solución:** 
- Asegúrate de que el entorno virtual está activado
- Verifica con: `where python` - debe mostrar `venv\Scripts\python`

### Problema: "Connection refused" a PostgreSQL

**Solución:**
- Verifica que PostgreSQL está ejecutándose
- En Services (Servicios), busca "PostgreSQL"
- Si no está ejecutándose, inicia el servicio

### Problema: "FATAL: Ident authentication failed"

**Solución:**
- Asegúrate de usar la contraseña correcta de PostgreSQL
- Verifica en `.env` que `DB_PASSWORD` es correcto

### Problema: Port 8000 already in use

**Solución:**
```powershell
# Ejecutar en puerto diferente
python manage.py runserver 8001
```

### Problema: Permiso denegado en Windows

**Solución:**
- Ejecuta PowerShell como Administrador
- O usa Git Bash en lugar de PowerShell

---

## Próximos Pasos

### 1. Explorar la API

```powershell
# Registrar usuario
curl -X POST http://localhost:8000/api/v1/auth/users/register/ `
  -H "Content-Type: application/json" `
  -d '{"email":"usuario@example.com","password":"Password123!","password_confirm":"Password123!","first_name":"Juan","last_name":"Perez"}'
```

### 2. Leer la documentación

- [README.md](README.md) - Descripción general
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Documentación de API
- [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) - Para poner en producción

### 3. Probar con Postman (Opcional)

1. Descargar Postman desde https://www.postman.com/downloads/
2. Importar colección de API
3. Configurar variables de entorno
4. Comenzar a probar endpoints

---

## Estructura del Proyecto

```
billing_system/
├── apps/                    # Aplicaciones Django
│   ├── users/              # Usuarios y autenticación
│   ├── products/           # Productos
│   ├── customers/          # Clientes
│   ├── inventory/          # Inventario
│   ├── billing/            # Facturas
│   └── reports/            # Reportes
├── config/                 # Configuración
├── static/                 # CSS, JavaScript (no necesita)
├── templates/              # HTML (no necesita para API)
├── media/                  # Archivos subidos
├── manage.py               # Comando de Django
├── requirements.txt        # Dependencias
├── .env                    # Variables de entorno
└── README.md               # Este archivo
```

---

## Comandos Útiles

```powershell
# Activar entorno virtual (siempre primero)
venv\Scripts\activate

# Desactivar entorno virtual
deactivate

# Ejecutar servidor de desarrollo
python manage.py runserver

# Ejecutar servidor en puerto específico
python manage.py runserver 8001

# Ejecutar tests
python manage.py test

# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Ver estado de migraciones
python manage.py showmigrations

# Abrir consola interactiva Django
python manage.py shell

# Crear superusuario
python manage.py createsuperuser

# Limpiar caché
python manage.py clear_cache

# Recopilar archivos estáticos
python manage.py collectstatic

# Cargar datos de ejemplo
python manage.py load_sample_data

# Buscar en la base de datos
python manage.py dbshell
```

---

## Cambiar Contraseña de Usuario

```powershell
python manage.py changepassword admin

# Solicita la nueva contraseña
```

---

## Exportar/Importar Datos

```powershell
# Exportar datos
python manage.py dumpdata > backup.json

# Importar datos
python manage.py loaddata backup.json
```

---

## Development vs Production

### En Desarrollo (Ahora)
- `DEBUG = True`
- Base de datos: SQLite o PostgreSQL local
- Archivos estáticos: Servidos automáticamente
- Sin HTTPS

### En Producción (Después)
- `DEBUG = False`
- Base de datos: PostgreSQL remoto
- Archivos estáticos: CDN o Nginx
- Con HTTPS/SSL
- Usar Gunicorn + Nginx

Ver [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) para detalles.

---

## Soporte

- **Documentación:** Ver archivos markdown incluidos
- **Email:** support@billing-system.com
- **Issues:** Reportar en GitHub

---

¡Ahora está lista tu instalación! 🎉

Dirígete a http://localhost:8000/api/docs/ y comienza a usar la API.
