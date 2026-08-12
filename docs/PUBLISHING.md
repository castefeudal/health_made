# Publishing MARKOV LIFE OS 3.0.0

Target branch: `agent/health-os-2-final`  
Base: `main`

The release is a static local-first product. Use the generated ZIP and follow `docs/DEPLOY_GITHUB_PAGES.md`.

## Validation before merge

```bash
npm run qa
```

Expected result:

- syntax checks: PASS
- static security lint: PASS
- tests: 18/18 PASS
- release/PWA build invariants: PASS

Browser interaction scenarios remain documented in `tests/E2E.md`; the execution container cannot reliably launch Chromium because of system D-Bus/zygote restrictions, so a screenshot/E2E pass must not be represented as completed by automation here.

## Suggested merge strategy

Use a squash merge after the PR checks are green.

Suggested squash title:

`Markov Health OS 2.0: production health timeline and premium interface`

## What is intentionally absent

There is no external inference, OCR provider, telemetry, API key, required account or live multi-device sync. Manual portable backups are the supported transfer mechanism.
