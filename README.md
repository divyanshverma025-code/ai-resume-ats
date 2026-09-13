# AI Resume ATS — React + FastAPI final architecture

## Project

The original Streamlit UI has been replaced by a React/Vite frontend.
The Python backend remains FastAPI and retains the existing NLP/ML analysis pipeline.

```text
ai-resume-ats/
├── backend/
├── frontend/
├── jupyter notebooks/
├── requirements.txt
├── render.yaml
├── .env.example
└── README.md
```

## Local setup

### 1. Backend environment

From the repository root:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_md
```

Create `.env` from `.env.example` and add your real Supabase/Groq values.

### 2. Start FastAPI

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Health:
`http://localhost:8000/api/v1/health`

Swagger:
`http://localhost:8000/docs`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

React:
`http://localhost:5173`

Create `frontend/.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLIC_KEY
VITE_API_BASE_URL=
```

The local Vite proxy sends `/api` to FastAPI on port 8000.

### 4. Production

- Deploy the FastAPI service using `render.yaml`.
- Deploy `frontend/` as a Vite app on Vercel.
- Set `VITE_API_BASE_URL` to the public Render API URL.
- Set `FRONTEND_URL` (or `ALLOWED_ORIGINS`) on the backend to the Vercel URL.
- Add the Vercel URL to Supabase Authentication URL/Redirect configuration.

## Secrets

Never place these in React:

- `SUPABASE_KEY`
- `SUPABASE_JWT_SECRET`
- `GROQ_API_KEY`

React only needs the Supabase public URL + public/anon key.

## API used by React

```text
POST /api/v1/analyze-resume
GET  /api/v1/history
DELETE /api/v1/history/{analysis_id}
GET  /api/v1/history/{analysis_id}/pdf
POST /api/v1/generate-pdf
GET  /api/v1/health
```

## Low-memory deployment mode

The FastAPI service is configured for small-memory hosts such as a 512 MiB Render instance. It does **not** load Sentence Transformers/PyTorch. Skill validation and JD semantic similarity use a lightweight deterministic 256-dimensional text embedder, while spaCy is lazy-loaded only when JD skill-gap analysis is requested.

This keeps the existing API/React contract intact, but semantic similarity is intentionally lighter-weight than the original transformer embedding. For higher semantic accuracy on a larger machine, the original transformer approach can be restored later.
