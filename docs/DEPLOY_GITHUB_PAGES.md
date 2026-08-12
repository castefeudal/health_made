# GitHub Pages

1. Сделайте backup существующего репозитория.
2. Распакуйте `health-made-max-local-first.zip`.
3. Скопируйте содержимое папки release в корень репозитория.
4. Проверьте локально: `python -m http.server 8000`.
5. Выполните `git add . && git commit -m "Deploy MARKOV LIFE OS 3.0" && git push`.
6. В GitHub откройте Settings → Pages → Deploy from branch → выберите ветку и `/ (root)`.

Приложение статическое и не требует secrets, API keys, backend или базы данных. Не коммитьте личные backup-файлы.
