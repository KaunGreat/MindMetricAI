# backend/analytics/engine.py
from typing import List, Dict, Any
from datetime import datetime

# Тип данных, который ожидаем от фронтенда/БД
class TestResultStub:
    def __init__(self, score: float, reaction_time_ms: float, test_type: str, timestamp: datetime):
        self.score = score
        self.reaction_time_ms = reaction_time_ms
        self.test_type = test_type
        self.timestamp = timestamp

def analyze_test_results(results: List[TestResultStub]) -> Dict[str, Any]:
    """Считает базовые метрики из списка результатов"""
    if not results:
        return {"avg_score": 0, "avg_reaction": 0, "best_score": 0, "count": 0}

    scores = [r.score for r in results]
    reactions = [r.reaction_time_ms for r in results]

    return {
        "avg_score": round(sum(scores) / len(scores), 2),
        "avg_reaction": round(sum(reactions) / len(reactions), 1),
        "best_score": round(max(scores), 2),
        "count": len(results),
        "latest_reaction": round(reactions[-1], 1)
    }

def generate_insight(metrics: Dict[str, Any], test_type: str) -> str:
    """Генерирует текстовый инсайт на основе правил (бесплатно)"""
    avg_reaction = metrics.get("avg_reaction", 500)
    avg_score = metrics.get("avg_score", 50)
    count = metrics.get("count", 0)

    if count < 3:
        return "Пройдите ещё минимум 2 теста, чтобы мы могли построить точную картину ваших когнитивных показателей."

    # Правила для скорости реакции
    if avg_reaction < 250:
        reaction_note = "Ваша скорость реакции отличная. Попробуйте добавить двойные задачи для усложнения."
    elif avg_reaction < 400:
        reaction_note = "Стабильная скорость. Регулярные тренировки помогут сократить время отклика на 10-15%."
    else:
        reaction_note = "Обратите внимание на отдых и гидратацию. Попробуйте дыхательные практики перед тестами."

    # Правила для точности
    if avg_score >= 90:
        accuracy_note = "Высокая точность: ваш фокус на уровне."
    elif avg_score >= 70:
        accuracy_note = "Хороший баланс скорости и точности."
    else:
        accuracy_note = "Рекомендуем снизить темп и сосредоточиться на точности, а не на скорости."

    return f"🧠 {reaction_note}\n🎯 {accuracy_note}\n📊 Всего тестов: {count}"
