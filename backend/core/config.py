import os
from pathlib import Path

try:
    from dotenv import load_dotenv
    _ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
    load_dotenv(_ENV_PATH)
except ImportError:
    pass

APP_TITLE = "ATS RESUME ANALYZER API"
APP_VERSION = "2.0.0"
APP_DESCRIPTION = "Analyse resumes against job description using NLP + ML"

_DEFAULT_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://appapppy-ktwxupi73vqhjzweksze9d.streamlit.app",
]

_configured_origins = [
    x.strip() for x in os.getenv("ALLOWED_ORIGINS", "").split(",") if x.strip()
]
_frontend_url = os.getenv("FRONTEND_URL", "").strip()
if _frontend_url:
    _configured_origins.append(_frontend_url)

ALLOWED_ORIGINS = list(dict.fromkeys(
    origin.rstrip("/")
    for origin in (_DEFAULT_ALLOWED_ORIGINS + _configured_origins)
))

MAX_FILE_SIZE_MB = 5
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

SUPPORTED_MIME_TYPES = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
}
SUPPORTED_EXTENSIONS = {".pdf", ".doc", ".docx"}

SPACY_MODEL_PRIMARY = os.getenv("SPACY_MODEL_PRIMARY", "en_core_web_sm")
SPACY_MODEL_SECONDARY = os.getenv("SPACY_MODEL_SECONDARY", "en_core_web_sm")
SENTENCE_TRANSFORMER_MODEL = os.getenv(
    "SENTENCE_TRANSFORMER_MODEL", "lightweight-hash-256"
)

SCORE_WEIGHTS = {
    "formatting": 20,
    "keywords": 25,
    "content": 25,
    "skill_validation": 15,
    "ats_compatibility": 15,
}

JD_KEYWORD_WEIGHT = 0.6
JD_SEMANTIC_WEIGHT = 0.4

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

# Low-memory deployment:
# SentenceTransformer/PyTorch is intentionally not loaded in the free-tier path.
LOW_MEMORY_MODE = os.getenv("LOW_MEMORY_MODE", "true").lower() == "true"
