# MARKOV LIFE OS architecture

## Runtime

Static local-first PWA with native browser APIs and no runtime dependency installation.

## Boundaries

- `src/app/main.js`: navigation, forms and composition;
- `src/v3/schema.js`: schema v4, validation and v2/v3 migrations;
- `src/v3/storage.js`: transactional compatibility repository, safety copy and backup;
- `src/core/storage/indexed-db.js`: asynchronous IndexedDB mirror;
- `src/engine/derived.js`: transparent derived metrics;
- `src/engine/rules.js`: source registry and data-driven predicates;
- `src/engine/recommendation-engine.js`: stable hash variation, scoring, ranking and traceability;
- `src/ui/recommendations.js`: explainable recommendation cards;
- `src/v3/labs.js` and `src/v3/importers.js`: report-specific lab data and review-first imports;
- `src/modules/personality.js`: dimensional Big Five scoring;
- `sw.js`: versioned offline shell.

## Data flow

`capture → validate/normalize → profile-scoped repository transaction → derived snapshot → rule evaluation → priority score → explainable action → feedback`.

The engine never reads another profile. Missing values do not trigger negative conclusions. Recommendation output stores engine/rule versions and a snapshot hash so results are reproducible.

## Storage

Existing v2/v3 localStorage backups are migrated safely to schema v4. The compatibility repository keeps a synchronous read path for static startup and mirrors the normalized state to IndexedDB when available. JSON and encrypted `.mhos` exports remain the portable source of truth for manual device transfer.
