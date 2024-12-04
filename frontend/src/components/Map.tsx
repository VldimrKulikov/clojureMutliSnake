import {SnakeType} from "../types/snake.type.ts";
import {CoordType} from "../types/coord.type.ts";
import cn from 'classnames'

interface IMap {
    snakes: SnakeType[];
    apple?: CoordType;
}

const GRID_SIZE = 40;
export const Map = ({snakes, apple}: IMap) => {
    const cells = Array.from({length: GRID_SIZE}, (_, rowIndex) =>
        Array.from({length: GRID_SIZE}, (_, colIndex) => {
            return {x: colIndex, y: rowIndex, color: "white", isApple: false};
        })
    );

    if (apple) {
        const [x, y] = apple;
        cells[x][y].isApple = true;
    }

    snakes.forEach(snake => {
        snake.coords.forEach(([x, y]) => {
            cells[x][y].color = snake.color;
        })
    })

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            width: '600px',
            height: '600px'
        }}>
            {cells.flat().map((cell, index) => (
                <div
                    className={cn(
                        "w-full h-full border border-zinc-300",
                        cell.isApple && "scale-105"
                    )}
                    key={index}
                    style={{
                        backgroundColor: cell.isApple ? 'red' : cell.color,
                    }}
                />
            ))}
        </div>
    );
}