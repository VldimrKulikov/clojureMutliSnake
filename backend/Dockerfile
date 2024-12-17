# Этап 1: Сборка
FROM clojure:openjdk-11-lein AS build

WORKDIR /app
COPY project.clj .
RUN lein deps

COPY . .
RUN mv "$(lein uberjar | sed -n 's/^Created \(.*standalone\.jar\)/\1/p')" app-standalone.jar

# Этап 2: Создание минимального продакшн-контейнера
FROM openjdk:11-jre-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем собранное приложение из предыдущего этапа
COPY --from=build /app/app-standalone.jar /app

# Указываем порт
EXPOSE 3000

# Определяем команду запуска
CMD ["java", "-jar", "app-standalone.jar"]
