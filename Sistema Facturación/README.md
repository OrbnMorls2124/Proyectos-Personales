
# Sistema de Facturación Honduras (SAR Compliant) 🇭🇳

Un sistema de facturación profesional, robusto y moderno diseñado para cumplir con la normativa fiscal de Honduras (SAR). Construido con las últimas tecnologías web para ser escalable, seguro y fácil de usar.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Sistema+Facturación+Preview)

## 🚀 Tecnologías (Stack MERN Moderno)

### Frontend (Cliente)
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Lenguaje**: TypeScript
- **Estilos**: [TailwindCSS](https://tailwindcss.com/)
- **Iconos**: Lucide React
- **Navegación**: React Router DOM

### Backend (Servidor)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Base de Datos**: PostgreSQL (vía [Supabase](https://supabase.com/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Validación**: Zod

## ✨ Características Clave

- **Facturación POS**: Interfaz rápida para puntos de venta con búsqueda instantánea de productos y clientes.
- **Cumplimiento SAR**: Manejo de rangos de facturación, CAI, fechas límite y desglose de ISV.
- **Gestión de Inventario**: Control de existencias en tiempo real con alertas de stock bajo.
- **Base de Datos en la Nube**: Datos seguros y accesibles desde cualquier lugar gracias a PostgreSQL.
- **Diseño Responsive**: Funciona en computadoras, tablets y móviles.

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- Git

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/sistema-facturacion-hn.git
   cd sistema-facturacion-hn
   ```

2. **Configurar Backend**
   ```bash
   cd server
   npm install
   # Crear archivo .env basado en .env.example
   # Configurar DATABASE_URL de tu base de datos PostgreSQL
   npx prisma migrate dev
   npm run dev
   ```

3. **Configurar Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 🔐 Seguridad

Este proyecto utiliza variables de entorno (.env) para manejar credenciales sensibles. **Nunca subas tu archivo .env al repositorio.**

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
