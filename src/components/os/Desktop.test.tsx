import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Desktop } from './Desktop';
import * as osStore from '../../store/useOSStore';

// Mock dependencies
vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string, defaultVal: string) => defaultVal || key }),
}));

vi.mock('../../hooks/useProcess', () => ({
    useProcess: () => ({
        openCV: vi.fn(),
        openWindow: vi.fn(),
        openExplorer: vi.fn(),
    }),
}));

vi.mock('../../hooks/useIsMobile', () => ({
    useIsMobile: () => false,
}));

// Mock Lucide icons
vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual as any),
    };
});

describe('Desktop', () => {
    const mockRenameItem = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock the store
        vi.spyOn(osStore, 'useOSStore').mockReturnValue({
            fileSystem: {
                id: 'home',
                children: [
                    {
                        id: 'desktop',
                        name: 'Desktop',
                        type: 'folder',
                        children: [
                            { id: 'desktop-file', name: 'note.txt', type: 'file', extension: 'txt' }
                        ]
                    }
                ]
            },
            createItem: vi.fn(),
            deleteItem: vi.fn(),
            renameItem: mockRenameItem,
            restoreItem: vi.fn(),
            emptyTrash: vi.fn(),
            showAlert: vi.fn(),
            showConfirm: vi.fn(),
            showPrompt: vi.fn(),
            deselectAll: vi.fn(),
        } as any);
    });

    it('should automatically add .txt suffix if missing when renaming a text file on desktop', async () => {
        render(<Desktop />);

        // Find the file
        const fileItem = screen.getByText('note.txt');

        // Right click to open context menu
        fireEvent.contextMenu(fileItem);

        // Click Rename
        const renameOption = screen.getByText('Rename');
        fireEvent.click(renameOption);

        // Find input (which should be visible now on the desktop icon)
        const input = screen.getByDisplayValue('note.txt');

        // Change value to "new-note" (missing .txt)
        fireEvent.change(input, { target: { value: 'new-note' } });

        // Trigger submit (Enter)
        fireEvent.keyDown(input, { key: 'Enter' });

        // Expect renameItem to be called with "new-note.txt"
        // This fails if the feature is not implemented
        expect(mockRenameItem).toHaveBeenCalledWith('desktop-file', 'new-note.txt');
    });

    it('should not double add .txt suffix if already present on desktop', async () => {
        render(<Desktop />);
        const fileItem = screen.getByText('note.txt');
        fireEvent.contextMenu(fileItem);
        const renameOption = screen.getByText('Rename');
        fireEvent.click(renameOption);
        const input = screen.getByDisplayValue('note.txt');
        fireEvent.change(input, { target: { value: 'new-note.txt' } });
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(mockRenameItem).toHaveBeenCalledWith('desktop-file', 'new-note.txt');
    });
});
