# Sistema de Facturación e Inventario

Sistema profesional, escalable y listo para producción para pequeñas y medianas empresas (PyMEs).

## Características

✅ **Autenticación JWT** - Seguridad con tokens JWT y roles por usuario
✅ **CRUD Completo** - Gestión de productos, clientes, facturas e inventario
✅ **Control de Inventario** - Entradas, salidas, ajustes y alertas de stock bajo
✅ **Facturación** - Emisión, seguimiento de pagos y estados de facturas
✅ **Reportes Avanzados** - Ventas diarias, semanales, mensuales y por producto
✅ **API REST** - Endpoints bien documentados con Swagger/OpenAPI
✅ **PDF** - Generación automática de facturas en PDF
✅ **Excel** - Exportación de reportes a Excel
✅ **Admin Django** - Panel de administración completo
✅ **Código Limpio** - Arquitectura modular y buenas prácticas SOLID

## Requisitos Previos

- Python 3.9+
- PostgreSQL 12+
- pip (gestor de paquetes de Python)
- Git

## Instalación

### 1. Clonar o Descargar el Proyecto

```bash
cd billing_system
```

### 2. Crear Entorno Virtual

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar Dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus datos
# Importante: Cambiar SECRET_KEY, contraseña de BD, etc.
```

### 5. Configurar Base de Datos

```bash
# Asegúrate de que PostgreSQL está ejecutándose
# Crear la base de datos
psql -U postgres -c "CREATE DATABASE billing_system_db;"

# Ejecutar migraciones
python manage.py migrate
```

### 6. Crear Usuario Administrador

```bash
python manage.py createsuperuser
# Seguir las instrucciones para crear usuario admin
```

### 7. Cargar Datos de Ejemplo (Opcional)

```bash
python manage.py loaddata sample_data
```

### 8. Ejecutar el Servidor

```bash
python manage.py runserver
```

Visita:
- API: http://localhost:8000/api/docs/
- Admin: http://localhost:8000/admin/
- ReDoc: http://localhost:8000/api/redoc/

## Estructura del Proyecto

```
billing_system/
├── apps/
│   ├── users/              # Gestión de usuarios y autenticación
│   ├── products/           # Productos y categorías
│   ├── customers/          # Clientes
│   ├── inventory/          # Control de inventario
│   ├── billing/            # Facturas y pagos
│   └── reports/            # Reportes y análisis
├── config/                 # Configuración de Django
├── static/                 # Archivos estáticos (CSS, JS)
├── templates/              # Plantillas HTML
├── media/                  # Archivos subidos
├── manage.py               # Gestor de Django
├── requirements.txt        # Dependencias
└── .env                    # Variables de entorno (NO SUBIR A GIT)
```

## Endpoints principales de la API

### Autenticación

```
POST   /api/v1/auth/login/           - Obtener token JWT
POST   /api/v1/auth/refresh/         - Refrescar token
POST   /api/v1/auth/users/register/  - Registro de nuevo usuario
```

### Usuarios

```
GET    /api/v1/auth/users/           - Listar usuarios
POST   /api/v1/auth/users/           - Crear usuario
GET    /api/v1/auth/users/{id}/      - Detalle de usuario
PUT    /api/v1/auth/users/{id}/      - Actualizar usuario
DELETE /api/v1/auth/users/{id}/      - Eliminar usuario
GET    /api/v1/auth/users/me/        - Mi perfil
POST   /api/v1/auth/users/change_password/  - Cambiar contraseña
```

### Productos

```
GET    /api/v1/products/products/            - Listar productos
POST   /api/v1/products/products/            - Crear producto
GET    /api/v1/products/products/{id}/       - Detalle producto
PUT    /api/v1/products/products/{id}/       - Actualizar producto
DELETE /api/v1/products/products/{id}/       - Eliminar producto
GET    /api/v1/products/products/low_stock/  - Productos con stock bajo
GET    /api/v1/products/products/out_of_stock/ - Productos sin stock
```

### Clientes

```
GET    /api/v1/customers/customers/          - Listar clientes
POST   /api/v1/customers/customers/          - Crear cliente
GET    /api/v1/customers/customers/{id}/     - Detalle cliente
PUT    /api/v1/customers/customers/{id}/     - Actualizar cliente
DELETE /api/v1/customers/customers/{id}/     - Eliminar cliente
GET    /api/v1/customers/customers/active_customers/  - Clientes activos
GET    /api/v1/customers/customers/{id}/invoices/     - Facturas del cliente
```

### Facturas

```
GET    /api/v1/billing/invoices/             - Listar facturas
POST   /api/v1/billing/invoices/             - Crear factura
GET    /api/v1/billing/invoices/{id}/        - Detalle factura
PUT    /api/v1/billing/invoices/{id}/        - Actualizar factura
GET    /api/v1/billing/invoices/pending/     - Facturas pendientes
GET    /api/v1/billing/invoices/overdue/     - Facturas vencidas
GET    /api/v1/billing/invoices/paid/        - Facturas pagadas
POST   /api/v1/billing/invoices/{id}/record_payment/ - Registrar pago
POST   /api/v1/billing/invoices/{id}/cancel/ - Cancelar factura
```

### Inventario

```
GET    /api/v1/inventory/movements/          - Listar movimientos
POST   /api/v1/inventory/movements/          - Crear movimiento
GET    /api/v1/inventory/alerts/             - Listar alertas
GET    /api/v1/inventory/alerts/active/      - Alertas activas
```

### Reportes

```
GET    /api/v1/reports/sales/daily_sales/     - Ventas de hoy
GET    /api/v1/reports/sales/weekly_sales/    - Ventas de la semana
GET    /api/v1/reports/sales/monthly_sales/   - Ventas del mes
GET    /api/v1/reports/sales/summary/         - Resumen general
GET    /api/v1/reports/products/top_sold/     - Productos más vendidos
GET    /api/v1/reports/products/top_revenue/  - Productos más rentables
```

## Guía de Uso

### 1. Registrar un Usuario

```bash
curl -X POST http://localhost:8000/api/v1/auth/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "SecurePassword123!",
    "password_confirm": "SecurePassword123!",
    "first_name": "Juan",
    "last_name": "Pérez"
  }'
```

### 2. Login y Obtener Token

```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "SecurePassword123!"
  }'
```

### 3. Crear un Producto

```bash
curl -X POST http://localhost:8000/api/v1/products/products/ \
  -H "Authorization: Bearer TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "sku": "LAP-001",
    "description": "Laptop de 15 pulgadas",
    "category": 1,
    "purchase_price": "500.00",
    "sale_price": "799.99",
    "stock": 50,
    "minimum_stock": 10
  }'
```

### 4. Crear una Factura

```bash
curl -X POST http://localhost:8000/api/v1/billing/invoices/ \
  -H "Authorization: Bearer TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": 1,
    "due_date": "2024-05-15",
    "tax_rate": 19,
    "payment_method": "transfer",
    "invoice_items": [
      {
        "product": 1,
        "quantity": 2,
        "unit_price": "799.99",
        "discount_percent": 0
      }
    ]
  }'
```

## Roles y Permisos

### Administrador
- Crear/editar/eliminar usuarios
- Crear/editar/eliminar productos
- Ver todos los reportes
- Acceso completo al sistema

### Empleado
- Ver productos
- Crear facturas
- Ver facturas propias
- Registrar movimientos de inventario
- Ver reportes básicos

## Deployment en Producción

### 1. Configurar Producción

```bash
# Cambiar DEBUG
DEBUG=False

# Generar nueva SECRET_KEY
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Usar PostgreSQL en remoto
DB_HOST=tu-servidor-postgres.com
```

### 2. Ejecutar Coleccta de Estáticos

```bash
python manage.py collectstatic --noinput
```

### 3. Usar Gunicorn

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

### 4. Usar con Nginx/Apache

Configurar proxy inverso hacia http://localhost:8000

## Documentación de API

Visita: http://localhost:8000/api/docs/

La documentación interactiva con Swagger permite probar todos los endpoints.

## Testing

```bash
# Ejecutar todas las pruebas
python manage.py test

# Ejecutar pruebas de una app específica
python manage.py test apps.users

# Con cobertura
coverage run --source='.' manage.py test
coverage report
```

## Troubleshooting

### Error de conexión a PostgreSQL
```bash
# Verificar que PostgreSQL está ejecutándose
psql -U postgres -l
```

### Error de migración
```bash
# Hacer reset de migraciones (solo desarrollo)
python manage.py migrate apps.nombre zero
python manage.py migrate
```

### Limpiar cache
```bash
python manage.py clear_cache
```

## Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el repositorio
2. Crear una rama para tu feature
3. Commit cambios
4. Push a la rama
5. Abrir Pull Request

## Licencia

MIT License - Ver LICENSE.txt

## Soporte

Para soporte, envía un email a support@billing-system.com o abre un issue en GitHub.

## Changelog

### v1.0.0 (2024-04-24)
- Lanzamiento inicial del sistema
- Autenticación JWT completa
- CRUD de productos, clientes, facturas
- Control de inventario
- Reportes básicos
- Generación de PDFs
