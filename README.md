# Smart Resume Analyzer & Job Recommendation System

An AI-powered Full Stack Resume Analyzer & Job Recommendation Platform.

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, PDF-Parse
- **AI**: OpenRouter API (GPT models)

## Features

- **JWT Authentication** (Candidate, Recruiter, Admin)
- **AI Resume Analysis**: Upload PDF, extract skills/experience, rate resume, highlight strengths/weaknesses.
- **Job Matching**: AI-driven job recommendation explaining why you are a good fit.
- **Modern UI**: Dark mode, glassmorphism, smooth animations.

## Local Setup

### 1. Backend

```bash
cd backend
npm install
# Ensure you have .env configured with PORT, MONGODB_URI, JWT_SECRET, OPENROUTER_API_KEY
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
# Ensure you have .env configured with VITE_API_URL=http://localhost:5000/api
npm run dev
```

## Deployment (Render)

This project contains a `render.yaml` configuration at the root.

1. Connect this repo to Render via "Blueprint".
2. It will automatically detect `resume-analyzer-backend` (Web Service) and `resume-analyzer-frontend` (Static Site).
3. Provide your `MONGODB_URI`, `JWT_SECRET`, and `OPENROUTER_API_KEY` in the Render dashboard when prompted.

---
*Created by AI Agent*
