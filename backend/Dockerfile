# Используем базовый образ с Java
FROM openjdk:11-jdk-slim

# Устанавливаем Leiningen
RUN apt-get update && apt-get install -y curl && \
    curl -o /usr/local/bin/lein https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein && \
    chmod +x /usr/local/bin/lein

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем проект в контейнер
COPY . /app

# Загружаем зависимости проекта
RUN lein deps

# Опционально: Собираем проект, если необходимо
RUN lein compile

# Открываем порт, если сервер запускается на 3000
EXPOSE 3000

# Запускаем сервер или указываем, как запускать приложение
CMD ["lein", "run"]
