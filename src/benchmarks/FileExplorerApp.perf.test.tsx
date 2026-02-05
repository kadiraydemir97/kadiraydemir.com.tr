import { render } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import { FileExplorerApp } from '../components/apps/FileExplorerApp';
import * as osStore from '../store/useOSStore';

// Mock dependencies
vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string, defaultVal: string) => defaultVal || key }),
}));

vi.mock('../hooks/useProcess', () => ({
    useProcess: () => ({
        openCV: vi.fn(),
        openWindow: vi.fn(),
    }),
}));

vi.mock('../hooks/useIsMobile', () => ({
    useIsMobile: () => false,
}));

vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual as any),
    };
});

describe('FileExplorerApp Performance', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(osStore, 'useOSStore').mockReturnValue({
            fileSystem: {
                id: 'root',
                name: 'Root',
                type: 'folder',
                children: [
                     { id: 'test-file', name: 'test.txt', type: 'file', extension: 'txt' }
                ]
            },
            createItem: vi.fn(),
            deleteItem: vi.fn(),
            renameItem: vi.fn(),
            restoreItem: vi.fn(),
            emptyTrash: vi.fn(),
            showAlert: vi.fn(),
            showConfirm: vi.fn(),
            showPrompt: vi.fn(),
        } as any);
    });

    it('renders 1000 times', () => {
        const { rerender } = render(<FileExplorerApp initialPath={['root']} />);

        const start = performance.now();
        for (let i = 0; i < 1000; i++) {
            rerender(<FileExplorerApp initialPath={['root']} />);
        }
        const end = performance.now();

        console.log(`\n\nBENCHMARK: 1000 renders took ${(end - start).toFixed(2)}ms\n\n`);
    });
});
