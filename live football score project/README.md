# ⚽ FuturaScore — Live Football Scores

Aplicación web de resultados de fútbol en tiempo real, construida con **Laravel 11**, **Livewire 3**, **Alpine.js** y **Tailwind CSS**. Muestra partidos en vivo con el minuto exacto, resultados y estadísticas de las principales ligas del mundo.

---

## 🚀 Requisitos

Antes de empezar, asegúrate de tener instalado:

- **PHP >= 8.1** (recomendado: Laragon)
- **Composer**
- **Node.js >= 18** y **npm**
- Una clave de API gratuita de [football-data.org](https://www.football-data.org/client/register)

---

## ⚙️ Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/OrbnMorls2124/Proyectos-Personales.git
cd "Proyectos-Personales/live football score project"
```

### 2. Instalar dependencias de PHP

```bash
composer install
```

### 3. Instalar dependencias de JavaScript

```bash
npm install
```

### 4. Configurar el entorno

Copia el archivo de ejemplo y edítalo:

```bash
cp .env.example .env
php artisan key:generate
```

Dentro de `.env`, configura:

```env
# Base de datos (SQLite, sin configuración extra)
DB_CONNECTION=sqlite

# Tu clave de API de football-data.org (GRATIS)
FOOTBALL_DATA_API_KEY=tu_api_key_aqui
```

> 🔑 Obtén tu API Key gratuita en: https://www.football-data.org/client/register

### 5. Crear y migrar la base de datos

```bash
php artisan migrate
```

### 6. Sincronizar los partidos de hoy

```bash
php artisan app:sync-football-data
```

### 7. Levantar el servidor

```bash
php artisan serve
```

Abre tu navegador en **http://localhost:8000/dashboard**

---

## 🔄 Mantener los datos actualizados

Para sincronizar los resultados más recientes (puedes correrlo cada vez que quieras o automatizarlo):

```bash
php artisan app:sync-football-data
```

---

## ✨ Características

- 📡 Datos en vivo de Football-Data.org
- ⏱️ Minuto exacto en tiempo real (calculado dinámico al cargar la página)
- 🏆 Champions League, Premier League, La Liga, Serie A, Bundesliga y más
- 🌙 Diseño oscuro estilo SofaScore
- ⚡ Actualización reactiva con Livewire (sin recargar la página)
- 🕐 Horarios adaptados automáticamente a tu zona horaria

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | Laravel 11 |
| Frontend reactivo | Livewire 3 + Volt |
| Micro-interacciones | Alpine.js |
| Estilos | Tailwind CSS |
| Base de datos | SQLite |
| API de datos | Football-Data.org |

---

## 📁 Estructura del proyecto

```
live football score project/
├── app/
│   ├── Models/          # Fixture, League, Team
│   ├── Services/        # FootballDataService
│   └── Console/Commands # SyncFootballData
├── resources/views/
│   └── livewire/        # live-score-dashboard
├── database/migrations/ # Tablas de leagues, teams, fixtures
├── public/build/        # Assets compilados (Vite)
└── .env.example         # Plantilla de configuración
```
