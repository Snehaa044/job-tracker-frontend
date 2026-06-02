# 🎯 JobTracker — Frontend

A professional React.js dashboard for managing your job search. Built with Vite, featuring an editorial dark UI, animated pipeline visualization, and real-time analytics.

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![Recharts](https://img.shields.io/badge/Recharts-2.0-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Live Demo
[https://job-tracker-frontend.vercel.app](https://job-tracker-frontend.vercel.app)

## ✨ Features

- **Dashboard** — Pipeline visualization, stat cards with count-up animations, recent activity
- **Applications** — Full CRUD with search, filter by status, quick status updates
- **Application Detail** — Schedule interviews, update status, view all rounds
- **Interviews** — Calendar view of all upcoming and completed rounds
- **Question Bank** — Personal library with difficulty, company, tags, collapsible answers
- **Analytics** — Conversion rates, platform breakdown, monthly trends with Recharts

## 🎨 Design System

- **Typography:** Fraunces (display) + DM Sans (UI) + IBM Plex Mono (data)
- **Theme:** Deep navy dark with electric cyan accents
- **Animations:** Staggered fade-ins, count-up numbers, progress bar fills
- **Components:** StatusBadge, StatCard, Sidebar with active states

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + Vite | Frontend framework |
| React Router v6 | Client-side routing |
| Axios | HTTP client with interceptors |
| Recharts | Analytics charts |
| CSS Variables | Design token system |
| Google Fonts | Typography |

## ⚡ Quick Start

```bash
# Clone
git clone https://github.com/Snehaa044/job-tracker-frontend.git
cd job-tracker-frontend

# Install
npm install

# Configure API URL
# Edit src/api/axios.js
baseURL: 'http://localhost:8083/api'

# Run
npm run dev
```

App runs at: `http://localhost:5173`

## 📁 Project Structure

src/
├── api/          → Axios instance with JWT interceptors
├── context/      → Auth context (global user state)
├── components/   → Reusable: Sidebar, StatCard, StatusBadge
├── pages/        → Login, Register, Dashboard, Applications,
│                   ApplicationDetail, Interviews, QuestionBank, Analytics
└── styles/       → Global CSS with design tokens

## 🔧 Environment

Create `.env` file:
VITE_API_URL=http://localhost:8083/api

Update `src/api/axios.js`:
```js
baseURL: import.meta.env.VITE_API_URL
```

## 📄 License
MIT License — see [LICENSE](LICENSE)

## 👩‍💻 Author
**Sneha** — [GitHub](https://github.com/Snehaa044)