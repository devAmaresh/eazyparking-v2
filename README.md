#  EazyParking: Parking Management System

A modern full-stack web application for efficient vehicle parking slot booking and management. EazyParking offers a clean and responsive frontend built with React and TypeScript, backed by RESTful APIs in Node.js and Express.

🔗 **Live Demo**: [EazyParking App](https://eazyparking.tech/)  
💻 **Source Code**: [GitHub Repository](https://github.com/latelateef/eazy-parking-mern)

---

## 📋 Table of Contents

- [EazyParking: Parking Management System](#eazyparking-parking-management-system)
  - [📋 Table of Contents](#-table-of-contents)
  - [🚀 Features](#-features)
  - [⚙️ Tech Stack](#️-tech-stack)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Dev Tools](#dev-tools)
  - [📸 Screenshots](#-screenshots)
  - [🛠️ Installation](#️-installation)
    - [Clone the Repo](#clone-the-repo)
    - [1️⃣ Backend Setup](#1️⃣-backend-setup)
    - [2️⃣ Frontend Setup](#2️⃣-frontend-setup)
  - [🧾 Environment Variables](#-environment-variables)
  - [🗃️ Database Schema](#️-database-schema)
  - [📁 Project Structure](#-project-structure)
  - [🔮 Future Improvements](#-future-improvements)
  - [📄 License](#-license)

---

## 🚀 Features

- 🔐 JWT-based User Authentication & Authorization
- 👤 Role-specific dashboards for Users and Admins
- 📅 Real-time parking slot availability checks
- 🧾 Booking management with dynamic forms
- 📊 Admin analytics for slots and booking data
- 🧩 RESTful API architecture
- 🧼 Clean UI with responsive design

---

## ⚙️ Tech Stack

### Frontend
- **React**
- **TypeScript**
- **React Router**
- **Axios**
- **Tailwind CSS** *(if used)*

### Backend
- **Node.js**
- **Express.js**
- **MySQL**
- **JWT for Authentication**
- **bcrypt for Password Hashing**

### Dev Tools
- **Git & GitHub**
- **Postman** for API testing
- **Koyeb** for deployment

---

## 📸 Screenshots

*(Add actual screenshots or GIFs to improve clarity)*

| User Dashboard | Admin Panel |
|----------------|-------------|
| ![User](screenshots/user-dashboard.png) | ![Admin](screenshots/admin-panel.png) |

---

## 🛠️ Installation

### Clone the Repo

```bash
git clone https://github.com/latelateef/Vehicle-Parking-Booking-System-SE-Project-.git
cd Vehicle-Parking-Booking-System-SE-Project-
```

---

### 1️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=eazyparking
JWT_SECRET=your_jwt_secret
```

Run the server:

```bash
npm run dev
```

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🧾 Environment Variables

Make sure your `.env` file in the backend contains:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=eazyparking
JWT_SECRET=your_jwt_secret
```

---

## 🗃️ Database Schema

Key tables:

- `users`: user info (role, email, password)
- `slots`: parking slots with status (available/booked)
- `bookings`: reservation data (slot ID, user ID, timestamp)
- `admins`: admin accounts
- `payments`: *(optional, if Razorpay integration is added later)*

SQL dump can be found in `backend/database/schema.sql`.

---

## 📁 Project Structure

```
Vehicle-Parking-Booking-System/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── database/
│   └── server.ts
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
├── README.md
```

---

## 🔮 Future Improvements

- 🔄 Real-time booking updates with WebSockets
- 📍 Google Maps API for geo-location based parking
- 💳 Razorpay / Stripe payment gateway integration
- 🧾 Email and SMS confirmations
- 📱 PWA capabilities

---

## 📄 License

This project is licensed under the MIT License.
