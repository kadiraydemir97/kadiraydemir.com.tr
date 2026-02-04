import '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Polyfill crypto.randomUUID
if (!globalThis.crypto?.randomUUID) {
    Object.defineProperty(globalThis.crypto, 'randomUUID', {
        value: () => 'test-uuid-' + Math.random(),
        writable: true,
    });
}

// Mock ResizeObserver
(globalThis as any).ResizeObserver = class {
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock translations
const translations: Record<string, string> = {
    'apps.cv': 'CV',
    'apps.browser': 'Browser',
    'apps.explorer': 'Files',
    'apps.terminal': 'Terminal',
    'apps.mail': 'Mail',
    'apps.settings': 'Settings',
    'apps.minesweeper': 'Minesweeper',
    'apps.sudoku': 'Sudoku',
    'system.activities': 'Activities',
    'system.applications': 'Applications',
    'system.desktop': 'Desktop',
    'applicationsMenu.frequent': 'Frequent',
    'applicationsMenu.allApplications': 'All Applications',
    'applicationsMenu.searchPlaceholder': 'Type to search...',
    'minesweeperGame.newGame': 'New Game',
    'minesweeperGame.easy': 'Easy (9x9)',
    'minesweeperGame.medium': 'Medium (16x16)',
    'minesweeperGame.hard': 'Hard (30x16)',
    'minesweeperGame.title': 'Minesweeper',
};

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => translations[key] || key.split('.').pop(),
        i18n: {
            language: 'en-US',
            changeLanguage: () => new Promise(() => {}),
        },
    }),
}));
