# Используем образ SWI-Prolog
FROM swi-prolog:latest

# Копируем код бота в контейнер
WORKDIR /usr/src/app
COPY ./websocket_bot.pl .

# Опционально: устанавливаем зависимости, если нужно
RUN apt-get update && apt-get install -y netcat

# Команда для запуска клиента
CMD ["swipl", "-s", "websocket_bot.pl"]
