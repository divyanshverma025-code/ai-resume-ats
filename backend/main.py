import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.core.config import (
    ALLOWED_ORIGINS,
    APP_DESCRIPTION,
    APP_TITLE,
    APP_VERSION,
    SPACY_MODEL_PRIMARY,
    SPACY_MODEL_SECONDARY,
)
from backend.api.routes import router

logger = logging.getLogger("ats_resume_scorer")


def _load_nlp_model():
    import spacy

    try:
        logger.info("Loading spaCy model: %s", SPACY_MODEL_PRIMARY)
        return spacy.load(SPACY_MODEL_PRIMARY)
    except OSError:
        logger.warning(
            "%s not found — falling back to %s",
            SPACY_MODEL_PRIMARY,
            SPACY_MODEL_SECONDARY,
        )
        return spacy.load(SPACY_MODEL_SECONDARY)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Keep startup light for small Render instances.

    The previous version loaded spaCy and SentenceTransformer at startup, which
    exceeded the 512 MiB Render free-tier memory limit. We now create the tiny
    embedding backend immediately and defer spaCy until a JD comparison actually
    needs it.
    """
    logger.info("Starting ATS Resume Analyzer API...")

    from backend.services.lightweight_embedder import DEFAULT_EMBEDDER

    app.state.embedder = DEFAULT_EMBEDDER
    app.state.nlp = None
    logger.info("Using lightweight in-process text embeddings (256 dimensions).")
    logger.info("spaCy is lazy-loaded only for JD skill-gap analysis.")
    logger.info("API startup complete.")

    yield

    # Release references on shutdown.
    app.state.nlp = None
    app.state.embedder = None
    logger.info("Shutting down the API...")


def get_nlp(request):
    if getattr(request.app.state, "nlp", None) is None:
        request.app.state.nlp = _load_nlp_model()
        logger.info("spaCy model loaded on demand.")
    return request.app.state.nlp


app = FastAPI(
    title=APP_TITLE,
    description=APP_DESCRIPTION,
    version=APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
async def root():
    return {
        "name": "ATS Resume Analyzer API",
        "version": APP_VERSION,
        "endpoints": {
            "POST /api/v1/analyze-resume": "Analyze a resume",
            "GET /api/v1/history": "Get user history",
            "DELETE /api/v1/history/{analysis_id}": "Delete a history entry",
            "GET /api/v1/health": "Health check",
            "POST /api/v1/generate-pdf": "Generate PDF report from data",
            "GET /api/v1/history/{analysis_id}/pdf": "Generate PDF for a saved analysis",
        },
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
