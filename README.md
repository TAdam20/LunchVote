# LunchVote

LunchVote is a small full-stack web app for office teams to decide where to order lunch.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Auth: JWT
- Storage: JSON files for demo purposes

## Features

- Login with JWT-based authentication
- Protected frontend routes
- Create, update, delete, and list lunch polls
- Vote on poll options
- Live-style results page with progress bars

## Project structure

```text
client/   React frontend
server/   Express backend
```

## Local setup

### 1. Start the backend

```bash
cd server
cp .env.example .env
npm install
npm start
```

Set `JWT_SECRET` in `server/.env` before starting the server.

### 2. Start the frontend

```bash
cd client
npm install
npm run dev
```

The frontend runs on Vite's default port and talks to the backend on `http://localhost:5000`.
