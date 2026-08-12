# MARKOV LIFE OS / HEALTH-MADE MAX

Приватная local-first персональная операционная система жизни: здоровье, сон, тело, тренировки, настроение, привычки, цели и продуктивность в одной временной модели.

## Быстрый запуск

```bash
python -m http.server 8000
```

Откройте `http://localhost:8000`. Аккаунт и интернет не нужны после загрузки shell.

## Что реализовано

- schema v4 с безопасной миграцией v2/v3 и safety backup;
- локальное состояние с IndexedDB mirror и portable JSON/.mhos backup;
- deterministic rules/recommendation engine с прозрачным score, evidence и explainability;
- dashboard 80/20, рекомендации, timeline, labs, Doctor Brief, Quick Add;
- сон, тело, тренировки, стресс, настроение, цели, задачи, демо-профиль;
- Big Five scoring как описательный модуль;
- PWA/offline shell, responsive UI, keyboard shortcuts и profile isolation.

## Tests

```bash
npm install
npm run qa
npm run release
```

## GitHub Pages

Инструкция: [`docs/DEPLOY_GITHUB_PAGES.md`](docs/DEPLOY_GITHUB_PAGES.md).

## Приватность и ограничения

Данные по умолчанию остаются в браузере; runtime не отправляет их наружу и не содержит telemetry. Рекомендации не являются диагнозом, лечением или экстренной помощью. Автоматический разбор сложных сканированных документов намеренно не имитируется: используйте ручной ввод или проверяемый CSV/text import.

## Архитектура

Подробности: [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md), [`docs/MIGRATION_FROM_HEALTH_OS.md`](docs/MIGRATION_FROM_HEALTH_OS.md), [`docs/EVIDENCE_SOURCES.md`](docs/EVIDENCE_SOURCES.md).
