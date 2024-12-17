import {Map} from "./components/Map.tsx";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {GameState, WebSocketDataType} from "./types/webSocketData.type.ts";
import {DiedModal} from "./components/DiedModal.tsx";
import {Score} from "./components/Score.tsx";
import debounce from "debounce";

function App() {
    const [gameState, setGameState] = useState<GameState>();
    const [openModal, setOpenModal] = useState(false);
    const webSocket = useRef<WebSocket>();
    const [playerId, setPlayerId] = useState<string | null>(null);
    
    const score = useMemo(() => {
        if (!playerId) return 0;
        return gameState?.players[playerId]?.score || 0
    }, [gameState, playerId]);


    const handleWebSocketMessage = useCallback((event: MessageEvent) => {
        try {
            const data: WebSocketDataType = JSON.parse(event.data);

            switch (data.event) {
                case "connect": {
                    setPlayerId(data.playerId)
                    break
                }
                case "gameState": {
                    setGameState(data.gameState);
                    break
                }
                case "died": {
                    webSocket?.current?.close();
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
        const handler = (event: KeyboardEvent) => {
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
        return debounce(handler, 40)
    }, [])

    const openWebSocket = useCallback(() => {
        const socket = new WebSocket('ws://192.168.1.64:3000');
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
        webSocket.current = socket
        return socket
    }, [handleKeydown, handleWebSocketMessage])

    useEffect(() => {
        const websocket = openWebSocket();
        return () => websocket.close();
    }, [openWebSocket]);

    return (
        <div className={'h-screen w-full flex flex-col items-center justify-center gap-6'}>
            <Score score={score}/>
            <Map gameState={gameState}/>
            <DiedModal
                open={openModal}
                onSubmit={() => {
                    setOpenModal(false)
                    openWebSocket()
                }}
                onClose={() => setOpenModal(false)}
            />
        </div>
    )
}

export default App
