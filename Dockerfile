FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PYTHONHASHSEED=0

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       build-essential \
       libmagic1 \
       libcairo2 \
       libpango-1.0-0 \
       libpangoft2-1.0-0 \
       libgdk-pixbuf-2.0-0 \
       libffi8 \
       shared-mime-info \
       fonts-dejavu \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt ./
RUN pip install --upgrade pip \
    && pip install -r requirements.txt \
    && python -m spacy download en_core_web_sm

COPY backend ./backend
COPY frontend ./frontend
COPY .env.example ./.env.example

EXPOSE 8000

CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
