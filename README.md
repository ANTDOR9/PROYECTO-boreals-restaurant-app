# 🍽️ Boreals Restaurant App

Sistema de gestión de pedidos para restaurante en tiempo real, construido con Node.js, React y MongoDB.

---

## 🚀 Demo en producción

- **Frontend:** https://proyecto-boreals-restaurant-app.vercel.app
- **Backend:** https://proyecto-boreals-restaurant-app.onrender.com

---

## 📋 Características

- Autenticación con JWT por roles (admin, mesero, cocina)
- Pedidos en tiempo real con Socket.IO
- Mesas con estado automático (libre / ocupada)
- Sonido en cocina cuando llega un pedido nuevo
- Gestión de menú desde el panel admin
- Base de datos NoSQL con MongoDB Atlas

---

## 🛠️ Tecnologías

### Backend
- Node.js + Express
- MongoDB Atlas + Mongoose
- Socket.IO
- JWT + bcryptjs
- dotenv

### Frontend
- React + Vite
- Tailwind CSS
- Axios
- Socket.IO Client
- React Router DOM

---

## 📁 Estructura del proyecto

```
PROYECTO-boreals-restaurant-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js        # Conexión a MongoDB
│   │   ├── controllers/
│   │   │   ├── authController.js  # Login y registro
│   │   │   ├── menuController.js  # CRUD del menú
│   │   │   ├── orderController.js # CRUD de pedidos
│   │   │   └── tableController.js # CRUD de mesas
│   │   ├── middleware/
│   │   │   └── auth.js            # Verificación JWT y roles
│   │   ├── models/
│   │   │   ├── Menu.js            # Modelo de producto
│   │   │   ├── Order.js           # Modelo de pedido
│   │   │   ├── Table.js           # Modelo de mesa
│   │   │   └── User.js            # Modelo de usuario
│   │   └── routes/
│   │       ├── authRoutes.js
│   │       ├── menuRoutes.js
│   │       ├── orderRoutes.js
│   │       └── tableRoutes.js
│   ├── server.js                  # Punto de entrada
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Estado de autenticación
│   │   │   └── OrderContext.jsx   # Estado global de pedidos
│   │   ├── pages/
│   │   │   ├── AdminPage.jsx      # Panel administrador
│   │   │   ├── KitchenPage.jsx    # Pantalla de cocina
│   │   │   ├── LoginPage.jsx      # Login
│   │   │   └── WaiterPage.jsx     # Vista del mesero
│   │   ├── services/
│   │   │   ├── api.js             # Llamadas al backend
│   │   │   └── socket.js          # Conexión Socket.IO
│   │   ├── App.jsx                # Rutas y navbar
│   │   └── main.jsx               # Punto de entrada
│   ├── vercel.json                # Configuración de rutas en Vercel
│   └── package.json
└── .gitignore
```

---

## 🔄 Flujo del sistema

```
Mesero crea pedido
      │
      ▼
Backend guarda en MongoDB
      │
      ├── Mesa se marca como ocupada
      │
      └── Socket.IO notifica a Cocina en tiempo real
                │
                ▼
         Cocina recibe sonido + tarjeta del pedido
                │
                ├── "Iniciar preparación" → estado: preparing
                │
                └── "Marcar como listo" → estado: ready
                          │
                          └── Mesa se libera automáticamente
```

---

## 🔐 Roles y acceso

| Rol     | Usuario   | Contraseña  | Acceso              |
|---------|-----------|-------------|---------------------|
| Admin   | admin     | admin123    | Todo el sistema     |
| Mesero  | mesero1   | mesero123   | Vista de pedidos    |
| Cocina  | cocina1   | cocina123   | Pantalla de cocina  |

---

## 📡 API Endpoints

### Autenticación
```
POST /api/auth/register   → Crear usuario
POST /api/auth/login      → Iniciar sesión
```

### Menú
```
GET    /api/menu          → Obtener menú completo
POST   /api/menu          → Agregar producto
PUT    /api/menu/:id      → Editar producto
DELETE /api/menu/:id      → Eliminar producto
```

### Pedidos
```
GET    /api/orders        → Obtener todos los pedidos
POST   /api/orders        → Crear pedido
PUT    /api/orders/:id    → Cambiar estado del pedido
DELETE /api/orders/:id    → Eliminar pedido
```

### Mesas
```
GET    /api/tables        → Obtener todas las mesas
POST   /api/tables        → Crear mesa
PUT    /api/tables/:id    → Cambiar estado de mesa
```

---

## ⚙️ Instalación local

### Requisitos
- Node.js v18+
- Cuenta en MongoDB Atlas
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/ANTDOR9/PROYECTO-boreals-restaurant-app.git
cd PROYECTO-boreals-restaurant-app
```

### 2. Configurar el backend

```bash
cd backend
npm install
```

Crear archivo `.env` en la carpeta `backend`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://USUARIO:CONTRASEÑA@cluster0.xxxxx.mongodb.net/boreals-restaurant
JWT_SECRET=boreals_secret_2024
```

Iniciar el backend:

```bash
npm run dev
```

### 3. Configurar el frontend

```bash
cd ../frontend
npm install
```

Crear archivo `.env` en la carpeta `frontend`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

Iniciar el frontend:

```bash
npm run dev
```

### 4. Crear usuarios iniciales

Con el servidor corriendo, usar Thunder Client o Postman:

```
POST http://localhost:3000/api/auth/register
Body: { "username": "admin", "password": "admin123", "role": "admin" }

POST http://localhost:3000/api/auth/register
Body: { "username": "mesero1", "password": "mesero123", "role": "waiter" }

POST http://localhost:3000/api/auth/register
Body: { "username": "cocina1", "password": "cocina123", "role": "kitchen" }
```

---

## ☁️ Deploy

| Servicio  | Plataforma | Configuración                    |
|-----------|------------|----------------------------------|
| Backend   | Render     | Root: `backend`, Start: `node server.js` |
| Frontend  | Vercel     | Root: `frontend`, Preset: Vite   |

---


---

