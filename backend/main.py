# backend/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
import os
from typing import List, Optional, Dict, Any

# Ваши существующие импорты
import models, schemas, auth, database

# ✅ НОВЫЕ ИМПОРТЫ: подключаем аналитику
from backend.analytics import analyze_test_results, generate_insight
from backend.analytics.engine import TestResultStub

# Инициализация БД (безопасно: создаёт таблицы, если их нет)
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="MindMetricAI Backend")

# CORS — только с нашего домена
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# ✅ СУЩЕСТВУЮЩИЕ ЭНДПОИНТЫ (без изменений)
# ============================================

@app.get("/")
def read_root():
    return {"status": "MindMetricAI Backend is running!"}

@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = auth.get_password_hash(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/token", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

# ============================================
# ✅ ОБНОВЛЁННЫЙ ЭНДПОИНТ: /results (с аналитикой)
# ============================================

@app.post("/results")
def save_result(
    result: schemas.TestResultCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Сохраняет результат теста И возвращает аналитику + инсайт.
    Возвращает: { ...поля_результата..., "metrics": {...}, "insight": "..." }
    """
    # 1. Сохраняем результат в БД (как было)
    new_result = models.TestResult(
        user_id=current_user.id,
        test_type=result.test_type,
        score=result.score,
        accuracy=result.accuracy,
        # Если в модели есть поле reaction_time_ms — раскомментируйте:
        # reaction_time_ms=result.reaction_time_ms if hasattr(result, 'reaction_time_ms') else None,
    )
    db.add(new_result)
    db.commit()
    db.refresh(new_result)
    
    # 2. ✅ НОВОЕ: Получаем историю пользователя для контекстной аналитики
    #    Берём последние 20 результатов того же типа теста
    history = db.query(models.TestResult)\
        .filter(
            models.TestResult.user_id == current_user.id,
            models.TestResult.test_type == result.test_type
        )\
        .order_by(models.TestResult.timestamp.desc())\
        .limit(20)\
        .all()
    
    # 3. ✅ НОВОЕ: Конвертируем записи БД в формат для аналитики
    stubs = [
        TestResultStub(
            score=r.score,
            reaction_time_ms=getattr(r, 'reaction_time_ms', 0) or 0,  # Защита, если поля нет
            test_type=r.test_type,
            timestamp=r.timestamp or datetime.utcnow()
        )
        for r in history
    ]
    
    # 4. ✅ НОВОЕ: Считаем метрики и генерируем инсайт
    metrics = analyze_test_results(stubs)
    insight = generate_insight(metrics, result.test_type)
    
    # 5. ✅ НОВОЕ: Возвращаем расширенный ответ
    #    FastAPI автоматически сериализует этот dict в JSON
    return {
        # Поля результата (совместимость с schemas.TestResultOut)
        "id": new_result.id,
        "user_id": new_result.user_id,
        "test_type": new_result.test_type,
        "score": new_result.score,
        "accuracy": new_result.accuracy,
        "timestamp": new_result.timestamp.isoformat() if new_result.timestamp else None,
        # ✅ Новые поля с аналитикой
        "metrics": metrics,
        "insight": insight
    }

# ============================================
# ✅ НОВЫЙ ЭНДПОИНТ: Получение аналитики по истории
# ============================================

@app.get("/results/insights")
def get_insights(
    test_type: Optional[str] = None,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Возвращает сводную аналитику по истории тестов пользователя.
    ?test_type=reaction — опциональная фильтрация по типу теста
    """
    # Запрашиваем историю
    query = db.query(models.TestResult).filter(
        models.TestResult.user_id == current_user.id
    )
    if test_type:
        query = query.filter(models.TestResult.test_type == test_type)
    
    history = query.order_by(models.TestResult.timestamp.desc()).limit(50).all()
    
    if not history:
        return {
            "message": "Нет данных для анализа. Пройдите хотя бы один тест.",
            "metrics": None,
            "insight": None
        }
    
    # Конвертируем в stubs
    stubs = [
        TestResultStub(
            score=r.score,
            reaction_time_ms=getattr(r, 'reaction_time_ms', 0) or 0,
            test_type=r.test_type,
            timestamp=r.timestamp or datetime.utcnow()
        )
        for r in history
    ]
    
    # Считаем аналитику
    metrics = analyze_test_results(stubs)
    insight = generate_insight(metrics, test_type or "overall")
    
    return {
        "test_type_filter": test_type,
        "total_tests": len(history),
        "metrics": metrics,
        "insight": insight
    }

# ============================================
# ✅ СУЩЕСТВУЮЩИЙ ЭНДПОИНТ: Получение сырых результатов
# ============================================

@app.get("/results", response_model=List[schemas.TestResultOut])
def get_results(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return db.query(models.TestResult)\
             .filter(models.TestResult.user_id == current_user.id)\
             .order_by(models.TestResult.timestamp.desc())\
             .all()
