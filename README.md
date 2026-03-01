# Vibe&Co Proyecto

Aplicación web fullstack (Node.js + Express + MongoDB) para tienda en línea con:

- Registro e inicio de sesión con JWT
- Carrito en `localStorage` con sincronización al backend
- Flujo de pago simulado

## Requisitos

- Node.js 18+
- npm
- MongoDB local o MongoDB Atlas

## Instalación

```bash
npm install
```

## Variables de entorno (opcional)

Puedes crear un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
SECRET_KEY=tu_clave_secreta
MONGO_URI=mongodb://127.0.0.1:27017/vibeCoDB
```

Si no defines variables, el servidor usa valores por defecto.

## Ejecución

```bash
npm start
```

## Rutas principales

- `/` → Página principal (`View/Main.html`)
- `/login.html` → Login y registro
- `/pago.html` → Pago simulado
- `/health` → Estado del servidor

## Organización del proyecto

- `server.js` → API y configuración de servidor
- `View/` → vistas principales activas (main, login, pago)
- `public/` → páginas estáticas adicionales (secciones)
- `Source/` → assets principales (íconos, imágenes y ropa)

El servidor expone de forma estática `View/`, `public/`, `Source/` y también `public` bajo `/public` para compatibilidad con enlaces existentes.