import { render, screen, act, fireEvent } from '@testing-library/react';
import { MinesweeperGame } from './MinesweeperGame';
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';

describe('MinesweeperGame', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('renders and starts the game correctly', () => {
        render(<MinesweeperGame />);

        // Start game by clicking a cell
        const buttons = screen.getAllByRole('button');
        const cell = buttons.find(b => !b.textContent?.includes('New Game'));
        if (!cell) throw new Error('No cell found');

        fireEvent.click(cell);

        // Advance timer by 5 seconds
        act(() => {
            vi.advanceTimersByTime(5000);
        });

        // Verify timer updated in the DOM (assuming timer is displayed)
        // The timer display code is: <span>{String(timer).padStart(3, '0')}</span>
        // We expect it to be 005
        expect(screen.getByText('005')).toBeInTheDocument();
    });
});
