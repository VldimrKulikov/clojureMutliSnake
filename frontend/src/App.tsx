import {Map} from "./components/Map.tsx";
import {useCallback, useEffect, useState} from "react";
import {SnakeType} from "./types/snake.type.ts";
import {WebSocketDataType} from "./types/webSocketData.type.ts";
import {CoordType} from "./types/coord.type.ts";
import {DiedModal} from "./components/DiedModal.tsx";

function App() {
    const [snakes, setSnakes] = useState<SnakeType[]>([]);
    const [apple, setApple] = useState<CoordType | undefined>(undefined);
    const [openModal, setOpenModal] = useState(false);
    const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

    const handleWebSocketMessage = useCallback((event: MessageEvent) => {
        try {
            const data: WebSocketDataType = JSON.parse(event.data);

            switch (data.event) {
                case "gameState": {
                    setApple(data.gameState.food)
                    const players = Object.entries(data.gameState.players);
                    const updatedSnakes = players
                        .filter(([, player]) => player.alive)
                        .map(([, player]) => ({
                            coords: player.snake || [],
                            color: player.color,
                        }));

                    setSnakes(updatedSnakes);
                    break
                }
                case "died": {
                    webSocket?.close();
                    setOpenModal(true);
                    break
                }
                default: {
                    console.log('Real-time update:', data);
                }
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    }, []);

    const handleKeydown = useCallback((socket: WebSocket) => {
        return (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                    return socket.send('up');
                case 'ArrowDown':
                    return socket.send('down');
                case 'ArrowLeft':
                    return socket.send('left');
                case 'ArrowRight':
                    return socket.send('right');
            }
        }
    }, [])

    const openWebSocket = useCallback(() => {
        const socket = new WebSocket('ws://192.168.1.64:3000');
        setWebSocket(socket)
        socket.onopen = () => {
            window.addEventListener("keydown", handleKeydown(socket));
        };

        socket.onmessage = handleWebSocketMessage;

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.onclose = () => {
            window.removeEventListener("keydown", handleKeydown(socket));
            console.log('WebSocket connection closed');
        };
        return socket;
    }, [handleKeydown, handleWebSocketMessage])

    useEffect(() => {
        const socket = openWebSocket();

        return () => {
            socket.close();
        };
    }, [openWebSocket]);

    return (
        <>
            <Map snakes={snakes} apple={apple}/>
            <DiedModal
                open={openModal}
                onSubmit={() => {
                    setOpenModal(false)
                    openWebSocket()
                }}
                onClose={() => setOpenModal(false)}
            />
        </>
    )
}

export default App
