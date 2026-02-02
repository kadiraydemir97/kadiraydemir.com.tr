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

export const NUMBER_COLORS = [
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
