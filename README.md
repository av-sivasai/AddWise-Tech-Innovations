# 🔐 QR Code Management & Tracking System – MERN Stack

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application for secure user authentication, QR code generation, sharing, claiming, and device tracking. The app supports two roles: **Admin** and **User** with role-based access, route protection, and QR code lifecycle management.

---

## 🚀 Features Overview

- 🔐 **Authentication** with role-based access (Admin/User)
- 📎 **QR Code Generation** and distribution (Admin)
- 📲 **QR Code Claiming** by users via camera, upload, or manual entry
- 🌍 **Geolocation Tracking** of claimed QR codes
- 🗺 **Live Path Updates** for each QR code’s journey
- 📥 **QR Download & Sharing** as image files
- 🧭 **Dashboard views** for Admin and Users

---

## 🛠 Tech Stack

### 🔧 Frontend
- **React.js** – SPA UI
- **Vite** – Fast frontend bundler
- **Redux Toolkit** – State management
- **Tailwind CSS** – Styling
- **React Router** – Navigation
- **qrcode.react** – Render QR codes
- **html5-qrcode / jsqr** – Camera/image-based QR scanner
- **leaflet** – Maps and geolocation
- **react-toastify** – Notifications

### 🔧 Backend
- **Node.js + Express.js** – API server
- **MongoDB + Mongoose** – Database and ODM
- **jsonwebtoken (JWT)** – Auth token management
- **bcryptjs** – Password hashing
- **cookie-parser** – Cookie handling
- **dotenv** – Environment variables
- **cors** – CORS middleware

---

## 🔄 Application Flow

### 1️⃣ Authentication
- **Registration**: User/Admin signup. Admins require a special code.
- **Login**: Authenticated via JWT, stored in secure cookies.
- **Session**: Managed via Redux & HTTP-only cookies.

### 2️⃣ Route Protection
- `ProtectedRoute`: Blocks unauthorized access to secure routes.
- `PublicRoute`: Prevents logged-in users from accessing login/signup.

### 3️⃣ Admin Features
- 🔹 Generate and manage QR codes (random 16-digit number)
- 🔹 View all users and QR codes in the system
- 🔹 Download and share QR codes as images

### 4️⃣ User Features
- 🔸 Claim QR codes using:
  - Camera scan
  - Image upload
  - Manual entry
- 🔸 Submit **purpose** and allow **location tracking**
- 🔸 View claimed/unclaimed QR codes
- 🔸 Track and update QR path with geolocation events

### 5️⃣ QR Code Lifecycle
1. **Generate**: Admin creates QR codes stored in DB
2. **Distribute**: Shared/downloaded by Admin
3. **Claim**: Users claim by scanning/entering code
4. **Track**: QR path is updated with every new location


---

## 🚧 Setup Instructions

```bash
# Clone repository
git clone https://github.com/your-username/qr-code-management.git
cd qr-code-management

# Setup backend
cd server
npm install
npm run dev

# Setup frontend
cd ../client
npm install
npm run dev

