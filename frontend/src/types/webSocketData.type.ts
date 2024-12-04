import {CoordType} from "./coord.type.ts";

interface PlayerState {
    snake: CoordType[];
    direction: string;
    alive: boolean;
    color: string;
}

interface GameState {
    gameState: {
        players: {[key: string]: PlayerState};
        food: CoordType
    };
    status: string;
    event: 'gameState';
}

interface DieMessage {
    event: 'died';
}


export type WebSocketDataType = DieMessage | GameState;