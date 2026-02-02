export interface FileSystemItem {
    id: string;
    name: string;
    type: 'file' | 'directory';
    content?: string;
    children?: FileSystemItem[];
}

export const mockFileSystem: FileSystemItem[] = [
    {
        id: 'root',
        name: 'C:',
        type: 'directory',
        children: [
            {
                id: 'users',
                name: 'Users',
                type: 'directory',
                children: [
                    {
                        id: 'kadir',
                        name: 'Kadir',
                        type: 'directory',
                        children: [
                            {
                                id: 'documents',
                                name: 'Documents',
                                type: 'directory',
                                children: [
                                    { id: 'cv-pdf', name: 'CV.pdf', type: 'file', content: 'PDF_PLACEHOLDER' },
                                    { id: 'readme', name: 'README.txt', type: 'file', content: 'Welcome to my Web OS Portfolio!' }
                                ]
                            },
                            {
                                id: 'desktop',
                                name: 'Desktop',
                                type: 'directory',
                                children: [
                                    { id: 'cv-icon', name: 'CV.pdf', type: 'file' },
                                    { id: 'terminal-icon', name: 'Terminal', type: 'file' }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
];
