# backend/Dockerfile
FROM python:3.11-slim

# Рабочая директория
WORKDIR /app

# Установка системных зависимостей (для psycopg2)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Копируем requirements (если есть) или создаём на лету
COPY requirements.txt . 2>/dev/null || echo "requirements.txt not found, creating minimal one"
RUN if [ -f requirements.txt ]; then \
    pip install --no-cache-dir -r requirements.txt; \
    else \
    pip install --no-cache-dir fastapi uvicorn[standard] sqlalchemy psycopg2-binary pydantic python-jose[cryptography] passlib[bcrypt] python-multipart; \
    fi

# Копируем весь бэкенд
COPY . .

# Порт, который слушает приложение
EXPOSE 8000

# Команда запуска: Gunicorn + Uvicorn workers (оптимально для Render Free)
CMD ["gunicorn", "main:app", \
     "--workers", "1", \
     "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:8000", \
     "--timeout", "120", \
     "--keep-alive", "5"]
