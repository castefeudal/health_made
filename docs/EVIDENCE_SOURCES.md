# Локальная evidence-base

Источники хранятся в `src/engine/rules.js` с ID, годом, URL, уровнем доказательности и ограничениями. Runtime ничего не загружает.

| ID | Тема | Уровень | Ограничение |
| --- | --- | --- | --- |
| `sleep.guidance` | длительность сна взрослых | Strong | population guidance, не диагноз |
| `activity.guidance` | физическая активность | Strong | широкий ориентир |
| `habit.formation` | формирование привычек | Moderate | время сильно различается |
| `personality.big-five` | Big Five | Moderate | размерностное описание, не диагноз |

Evidence strength не равна confidence applicability: engine рассчитывает уверенность отдельно из доказательности, полноты данных, размера выборки и персональной релевантности.
