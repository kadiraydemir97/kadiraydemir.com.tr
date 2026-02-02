import React from 'react';
import { Flag, Bomb } from 'lucide-react';
import { Cell, Difficulty, DifficultyConfig, NUMBER_COLORS } from './MinesweeperTypes';

interface MinesweeperGridProps {
    grid: Cell[][];
    config: DifficultyConfig;
    handleLeftClick: (row: number, col: number) => void;
    handleRightClick: (e: React.MouseEvent, row: number, col: number) => void;
    cellSize: string;
    difficulty: Difficulty;
}

export const MinesweeperGrid = React.memo(({
    grid,
    config,
    handleLeftClick,
    handleRightClick,
    cellSize,
    difficulty
}: MinesweeperGridProps) => {
    return (
        <div
            className="grid gap-[1px] bg-gray-400 border-4 border-gray-600"
            style={{
                gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
            }}
        >
            {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <button
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleLeftClick(rowIndex, colIndex)}
                        onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                        className={`
                            ${cellSize}
                            flex items-center justify-center font-bold
                            transition-all
                            ${cell.state === 'hidden'
                                ? 'bg-gray-500 hover:bg-gray-400 shadow-inner'
                                : cell.state === 'flagged'
                                    ? 'bg-gray-500'
                                    : cell.isMine
                                        ? 'bg-red-500'
                                        : 'bg-gray-200'
                            }
                        `}
                    >
                        {cell.state === 'flagged' && (
                            <Flag className="text-ubuntu-orange" size={difficulty === 'hard' ? 12 : 16} />
                        )}
                        {cell.state === 'revealed' && cell.isMine && (
                            <Bomb className="text-white" size={difficulty === 'hard' ? 12 : 16} />
                        )}
                        {cell.state === 'revealed' && !cell.isMine && cell.neighborMines > 0 && (
                            <span className={NUMBER_COLORS[cell.neighborMines]}>
                                {cell.neighborMines}
                            </span>
                        )}
                    </button>
                ))
            )}
        </div>
    );
});
