# Nova Commerce

Tienda virtual profesional en PHP 8 con arquitectura MVC, MySQL, APIs REST, UI responsive, carrito, checkout con pagos simulados, panel administrativo, recomendaciones y caché.

## Stack

- PHP 8.2+
- MVC propio estilo Laravel para poder ejecutarse sin Composer global
- MySQL 8
- Vite preparado para assets
- SweetAlert2, DataTables, Chart.js
- APIs externas: DummyJSON y Fake Store API
- Docker opcional

## Instalación local rápida

1. Copia `.env.example` como `.env` y ajusta credenciales MySQL.
2. Importa `database/migrations/schema.sql` en MySQL.
3. Importa `database/seeders/seed.sql`.
4. Sincroniza APIs externas con `php artisan-sync.php`.
5. Inicia el servidor:

```bash
php -S 127.0.0.1:8000 -t public
```

Abre `http://127.0.0.1:8000`.

## Docker

```bash
docker compose up --build
```

Luego importa el SQL dentro del contenedor MySQL o con tu cliente favorito usando las credenciales de `docker-compose.yml`.

## Credenciales demo

- Admin: `admin@example.com`
- Password cuando no hay DB: `password`

## Login con Google

1. Crea credenciales OAuth 2.0 para aplicación web en Google Cloud Console.
2. Agrega este redirect URI autorizado: `http://127.0.0.1:8000/auth/google/callback`.
3. Configura `.env`:

```bash
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret
GOOGLE_REDIRECT_URI=http://127.0.0.1:8000/auth/google/callback
```

El flujo usa OpenID Connect con scopes `openid email profile`, valida `state`, exige correo verificado por Google y aplica el mismo filtro de dominios reales/no temporales.

Si ya habías creado la base antes de esta integración, ejecuta también `database/migrations/2026_05_08_add_google_oauth_to_users.sql`.

## Validación de correos

El login, registro, recuperación y Google OAuth rechazan dominios temporales conocidos y dominios sin DNS MX/A/AAAA. Puedes ampliar la lista en `app/services/EmailValidationService.php`.

Nota: el hash de `seed.sql` es placeholder de producción. Para una instalación real, genera un hash Argon2id con PHP:

```bash
php -r "echo password_hash('password', PASSWORD_ARGON2ID), PHP_EOL;"
```

## Funcionalidades

- Registro, login, logout y recuperación simulada.
- Sesiones seguras, CSRF, rate limiting, hash Argon2id.
- Catálogo con búsqueda, filtros, ordenamiento y paginación base.
- Productos tecnológicos locales y sincronización desde APIs reales.
- Carrito persistente en sesión, cupón `NOVA15`, impuestos y envío.
- Checkout tipo ecommerce moderno con tarjetas validadas por Luhn y métodos PayPal, transferencia, contra entrega, Apple Pay y Google Pay simulados.
- Panel admin con KPIs, Chart.js, DataTables y sincronización de APIs.
- Panel cliente con perfil, pedidos, wishlist visual y métodos simulados.
- API REST documentada en `docs/openapi.yaml`.
- Docker, caché en archivos, logs preparados y estructura modular.

## Estructura

```text
app/
  Core/ controllers/ models/ views/ middleware/ services/ repositories/ helpers/
public/
  assets/ uploads/
routes/
config/
database/
storage/
docs/
docker/
```

## Producción

- Configura HTTPS y `SESSION_SECURE=true`.
- Usa credenciales MySQL dedicadas.
- Genera hashes reales para usuarios seed.
- Coloca `public/` como document root.
- Ejecuta `npm install && npm run build` si quieres compilar assets con Vite.
- Programa `php artisan-sync.php` en cron para refrescar productos externos.
