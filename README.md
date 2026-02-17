# revu-ai

A full-stack application with React TypeScript frontend and Python Flask backend.

## Project Structure

```
revu-ai/
├── frontend/     # React TypeScript (Vite)
├── backend/      # Python Flask API
└── README.md
```

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The backend runs on http://localhost:5000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on http://localhost:5173

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/hello` - Hello endpoint
