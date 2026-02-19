# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Revu AI is a product review aggregation app that ranks products by AI-driven sentiment analysis of reviews from public sources (Amazon, eBay, TikTok, Etsy, etc.). See `revu_app_prompt.md` for the full product vision.

## Architecture

**Monorepo with two independent services:**
- `frontend/` — React 19 + TypeScript, built with Vite 7
- `backend/` — Python Flask API with CORS enabled

The frontend runs on `localhost:5173`, the backend on `localhost:5000`. API routes are prefixed with `/api/`.

## Commands

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py              # runs dev server on :5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                # Vite dev server on :5173
npm run build              # tsc -b && vite build
npm run lint               # eslint .
npm run preview            # preview production build
```

## Backend Configuration

- Copy `backend/.env.example` to `backend/.env` for environment variables
- Flask runs in debug mode by default (`FLASK_DEBUG=1`)
- Dependencies: Flask, flask-cors, python-dotenv

## Frontend Configuration

- ESLint configured with TypeScript-ESLint, React Hooks, and React Refresh plugins (`eslint.config.js`)
- TypeScript strict mode enabled via `tsconfig.app.json`
- Entry point: `frontend/src/main.tsx` → `App.tsx`

## Git / Version Control

- **Use Graphite CLI (`gt`) instead of `git` for all branch, commit, and PR operations.**
- Use `gt create` to create stacked branches and PRs
- Use `gt commit` to commit changes
- Use `gt submit` to push and create/update PRs
- Use `gt log` to view the stack
- Only fall back to `git` for operations Graphite doesn't support (e.g., `git init`, `git remote`)
- **NEVER commit `.claude/commands/` or `.claude/settings.local.json`** — these are local-only files. Always keep them unstaged.

### Branching Strategy

- **`frontend-develop`** — Long-lived development branch for all frontend work. All frontend feature branches should be created off this branch.
- **`backend-develop`** — Long-lived development branch for all backend work. All backend feature branches should be created off this branch.
- **`master`** — Stable main branch. `frontend-develop` and `backend-develop` merge into `master` when ready.
- When creating a new feature branch, always branch off the correct develop branch:
  - Frontend changes → branch off `frontend-develop`
  - Backend changes → branch off `backend-develop`
  - Full-stack changes → coordinate across both develop branches
