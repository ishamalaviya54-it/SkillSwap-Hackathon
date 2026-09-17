# Skill Swap Platform

A beginner-friendly full-stack project for a college hackathon. The app lets students swap skills, discover peers, and request skill exchanges using a React frontend and Express + MySQL backend.

## Tech stack

- React + Vite + Bootstrap
- Node.js + Express + JWT
- MySQL
- Git version control

## Features

- User registration and login
- JWT-based auth
- Skill listing and creation
- User dashboard with peer profiles
- Basic skill swap request flow
- Beginner-friendly comments in code

## Project structure

- `backend/` - Express API and DB config
- `frontend/` - React UI
- `android/` - Native Java/XML Android app with the Home Dashboard screen

## Setup steps

1. Create a MySQL database and update backend `.env` values.
2. Run the SQL file in `backend/src/db/schema.sql`.
3. Install dependencies:
   - `npm install --prefix backend`
   - `npm install --prefix frontend`
4. Start the backend:
   - `npm --prefix backend run dev`
5. Start the frontend:
   - `npm --prefix frontend run dev`
6. Open the React app at `http://localhost:5173`

## Android Home Dashboard

Open the `android/` folder in Android Studio and run the `app` configuration. The native dashboard starts at `HomeActivity` and uses Java, Android XML, Material components, and a RecyclerView for recommended skills. From a machine with Gradle installed, the debug APK can be built with `gradle :app:assembleDebug` from the `android/` directory.

## Git commands

```bash
git init
git add .
git commit -m "Initial Skill Swap platform"
```

## Default login

Register a new user from the UI to get started.
