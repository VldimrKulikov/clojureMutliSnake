# Используем образ SWI-Prolog
FROM swipl:latest

# Копируем код бота в контейнер
WORKDIR /usr/src/app
COPY ./websocket_bot.pl .

# Команда для запуска клиента
CMD ["swipl", "-g", "start_websocket_client", "websocket_bot.pl"]
