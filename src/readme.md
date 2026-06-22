# ⚡ CPSync Frontend

A modern, responsive React application that helps competitive programmers automatically sync upcoming coding contests to their Google Calendar.

Built with **React + Vite + Tailwind CSS**, CPSync provides a beautiful dashboard for viewing contests, managing platform preferences, and triggering instant Google Calendar synchronization.

---

## ✨ Features

- 🎯 **Beautiful Modern UI**
  - Clean glassmorphism design
  - Smooth Framer Motion animations
  - Fully responsive layout

- 🔐 **Google OAuth2 Authentication**
  - One-click Google Sign-In
  - JWT-based authentication
  - Automatic session handling

- 📅 **Contest Dashboard**
  - View upcoming contests
  - Countdown timers
  - Contest duration
  - Direct contest links

- 🌍 **Multi Platform Support**

  - Codeforces
  - LeetCode
  - CodeChef
  - AtCoder

- 🔍 **Smart Filtering**

  - Filter contests by platform
  - View only preferred contests
  - Dynamic sorting

- ⚡ **Instant Calendar Sync**

  - Sync contests to Google Calendar with one click
  - No duplicate events
  - Real-time synchronization status

- 👤 **Profile Management**

  - Enable/Disable platforms
  - Pause automatic syncing
  - Resume synchronization anytime

---

# 🛠️ Tech Stack

| Category | Technologies |
| ---------------- | --------------------------------------------- |
| **Framework** | React 19 + Vite |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Routing** | React Router DOM |
| **HTTP Client** | Fetch API |
| **Authentication** | Google OAuth2 + JWT |
| **UI Components** | Custom Components + shadcn/ui |

---

# 🏗️ Project Structure

```text
src/
│
├── assets/
│   ├── hero.png
│   └── icons
│
├── components/
│   │
│   ├── common/
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── HowItWorks.jsx
│   │   └── Stats.jsx
│   │
│   ├── contests/
│   │   ├── ContestCard.jsx
│   │   └── Filters.jsx
│   │
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   │
│   └── ui/
│       ├── button.jsx
│       ├── card.jsx
│       └── index.jsx
│
├── lib/
│   ├── api.js
│   ├── auth.js
│   └── utils.js
│
├── pages/
│   ├── LandingPage.jsx
│   ├── Dashboard.jsx
│   ├── ProfilePage.jsx
│   ├── AuthCallback.jsx
│   └── NotFound.jsx
│
├── App.jsx
├── main.jsx
└── index.css
```

---

# 🚀 Getting Started

## Prerequisites

- Node.js 18+
- npm or pnpm
- CPSync Backend running locally or deployed

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/yourusername/cpsync-frontend.git

cd cpsync-frontend
```

---

Install dependencies

```bash
npm install
```

or

```bash
pnpm install
```

---

# ⚙️ Environment Variables

Create a `.env` file in the project root.

```env
VITE_API_URL=http://localhost:8080
VITE_FRONTEND_URL=http://localhost:5173
```

If using a deployed backend:

```env
VITE_API_URL=https://your-backend-url.com
```

---

# ▶️ Run Development Server

```bash
npm run dev
```

Application will be available at

```
http://localhost:5173
```

---

# 📦 Production Build

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

# 🎨 UI Highlights

### Landing Page

- Animated Hero Section
- Platform Showcase
- Feature Cards
- How It Works
- Statistics
- Footer

---

### Dashboard

- Upcoming Contests
- Live Countdown
- Platform Filters
- Manual Sync Button
- Responsive Contest Cards

---

### Profile

- User Information
- Platform Preferences
- Pause/Resume Auto Sync
- Google Account Integration

---

# 🔐 Authentication Flow

```
User
   │
   ▼
Continue with Google
   │
   ▼
Google OAuth2
   │
   ▼
Backend Authentication
   │
   ▼
JWT Token
   │
   ▼
Frontend Dashboard
```

---

# 🌍 Supported Platforms

| Platform | Status |
| ---------------- | ---------- |
| Codeforces | ✅ |
| LeetCode | ✅ |
| CodeChef | ✅ |
| AtCoder | ✅ |

---

# 📡 Backend Integration

The frontend communicates with the Spring Boot backend using REST APIs.

### Public

```
GET /api/contests
```

Returns all upcoming contests.

---

### Protected APIs

```
GET /api/user/profile

PUT /api/user/platforms

PUT /api/user/pause

PUT /api/user/resume

POST /api/sync
```

All protected endpoints require

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 📱 Responsive Design

Optimized for

- 💻 Desktop
- 💼 Laptop
- 📱 Mobile
- 📟 Tablet

---

# ⚡ Performance

- Vite Fast Refresh
- Lazy Rendering
- Optimized Components
- Smooth Framer Motion Animations
- Minimal Bundle Size

---

# 🤝 Contributing

1. Fork the repository

```
git checkout -b feature/my-feature
```

2. Commit your changes

```
git commit -m "Add awesome feature"
```

3. Push the branch

```
git push origin feature/my-feature
```

4. Open a Pull Request

---

# 📄 License

Released under the **MIT License**.

Feel free to use, modify, and distribute this project.

---

# 💜 CPSync

> **Never miss a coding contest again.**

Automatically sync Codeforces, LeetCode, CodeChef, and AtCoder contests directly to your Google Calendar with a beautiful, fast, and modern interface.