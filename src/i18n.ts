
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "header": {
        "dashboard": "Dashboard",
        "profile": "Profile",
        "insights": "AI Insights"
      },
      "auth": {
        "login_title": "Welcome Back",
        "login_subtitle": "Authenticate to access your neural metrics.",
        "login_btn": "Sign In",
        "register_title": "Initialize Profile",
        "register_subtitle": "Join the high-performance cognitive network.",
        "register_btn": "Create Account",
        "email": "Email Address",
        "password": "Password",
        "no_account": "New strategist?",
        "register_link": "Join now",
        "has_account": "Already registered?",
        "login_link": "Sign in here",
        "register_success": "Neural profile successfully initialized!",
        "redirecting": "Redirecting to login..."
      },
      "dashboard": {
        "welcome": "Welcome back, Strategist",
        "subtitle": "Ready to benchmark your cognitive performance today?",
        "title": "Cognitive Battery",
        "card_subtitle": "Select a module to begin assessment.",
        "science_title": "The Science of Performance",
        "science_text": "MindMetricAI uses neural pattern recognition and reaction speed analysis to track your mental state. Regular testing helps identify fatigue levels and optimize your high-performance windows.",
        "guide_btn": "View Analysis Guide",
        "start_session": "Start Session",
        "server_status": "Server",
        "online": "Online",
        "offline": "Offline"
      },
      "profile": {
        "title": "Neural Profile",
        "subtitle": "Historical data and cognitive achievement benchmarks.",
        "reset_data": "Reset All Data",
        "reset_confirm": "Are you sure you want to clear all your test history? This cannot be undone.",
        "personal_bests": "Personal Bests",
        "activity_history": "Activity History",
        "no_sessions": "No sessions recorded",
        "no_sessions_desc": "Start your first cognitive assessment to see your neural metrics populate here.",
        "benchmark": "Benchmark",
        "test_module": "Test Module",
        "score_performance": "Score / Performance",
        "timestamp": "Timestamp",
        "fastest_reaction": "Fastest Reaction",
        "max_spatial_span": "Max Spatial Span",
        "top_control_score": "Top Control Score",
        "ms": "ms",
        "levels": "levels",
        "ms_avg": "ms avg"
      },
      "tests": {
        "REACTION": {
          "title": "Reaction Time",
          "description": "Measure your visual response speed."
        },
        "MEMORY": {
          "title": "Spatial Span",
          "description": "Track and recall block sequences of increasing length."
        },
        "STROOP": {
          "title": "Stroop Test",
          "description": "Measure executive function and inhibitory control."
        },
        "WISCONSIN": {
          "title": "Cognitive Flexibility",
          "description": "Deduce rules and adapt to shifting requirements."
        },
        "insights": {
          "title": "Cognitive Insights",
          "description": "AI-powered analysis of your performance."
        }
      }
    }
  },
  ru: {
    translation: {
      "header": {
        "dashboard": "Дашборд",
        "profile": "Профиль",
        "insights": "AI Аналитика"
      },
      "auth": {
        "login_title": "С возвращением",
        "login_subtitle": "Авторизуйтесь для доступа к вашим данным.",
        "login_btn": "Войти",
        "register_title": "Создать профиль",
        "register_subtitle": "Присоединяйтесь к сети высокой эффективности.",
        "register_btn": "Регистрация",
        "email": "Email адрес",
        "password": "Пароль",
        "no_account": "Впервые здесь?",
        "register_link": "Создать аккаунт",
        "has_account": "Уже есть аккаунт?",
        "login_link": "Войти",
        "register_success": "Нейронный профиль успешно создан!",
        "redirecting": "Переход к логину..."
      },
      "dashboard": {
        "welcome": "С возвращением, Стратег",
        "subtitle": "Готовы проверить свои когнитивные показатели сегодня?",
        "title": "Батарея тестов",
        "card_subtitle": "Выберите модуль для начала оценки.",
        "science_title": "Наука эффективности",
        "science_text": "MindMetricAI использует распознавание нейронных паттернов и анализ скорости реакции для отслеживания вашего ментального состояния. Регулярное тестирование помогает выявить уровень усталости.",
        "guide_btn": "Руководство по анализу",
        "start_session": "Начать сессию",
        "server_status": "Сервер",
        "online": "В сети",
        "offline": "Не в сети"
      },
      "profile": {
        "title": "Нейронный Профиль",
        "subtitle": "Исторические данные и когнитивные достижения.",
        "reset_data": "Сбросить данные",
        "reset_confirm": "Вы уверены, что хотите удалить всю историю тестов? Это действие необратимо.",
        "personal_bests": "Личные рекорды",
        "activity_history": "История активности",
        "no_sessions": "Сессии не найдены",
        "no_sessions_desc": "Пройдите свой первый когнитивный тест, чтобы увидеть метрики здесь.",
        "benchmark": "Рекорд",
        "test_module": "Модуль теста",
        "score_performance": "Результат",
        "timestamp": "Время",
        "fastest_reaction": "Лучшая реакция",
        "max_spatial_span": "Макс. охват",
        "top_control_score": "Контроль внимания",
        "ms": "мс",
        "levels": "ур.",
        "ms_avg": "ср. мс"
      },
      "tests": {
        "REACTION": {
          "title": "Время реакции",
          "description": "Измерьте скорость вашего визуального отклика."
        },
        "MEMORY": {
          "title": "Пространственная память",
          "description": "Отслеживайте и вспоминайте последовательности блоков."
        },
        "STROOP": {
          "title": "Тест Струпа",
          "description": "Измерьте исполнительную функцию и самоконтроль."
        },
        "WISCONSIN": {
          "title": "Когнитивная гибкость",
          "description": "Определяйте правила и адаптируйтесь к изменениям."
        },
        "insights": {
          "title": "Когнитивный анализ",
          "description": "AI-анализ вашей производительности."
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
