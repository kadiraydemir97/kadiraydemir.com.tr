export type Difficulty = 'easy' | 'medium' | 'hard';
export type CellState = 'hidden' | 'revealed' | 'flagged';
export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export interface Cell {
    isMine: boolean;
    neighborMines: number;
    state: CellState;
}

export interface DifficultyConfig {
    rows: number;
    cols: number;
    mines: number;
}

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
    easy: { rows: 9, cols: 9, mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard: { rows: 16, cols: 30, mines: 99 },
};

export const initializeGrid = (rows: number, cols: number): Cell[][] => {
    const newGrid: Cell[][] = [];
    for (let row = 0; row < rows; row++) {
        newGrid[row] = [];
        for (let col = 0; col < cols; col++) {
            newGrid[row][col] = {
                isMine: false,
                neighborMines: 0,
                state: 'hidden',
            };
        }
    }
    return newGrid;
};

export const placeMines = (
    grid: Cell[][],
    firstRow: number,
    firstCol: number,
    config: DifficultyConfig
) => {
    let minesPlaced = 0;
    // Deep copy to ensure immutability of input
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));

    while (minesPlaced < config.mines) {
        const row = Math.floor(Math.random() * config.rows);
        const col = Math.floor(Math.random() * config.cols);

        // Don't place mine on first click or if already has mine
        if ((row === firstRow && col === firstCol) || newGrid[row][col].isMine) {
            continue;
        }

        newGrid[row][col].isMine = true;
        minesPlaced++;
    }

    // Calculate neighbor mines
    for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
            if (!newGrid[row][col].isMine) {
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const newRow = row + dr;
                        const newCol = col + dc;
                        if (
                            newRow >= 0 &&
                            newRow < config.rows &&
                            newCol >= 0 &&
                            newCol < config.cols &&
                            newGrid[newRow][newCol].isMine
                        ) {
                            count++;
                        }
                    }
                }
                newGrid[row][col].neighborMines = count;
            }
        }
    }

    return newGrid;
};

const floodFill = (grid: Cell[][], row: number, col: number, config: DifficultyConfig) => {
    // Check bounds
    if (
        row < 0 ||
        row >= config.rows ||
        col < 0 ||
        col >= config.cols ||
        grid[row][col].state !== 'hidden'
    ) {
        return;
    }

    grid[row][col].state = 'revealed';

    // If no neighbor mines, reveal neighbors recursively
    if (grid[row][col].neighborMines === 0 && !grid[row][col].isMine) {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr !== 0 || dc !== 0) {
                    floodFill(grid, row + dr, col + dc, config);
                }
            }
        }
    }
};

export const revealCell = (
    grid: Cell[][],
    row: number,
    col: number,
    config: DifficultyConfig
): Cell[][] => {
    // Quick check to avoid work if unnecessary
    if (
        row < 0 ||
        row >= config.rows ||
        col < 0 ||
        col >= config.cols ||
        grid[row][col].state !== 'hidden'
    ) {
        return grid;
    }

    // Single deep copy at the start
    const newGrid = grid.map(r => r.map(c => ({ ...c })));

    // Mutate the copy
    floodFill(newGrid, row, col, config);

    return newGrid;
};

export const checkWin = (grid: Cell[][], config: DifficultyConfig) => {
    for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
            const cell = grid[row][col];
            if (!cell.isMine && cell.state !== 'revealed') {
                return false;
            }
        }
    }
    return true;
};
