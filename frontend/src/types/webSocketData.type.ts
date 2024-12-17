import {CoordType} from "./coord.type.ts";

interface PlayerState {
    snake: CoordType[];
    direction: string;
    alive: boolean;
    color: string;
    score: number;
}

export interface GameState {
    players: {[key: string]: PlayerState};
    food: CoordType
}

interface GameStateMessage {
    event: 'gameState';
    gameState: GameState;
    status: string;
}

interface DieMessage {
    event: 'died';
}

interface ConnectMessage {
    event: 'connect';
    playerId: string;
}


export type WebSocketDataType = DieMessage | GameStateMessage | ConnectMessage;