# Documentación Completa de la API

## Base URL

```
http://localhost:8000/api/v1/
```

## Autenticación

Todos los endpoints (excepto registro y login) requieren autenticación JWT.

### Headers requeridos

```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

### Obtener Token JWT

**Endpoint:**
```
POST /auth/login/
```

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "tu_contraseña"
}
```

**Respuesta (200 OK):**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "usuario@example.com",
    "full_name": "Juan Pérez",
    "role": "employee"
  }
}
```

### Refrescar Token

**Endpoint:**
```
POST /auth/refresh/
```

**Body:**
```json
{
  "refresh": "token_refresh"
}
```

---

## 1. GESTIÓN DE USUARIOS

### Registrar nuevo usuario

**Endpoint:**
```
POST /auth/users/register/
```

**Autenticación:** No requerida

**Body:**
```json
{
  "email": "nuevo@example.com",
  "password": "SeguraPassword123!",
  "password_confirm": "SeguraPassword123!",
  "first_name": "Juan",
  "last_name": "García"
}
```

**Respuesta (201 Created):**
```json
{
  "id": 5,
  "email": "nuevo@example.com",
  "first_name": "Juan",
  "last_name": "García",
  "full_name": "Juan García",
  "role": "employee",
  "phone": "",
  "address": "",
  "avatar": null,
  "is_active": true,
  "date_joined": "2024-04-24T10:30:00Z",
  "updated_at": "2024-04-24T10:30:00Z"
}
```

### Listar usuarios

**Endpoint:**
```
GET /auth/users/
```

**Parámetros de Query:**
- `page`: Número de página (defecto: 1)

**Respuesta (200 OK):**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "email": "admin@example.com",
      "first_name": "Administrador",
      "last_name": "Sistema",
      "full_name": "Administrador Sistema",
      "role": "admin",
      "phone": "",
      "is_active": true,
      "date_joined": "2024-04-24T08:00:00Z"
    }
  ]
}
```

### Obtener mi perfil

**Endpoint:**
```
GET /auth/users/me/
```

**Respuesta (200 OK):**
```json
{
  "id": 1,
  "email": "admin@example.com",
  "first_name": "Administrador",
  "last_name": "Sistema",
  "full_name": "Administrador Sistema",
  "role": "admin",
  "phone": "3001234567",
  "address": "Calle Principal",
  "avatar": "https://...",
  "is_active": true,
  "date_joined": "2024-04-24T08:00:00Z",
  "updated_at": "2024-04-24T08:00:00Z"
}
```

### Cambiar contraseña

**Endpoint:**
```
POST /auth/users/change_password/
```

**Body:**
```json
{
  "old_password": "contraseña_anterior",
  "new_password": "nuevaPassword123!",
  "new_password_confirm": "nuevaPassword123!"
}
```

**Respuesta (200 OK):**
```json
{
  "detail": "Contraseña actualizada exitosamente"
}
```

---

## 2. GESTIÓN DE PRODUCTOS

### Listar productos

**Endpoint:**
```
GET /products/products/
```

**Parámetros de Query:**
```
?page=1
&category=1
&is_active=true
&search=laptop
&ordering=-sale_price
```

**Respuesta (200 OK):**
```json
{
  "count": 50,
  "results": [
    {
      "id": 1,
      "name": "Laptop HP 15\"",
      "sku": "LAP-HP-001",
      "description": "Laptop HP 15 pulgadas",
      "category": 1,
      "category_name": "Electrónica",
      "purchase_price": "500.00",
      "sale_price": "799.99",
      "stock": 50,
      "minimum_stock": 5,
      "profit_margin": 60.0,
      "stock_status": "En Stock",
      "is_low_stock": false,
      "created_at": "2024-04-24T10:00:00Z",
      "updated_at": "2024-04-24T10:00:00Z"
    }
  ]
}
```

### Crear producto

**Endpoint:**
```
POST /products/products/
```

**Body:**
```json
{
  "name": "Nuevo Producto",
  "sku": "PROD-001",
  "description": "Descripción del producto",
  "category": 1,
  "purchase_price": "100.00",
  "sale_price": "200.00",
  "stock": 50,
  "minimum_stock": 10,
  "weight": "2.5",
  "dimensions": "10x10x5"
}
```

### Productos con stock bajo

**Endpoint:**
```
GET /products/products/low_stock/
```

### Productos sin stock

**Endpoint:**
```
GET /products/products/out_of_stock/
```

### Ajustar stock

**Endpoint:**
```
POST /products/products/{id}/adjust_stock/
```

**Body:**
```json
{
  "stock": 100
}
```

---

## 3. GESTIÓN DE CLIENTES

### Listar clientes

**Endpoint:**
```
GET /customers/customers/
```

**Parámetros de Query:**
```
?page=1
&customer_type=business
&is_active=true
&search=ABC
&ordering=-created_at
```

### Crear cliente

**Endpoint:**
```
POST /customers/customers/
```

**Body:**
```json
{
  "name": "Empresa XYZ",
  "customer_type": "business",
  "id_number": "900123456",
  "email": "contacto@xyz.com",
  "phone": "6015551234",
  "mobile": "3001234567",
  "address": "Calle 5 #100",
  "city": "Bogotá",
  "state": "Cundinamarca",
  "postal_code": "110111",
  "credit_limit": "5000.00",
  "payment_terms": "30 días",
  "contact_person": "Juan García",
  "contact_position": "Gerente"
}
```

### Buscar cliente por cédula

**Endpoint:**
```
GET /customers/customers/search_by_id/?id=900123456
```

### Obtener facturas de cliente

**Endpoint:**
```
GET /customers/customers/{id}/invoices/
```

---

## 4. GESTIÓN DE FACTURAS

### Listar facturas

**Endpoint:**
```
GET /billing/invoices/
```

**Parámetros de Query:**
```
?page=1
&customer=1
&status=issued
&search=INV-2024
&ordering=-invoice_date
```

### Estados disponibles:
- `draft` - Borrador
- `issued` - Emitida
- `paid` - Pagada
- `partially_paid` - Parcialmente pagada
- `cancelled` - Cancelada

### Crear factura

**Endpoint:**
```
POST /billing/invoices/
```

**Body:**
```json
{
  "customer": 1,
  "due_date": "2024-05-24",
  "tax_rate": 19,
  "discount_amount": "0.00",
  "payment_method": "transfer",
  "notes": "Factura de ejemplo",
  "invoice_items": [
    {
      "product": 1,
      "quantity": 2,
      "unit_price": "799.99",
      "discount_percent": 10
    },
    {
      "product": 2,
      "quantity": 5,
      "unit_price": "12.99",
      "discount_percent": 0
    }
  ]
}
```

**Respuesta (201 Created):**
```json
{
  "id": 1,
  "invoice_number": "INV-2024-000001",
  "customer": 1,
  "customer_name": "Empresa ABC",
  "status": "issued",
  "invoice_date": "2024-04-24",
  "due_date": "2024-05-24",
  "subtotal": "1639.85",
  "tax_rate": 19,
  "tax_amount": "311.57",
  "discount_amount": "0.00",
  "total": "1951.42",
  "paid_amount": "0.00",
  "remaining_balance": "1951.42",
  "is_overdue": false,
  "payment_method": "transfer",
  "created_at": "2024-04-24T14:30:00Z"
}
```

### Registrar pago

**Endpoint:**
```
POST /billing/invoices/{id}/record_payment/
```

**Body:**
```json
{
  "amount": "500.00",
  "payment_method": "transfer",
  "reference": "Transferencia 123456",
  "notes": "Primer pago"
}
```

### Factu ras pendientes

**Endpoint:**
```
GET /billing/invoices/pending/
```

### Facturas vencidas

**Endpoint:**
```
GET /billing/invoices/overdue/
```

### Facturas pagadas

**Endpoint:**
```
GET /billing/invoices/paid/
```

### Marcar como pagada

**Endpoint:**
```
POST /billing/invoices/{id}/mark_as_paid/
```

### Cancelar factura

**Endpoint:**
```
POST /billing/invoices/{id}/cancel/
```

---

## 5. GESTIÓN DE INVENTARIO

### Listar movimientos

**Endpoint:**
```
GET /inventory/movements/
```

**Parámetros de Query:**
```
?product=1
&movement_type=in
&reason=purchase
```

### Crear movimiento

**Endpoint:**
```
POST /inventory/movements/
```

**Body:**
```json
{
  "product": 1,
  "movement_type": "in",
  "quantity": 50,
  "reason": "purchase",
  "reference_number": "PO-12345",
  "notes": "Compra a proveedor"
}
```

### Alertas de stock

**Endpoint:**
```
GET /inventory/alerts/
```

### Alertas activas

**Endpoint:**
```
GET /inventory/alerts/active/
```

### Marcar alerta como resuelta

**Endpoint:**
```
POST /inventory/alerts/{id}/mark_as_resolved/
```

---

## 6. REPORTES

### Ventas de hoy

**Endpoint:**
```
GET /reports/sales/daily_sales/
```

**Respuesta:**
```json
{
  "date": "2024-04-24",
  "total_invoices": 10,
  "total_sales": "15000.00",
  "average_invoice": "1500.00"
}
```

### Ventas de la semana

**Endpoint:**
```
GET /reports/sales/weekly_sales/
```

### Ventas del mes

**Endpoint:**
```
GET /reports/sales/monthly_sales/
```

### Resumen general

**Endpoint:**
```
GET /reports/sales/summary/
```

### Productos más vendidos

**Endpoint:**
```
GET /reports/products/top_sold/?limit=10
```

### Productos más rentables

**Endpoint:**
```
GET /reports/products/top_revenue/?limit=10
```

### Desglose por categoría

**Endpoint:**
```
GET /reports/products/category_breakdown/
```

---

## Códigos de Error HTTP

- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado
- `400 Bad Request` - Error en los datos enviados
- `401 Unauthorized` - Autenticación requerida
- `403 Forbidden` - No tienes permiso
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

---

## Ejemplos con cURL

### Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123456"}'
```

### Crear producto (con token)

```bash
curl -X POST http://localhost:8000/api/v1/products/products/ \
  -H "Authorization: Bearer TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","sku":"LAP-001","category":1,"purchase_price":"500","sale_price":"800","stock":50,"minimum_stock":5}'
```

### Obtener facturas del cliente

```bash
curl -X GET http://localhost:8000/api/v1/customers/customers/1/invoices/ \
  -H "Authorization: Bearer TOKEN_JWT"
```

---

## Paginación

Todas las listas soportan paginación:

```
GET /api/v1/products/products/?page=2&page_size=50
```

Respuesta:
```json
{
  "count": 150,
  "next": "http://localhost:8000/api/v1/products/products/?page=3",
  "previous": "http://localhost:8000/api/v1/products/products/?page=1",
  "results": [...]
}
```

---

## Filtrado y Búsqueda

### Por campos

```
GET /api/v1/products/products/?category=1&is_active=true
```

### Búsqueda por texto

```
GET /api/v1/products/products/?search=laptop
```

### Ordenamiento

```
GET /api/v1/products/products/?ordering=-sale_price
GET /api/v1/products/products/?ordering=name
```

---

Para más información, visita: http://localhost:8000/api/docs/
