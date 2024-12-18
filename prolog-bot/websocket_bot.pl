:- use_module(library(socket)).

% Главный предикат для запуска
start_websocket_client :-
    getenv('WEBSOCKET_SERVER_HOST', Host),
    getenv('WEBSOCKET_SERVER_PORT', Port),
    setup_connection(Host, Port),
    socket_client(Host, Port).

setup_connection(Host, Port) :-
    format('Trying to connect to ~w:~w~n', [Host, Port]),
    tcp_connect(Stream, Host:Port),
    format('Connected successfully to ~w:~w~n', [Host, Port]).

send_message(Stream) :-
    tcp_write(Stream, "Hello, Server!"),
    tcp_flush(Stream),
    format('Message sent to server~n'),
    tcp_close(Stream).