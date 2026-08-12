# Deterministic safety boundary

MARKOV LIFE OS does not use AI providers, LLMs, cloud OCR, API keys or server-side inference. The product uses a local, versioned rules engine.

## Safety principles

- код считает производные показатели, но не ставит диагноз;
- missing data остаётся unknown, а не «плохим» или «нормальным»;
- correlation is not causation;
- laboratory reference ranges remain laboratory-specific;
- every recommendation exposes facts, rule ID, evidence strength, confidence, burden and next check;
- health recommendations are navigation and habit support, not treatment or emergency care.

При признаках неотложного состояния пользователь должен обратиться за экстренной помощью. Автоматические результаты не заменяют врача.
