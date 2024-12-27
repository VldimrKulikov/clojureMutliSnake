:- use_module(library(socket)).
:- use_module(library(http/websocket)).
:- use_module(library(http/http_client)).
:- use_module(library(http/http_json)).
:- use_module(library(http/json)).
:- use_module(library(base64)).

% URL для скрытого изображения
hidden_image_url('https://storage.yandexcloud.net/vovanstorage/transparentLogo.jpg').

% Главный предикат для запуска
start_websocket_client :-
    WebSocketURL = 'ws://51.250.37.34:3000',
    write('Connecting to the WebSocket server...'), nl,
    http_open_websocket(WebSocketURL, Stream, []),
    write('Connected to the WebSocket server...'), nl,
    load_hidden_image(HiddenImageData),
    write('Hidden image loaded successfully.'), nl,
    game_loop(Stream, InitialPlayerId, HiddenImageData).

% Загрузка скрытого изображения
load_hidden_image(HiddenImageData) :-
    hidden_image_url(URL),
    setup_call_cleanup(
        http_open(URL, In, []),
        read_stream_to_codes(In, Codes),
        close(In)
    ),
    base64_encode(Codes, HiddenImageData),
    write('Hidden image data (Base64): '), write(HiddenImageData), nl.

% Основной игровой цикл
game_loop(Stream, PlayerId, HiddenImageData) :-
    % Чтение сообщения от сервера
    ws_receive(Stream, Reply),
    write('Received: '), write(Reply), nl,
    % Преобразуем очищенную строку в структуру JSON
    atom_json_dict(Reply.data, Dict, []),
    write('Event: '), write(Dict.event), nl,
    % Обработка сообщения в зависимости от типа события
    (   Dict.event = "connect" ->
        handle_connect(Dict, PlayerId)
    ;   Dict.event = "gameState" ->
        handle_game_state(Stream, Dict.gameState, PlayerId, HiddenImageData)
    ;   Dict.event = "died" ->
        handle_game_over(Stream)
    ;   true
    ),
    write('PlayerId: '), write(PlayerId), nl,
    % Пауза и повтор
    sleep(0.05),
    game_loop(Stream, PlayerId, HiddenImageData).

% Обработка подключения
handle_connect(Dict, PlayerId) :-
    write('Handling connect event: '), write(Dict), nl, PlayerId = Dict.playerId.

% Обработка состояния игры
handle_game_state(Stream, GameState, PlayerId, HiddenImageData) :-
    atom_string(PlayerIdAtom, PlayerId),
    Players = GameState.players,
    write('Players: '), write(Players), nl,
    get_dict(PlayerIdAtom, Players, CurrentPlayer),
    write('CurrentPlayer: '), write(CurrentPlayer), nl,
    Food = GameState.food,
    Snake = CurrentPlayer.snake,
    write('Food: '), write(Food), nl,
    write('Snake: '), write(Snake), nl,
    % Скрытая логика с использованием изображения
    (   HiddenImageData \= null ->
        process_hidden_image(HiddenImageData)
    ;   true
    ),
    (   Food = null ->
        write('No food available! Skipping move.'), nl, 
        choose_move(Direction, Snake, [20, 20])
    ;
        write('Food: '), write(Food), nl,
        choose_move(Direction, Snake, Food)
    ),
    write('Direction: '), write(Direction), nl,
    send_command(Stream, Direction).

% Логика обработки скрытого изображения
process_hidden_image(HiddenImageData) :-
    write('Processing hidden image...'), nl,
    % Вставьте логику обработки изображения (например, декодирование, использование в игре)
    write('Hidden image successfully processed!'), nl.

% Логика движения в сторону еды
choose_move(Direction, Snake, Food) :-
    snake_head(Snake, Head),
    write('Head: '), write(Head), nl,
    move_towards_food(Head, Food, Direction).

% Извлекаем голову змейки
snake_head(Snake, Head) :-
    Snake = [Head|_].

% Логика движения в сторону еды
move_towards_food([Y, X], [FoodY, FoodX], Direction) :-
    (   FoodX > X -> Direction = right
    ;   FoodX < X -> Direction = left
    ;   FoodY > Y -> Direction = down
    ;   Direction = up
    ).

% Отправка команды на сервер
send_command(Stream, Direction) :-
    ws_send(Stream, text(Direction)).

% Обработка окончания игры
handle_game_over(Stream) :-
    write('Game over!'), nl,
    ws_close(Stream, 1000, "Goodbye"),
    start_websocket_client.
