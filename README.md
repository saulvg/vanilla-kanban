# Vanilla JS Kanban Board

Un tablero Kanban desarrollado con **JavaScript puro**, HTML y CSS en el front-end, y **Node.js + Express** en el back-end, para practicar REST APIs y drag & drop sin frameworks.

## 📂 Estructura

- `public/index.html` – punto de entrada y estructura HTML.
- `public/styles/main.css` – estilos modernos con variables CSS, diseño responsive, sombras y transiciones.
  - 🔗 [Ver archivo `main.css`](https://github.com/tu-usuario/vanilla-kanban/tree/main/public/styles/main.css)
- `public/scripts/env.js` – configuración de entorno inyectada en `window._env_`.
- `public/scripts/api.js` – módulo ES6 para llamadas CRUD al servidor Express.
  - 🔗 [Ver archivo `api.js`](https://github.com/tu-usuario/vanilla-kanban/tree/main/public/scripts/api.js)
- `public/scripts/app.js` – lógica de UI: renderizado de columnas, drag & drop, marcado, borrado, sincronización con back-end.
  - 🔗 [Ver archivo `app.js`](https://github.com/tu-usuario/vanilla-kanban/tree/main/public/scripts/app.js)
- `api/index.js` – servidor Express con rutas CRUD (`GET`, `POST`, `PATCH`, `DELETE`) y persistencia en JSON.
  - 🔗 [Ver archivo `index.js`](https://github.com/tu-usuario/vanilla-kanban/tree/main/api/index.js)
- `api/tasks.json` – “base de datos” local en formato JSON.
- `scripts/generateEnv.js` – script Node que lee `.env` y genera `public/scripts/env.js`.
- `api/.env` – variables de entorno (PUERTO, PREFIJO API).
- `package.json` (raíz) – scripts de setup, generación de env, arranque de API y frontend.
- `api/package.json` – scripts y dependencias de Express, nodemon y dotenv.
- `.gitignore` – exclusiones de Git (`node_modules/`, `public/scripts/env.js`, etc.).
- `README.md` – esta documentación.

## ⚙️ Tecnologías

- **Front-end**: HTML5, CSS3 (Variables, Flexbox/Grid, Transiciones), JavaScript (ES6 Modules)
- **Back-end**: Node.js, Express, dotenv
- **Herramientas**: nodemon (auto-reload), concurrently (paralelizar scripts), serve (servidor estático)

## 🚀 Uso local

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/vanilla-kanban.git

   ```

2. Ve al directorio del proyecto:

   ```bash
   cd vanilla-kanban

   ```

3. Instala dependencias y arranca todo con un solo comando:

   ```bash
   npm run start
   ```

   Esto:

   - Instala deps en raíz y en api/
   - Genera env.js
   - Arranca el servidor Express en modo development
   - Sirve el frontend estático en http://localhost:5000

4. Abre tu navegador en:
   ```
   http://localhost:5000
   ```

## 📱 / 🖥️ Capturas

### 🖥️ Vista Desktop

  <p align="center"> <img src="assets/screenshotDesktop.png" alt="Kanban Desktop" width="300px" /> </p>
  
  ### 📱 Vista Móvil
  <p align="center"> <img src="assets/screenshotMobile.png" alt="Kanban Mobile" width="250px" /> </p>
