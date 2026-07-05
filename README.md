# 🎯 Commitly

A modern full-stack accountability platform built with **React, Node.js, Express.js, MySQL, Tailwind CSS, and Cloudinary**, helping users stay consistent by setting daily goals, uploading proof of completion, and getting verified by friends or group members.

## 🌐 Live Demo

- **Frontend:** https://commitly26.netlify.app
- **Backend API:** https://your-backend-url.onrender.com

---

# 🚀 Features

### 🎯 Goal Management
- Create daily goals
- Track goal progress
- View goal history
- Delete completed goals automatically

### 👥 Group Collaboration
- Create accountability groups
- Invite friends to join groups
- Manage group members
- Collaborate on shared goals

### ✅ Proof Verification
- Upload proof images using Cloudinary
- Peer verification system
- Verify goals submitted by group members
- Maintain accountability through community validation

### 🏆 Achievements & Leaderboards
- Earn achievements for consistency
- Track verified goal streaks
- Group leaderboards
- Performance-based rankings

### 🔔 Notifications
- Group invitations
- Goal verification updates
- Achievement notifications
- Member activity alerts

### 🔐 Authentication & Security
- JWT Authentication
- Secure password hashing
- Protected API routes
- Role-Based Access Control (RBAC)

### 📱 User Experience
- Fully responsive UI
- Clean and modern interface
- Mobile-friendly design
- Fast and intuitive navigation

---

# ⚡ System Highlights

- 20+ REST APIs
- JWT Authentication & RBAC
- Cloudinary Image Upload Integration
- Peer Goal Verification System
- Achievement & Leaderboard Module
- Responsive Design
- RESTful Backend Architecture
- MySQL Relational Database
- Secure Authentication Flow

---

# 🗄 Database Design

The application uses a relational **MySQL** database consisting of six core tables:

- Users
- Groups
- Group Members
- Goals
- Group Invitations
- Notifications

These tables efficiently manage authentication, group collaboration, goal tracking, proof verification, notifications, achievements, and leaderboard generation.

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router
- Axios

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt.js
- Multer

## Database

- MySQL

## Media Storage

- Cloudinary

## Deployment

- Netlify
- Render

---

# 📂 Project Structure

```text
Commitly
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── config
│   ├── uploads
│   └── server.js
│
└── frontend
    ├── src
    ├── components
    ├── pages
    ├── services
    ├── contexts
    └── assets
```

---

# ⚙️ Local Setup

## Clone

```bash
git clone https://github.com/shraddha-cse24/Commitly.git
```

## Backend

```bash
cd backend

npm install

npm run dev
```

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🔐 Environment Variables

Configure the required environment variables for the database, JWT authentication, Cloudinary, and API endpoints before running the project locally.

# 📸 Screenshots

> Add screenshots here.

- Landing Page
- Dashboard
- Group Details
- Goal Verification
- Leaderboard
- Achievements
- Notifications
- Goal History

---

# 🚀 Future Improvements

- 📧 Email Notifications
- 📊 Advanced Analytics Dashboard
- 📈 Progress Insights & Reports
- 🌙 Dark Mode
- 📱 Progressive Web App (PWA)
- 📅 Calendar View
- 🎖 More Achievement Badges

---

# 👩‍💻 Author

**Shraddha Singh**

B.Tech CSE  
IIITDM Jabalpur

GitHub:  
https://github.com/shraddha-cse24

LinkedIn:  
https://www.linkedin.com/in/shraddha-singh-6a316a346/
