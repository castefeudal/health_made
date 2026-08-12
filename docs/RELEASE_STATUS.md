# MARKOV LIFE OS 3.0.0 — release status

## Implemented

- schema v4 and safe v2/v3 migration with safety backup and read-back;
- localStorage compatibility repository plus IndexedDB mirror;
- deterministic rule packs, scoring, stable output, source trace, confidence and explainability;
- dashboard, recommendations, Quick Add, labs, CSV/text review import, timeline, backup/restore and encrypted export;
- profile isolation, demo mode, Big Five module, responsive PWA and offline shell;
- zero-dependency QA and release ZIP with checksums.

## Validation

`npm run qa` passes: syntax, lint, 18 Node tests and PWA/build invariants.

Browser interaction is documented in `tests/E2E.md`; it should be run in a real browser before public deployment.

## Honest limitations

The application does not diagnose, prescribe treatment, provide emergency monitoring, interpret arbitrary scanned documents, or sync live between devices. Manual portable backups are the transfer mechanism.
