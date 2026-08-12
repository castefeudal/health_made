# Миграция концепций Health-OS → MARKOV LIFE OS

MARKOV LIFE OS использует Health-OS как источник продуктовых идей, но не переносит его AI/agent runtime.

| Health-OS | MARKOV LIFE OS |
| --- | --- |
| agents | versioned deterministic rule packs |
| skills | локальные пользовательские workflows и Quick Add |
| shared frameworks | `src/engine/derived.js` + rule registry |
| specialist registry | domain registry в `src/core/domain-registry.js` |
| Data/ | IndexedDB mirror + portable JSON/.mhos backup |
| consilium | priority scoring и explainability |
| wiki graph | timeline and source trace |
| evidence-base.md | `src/engine/rules.js` local source registry |
| goals | goals + tasks + feedback collections |
| mental journal | mood, stress and journals |
| costs | finance collection |
| doctors | labs, symptoms, timeline and Doctor Brief |
| context | events, notes and profile constraints |

В итоговом runtime нет внешнего inference, API key, обязательного backend, telemetry или сетевой отправки пользовательских данных. Рекомендации строятся как `raw records → derived metrics → registered rule → transparent priority → action`.

Schema v2 и v3 мигрируются в v4. При миграции создаётся safety backup, схема валидируется до и после преобразования, затем выполняется read-back; при доступности браузера состояние также зеркалируется в IndexedDB.
