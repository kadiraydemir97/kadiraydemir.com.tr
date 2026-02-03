import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSelector } from './LanguageSelector';
import { describe, it, expect, vi } from 'vitest';

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            language: 'en',
            changeLanguage: vi.fn(),
        },
    }),
}));

describe('LanguageSelector', () => {
    it('renders current language', () => {
        render(<LanguageSelector />);
        expect(screen.getByText('en')).toBeInTheDocument();
    });

    it('opens dropdown on click', () => {
        render(<LanguageSelector />);
        const button = screen.getByText('en');
        fireEvent.click(button);
        expect(screen.getByText('English')).toBeInTheDocument();
        expect(screen.getByText('Türkçe')).toBeInTheDocument();
    });
});
