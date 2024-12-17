:- use_module(library(socket)).

% Основной predicate для запуска соединения
start_websocket_client :-
    setup_connection(Host, Port),
    write('Connected to WebSocket Server'), nl,
    communicate(Port).

% Настройка соединения
setup_connection('localhost', 8080). % Адрес сервера и порт

% Пример общения с сервером
communicate(Port) :-
    socket_connect(Port, Socket),
    write('Sending message to server...'), nl,
    send_message(Socket, 'Hello, WebSocket!'),
    read_response(Socket).

% Функция для отправки сообщений
send_message(Socket, Message) :-
    format('~w~n', [Message]),
    socket_send(Socket, Message).

% Пример обработки ответа
read_response(Socket) :-
    socket_recv(Socket, Data),
    format('Response from server: ~w~n', [Data]),
    socket_close(Socket).
