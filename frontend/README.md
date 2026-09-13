# React frontend

This frontend replaces the original Streamlit UI and consumes the existing FastAPI API.

## Local

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

Create `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLIC_OR_ANON_KEY
VITE_API_BASE_URL=
```

## Production

Set:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_BASE_URL=https://your-fastapi-service.example
```

Deploy this `frontend/` directory as a Vite app on Vercel.

`vercel.json` is included so BrowserRouter routes work when users refresh `/analyze`, `/history`, or `/resources`.
