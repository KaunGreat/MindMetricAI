
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
import os
from typing import List
from pydantic import BaseModel
import models, schemas, auth, database
import google.generativeai as genai

# Initialize database
models.Base.metadata.create_all(bind=database.engine)

# Configure Gemini
GOOGLE_API_KEY = os.getenv("API_KEY") # Shared with frontend logic
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

app = FastAPI(title="MindMetricAI Advanced Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/neural/analyze")
async def analyze_user_performance(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    """
    Эндпоинт 'зашитого в бэкэнд' ИИ для глубокого анализа истории пользователя.
    """
    results = db.query(models.TestResult).filter(models.TestResult.user_id == current_user.id).all()
    if not results:
        return {"status": "insufficient_data"}

    # Подготовка данных для модели
    history_str = "\n".join([f"Test: {r.test_type}, Score: {r.score}, Time: {r.timestamp}" for r in results[-20:]])
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"As a neuro-analyst, review this user data and provide a high-level summary of their cognitive stability:\n{history_str}"
        response = model.generate_content(prompt)
        
        return {
            "analysis": response.text,
            "session_count": len(results),
            "archetype": results[-1].archetype if results else "Adept"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/")
def read_root():
    return {"status": "MindMetricAI Backend is running!"}

# ... rest of the existing FastAPI endpoints (register, token, etc.) remain as provided in your file list
