import { useEffect, useState, useCallback } from 'react';
import { RotateCcw, Flag, Trophy, Bomb } from 'lucide-react';
import {
    Difficulty,
    Cell,
    GameStatus,
    DIFFICULTIES,
    initializeGrid,
    placeMines,
    revealCell,
    checkWin
} from '../../utils/minesweeperLogic';

const NUMBER_COLORS = [
    '',
    'text-blue-600',
    'text-green-600',
    'text-red-600',
    'text-purple-600',
    'text-yellow-700',
    'text-pink-600',
    'text-gray-800',
    'text-gray-900',
];

export const MinesweeperGame = () => {
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [grid, setGrid] = useState<Cell[][]>([]);
    const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
    const [timer, setTimer] = useState(0);
    const [flagCount, setFlagCount] = useState(0);
    const [firstClick, setFirstClick] = useState(true);

    const config = DIFFICULTIES[difficulty];

    // Handle left click
    const handleLeftClick = useCallback((row: number, col: number) => {
        if (gameStatus === 'won' || gameStatus === 'lost') return;

        setGrid(prevGrid => {
            // Optimization: check flag before doing any heavy lifting
            if (prevGrid[row][col].state === 'flagged') return prevGrid;

            let currentGrid = prevGrid;

            // First click - place mines
            if (firstClick) {
                // placeMines returns a new deep copy with mines placed
                currentGrid = placeMines(currentGrid, row, col, config);
                setFirstClick(false);
                setGameStatus('playing');
            }

            const cell = currentGrid[row][col];

            if (cell.isMine) {
                // Game over - reveal all mines
                // Create a new grid for the game over state
                const newGrid = currentGrid.map(r =>
                    r.map(c => ({
                        ...c,
                        state: c.isMine ? 'revealed' : c.state,
                    }))
                );
                setGameStatus('lost');
                return newGrid;
            }

            // revealCell returns a new deep copy if changes are made, or the original grid if not
            const newGrid = revealCell(currentGrid, row, col, config);

            // Check win on the new grid
            if (checkWin(newGrid, config)) {
                setGameStatus('won');
            }

            return newGrid;
        });
    }, [gameStatus, firstClick, config]);

    // Handle right click (flag)
    const handleRightClick = useCallback((e: React.MouseEvent, row: number, col: number) => {
        e.preventDefault();
        if (gameStatus === 'won' || gameStatus === 'lost') return;

        setGrid(prevGrid => {
            const cell = prevGrid[row][col];
            if (cell.state === 'revealed') return prevGrid;

            // Shallow copy rows, copy changed cell
            const newGrid = prevGrid.map((r, rIndex) => {
                if (rIndex !== row) return r;
                return r.map((c, cIndex) => {
                    if (cIndex !== col) return c;
                    return { ...c };
                });
            });

            const newCell = newGrid[row][col];

            if (newCell.state === 'hidden') {
                newCell.state = 'flagged';
                setFlagCount(prev => prev + 1);
            } else if (newCell.state === 'flagged') {
                newCell.state = 'hidden';
                setFlagCount(prev => prev - 1);
            }

            return newGrid;
        });
    }, [gameStatus]);

    // Reset game
    const resetGame = useCallback(() => {
        setGrid(initializeGrid(config.rows, config.cols));
        setGameStatus('idle');
        setTimer(0);
        setFlagCount(0);
        setFirstClick(true);
    }, [config]);

    // Timer
    useEffect(() => {
        if (gameStatus === 'playing') {
            const interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [gameStatus]);

    // Initialize on mount or difficulty change
    useEffect(() => {
        resetGame();
    }, [difficulty, resetGame]);

    const cellSize = difficulty === 'hard' ? 'w-5 h-5 text-xs' : 'w-7 h-7 text-sm';

    return (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200 p-6 overflow-auto">
            {/* Header */}
            <div className="w-full max-w-4xl mb-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Bomb className="text-red-600" size={28} />
                        Minesweeper
                    </h1>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-800 font-semibold cursor-pointer hover:border-ubuntu-orange transition-colors"
                    >
                        <option value="easy">Easy (9x9)</option>
                        <option value="medium">Medium (16x16)</option>
                        <option value="hard">Hard (30x16)</option>
                    </select>
                </div>

                {/* Stats Bar */}
                <div className="flex justify-between items-center bg-gray-800 text-white px-6 py-3 rounded-lg mb-4">
                    <div className="flex items-center gap-2">
                        <Flag className="text-ubuntu-orange" size={20} />
                        <span className="text-xl font-mono font-bold">
                            {config.mines - flagCount}
                        </span>
                    </div>
                    <button
                        onClick={resetGame}
                        className="px-4 py-2 bg-ubuntu-orange hover:bg-orange-600 rounded-lg font-semibold transition-colors flex items-center gap-2"
                    >
                        <RotateCcw size={18} />
                        New Game
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-mono font-bold">
                            {String(timer).padStart(3, '0')}
                        </span>
                        <span className="text-sm">sec</span>
                    </div>
                </div>
            </div>

            {/* Game Grid */}
            <div className="relative bg-white p-4 rounded-lg shadow-2xl">
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

                {/* Game Over Overlay */}
                {(gameStatus === 'won' || gameStatus === 'lost') && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg">
                        {gameStatus === 'won' ? (
                            <>
                                <Trophy className="text-yellow-400 mb-4" size={64} />
                                <h2 className="text-4xl font-bold text-white mb-2">You Win! 🎉</h2>
                                <p className="text-xl text-gray-300 mb-6">Time: {timer} seconds</p>
                            </>
                        ) : (
                            <>
                                <Bomb className="text-red-500 mb-4" size={64} />
                                <h2 className="text-4xl font-bold text-white mb-2">Game Over!</h2>
                                <p className="text-xl text-gray-300 mb-6">Better luck next time</p>
                            </>
                        )}
                        <button
                            onClick={resetGame}
                            className="px-6 py-3 bg-ubuntu-orange hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                            <RotateCcw size={20} />
                            Play Again
                        </button>
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="mt-6 text-center text-sm text-gray-600 max-w-md">
                <p className="mb-1">🖱️ Left click to reveal cells</p>
                <p className="mb-1">🚩 Right click to place/remove flags</p>
                <p>💡 Numbers show how many mines are nearby</p>
            </div>
        </div>
    );
};
