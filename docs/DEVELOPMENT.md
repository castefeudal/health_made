# Development guide

Navigation/UI: `src/app/main.js`. Schema/migration: `src/v3/schema.js`. Storage/backup: `src/v3/storage.js`, `src/core/storage/indexed-db.js`, `src/v3/crypto.js`. Derived metrics: `src/engine/derived.js`. Rules/evidence: `src/engine/rules.js`. Scoring: `src/engine/recommendation-engine.js`. Recommendation UI: `src/ui/recommendations.js`. Domain registry: `src/core/domain-registry.js`. Offline shell: `sw.js`.

## Запуск

```bash
python -m http.server 8000
```

## QA и release

```bash
npm run qa
npm run release
```

Runtime не требует `node_modules`; npm нужен только для проверок и сборки архива.

## Новая рекомендация

Добавьте source в `SOURCES`, затем rule с безопасным predicate `when`, атомарными полями `observation`, `explanation`, `recommendation`, `facts`, `nextCheck` и ссылкой на source ID. Не используйте `eval`, динамический код или вывод причинности из одной корреляции.
