import { useState, useRef, useEffect } from 'react';
import cvData from '../../data/cv.json';

interface CommandHistory {
    command: string;
    output: React.ReactNode;
}

const BOOT_LOGS = [
    "Kadir OS 1.0.0 LTS kadir-virtual-machine tty1",
    "",
    "Login incorrect? No, you're already logged in as root.",
    `Welcome to Kadir OS 1.0.0 (GNU/Linux 5.15.0-generic x86_64)`,
    "",
    " * Documentation:  https://kadir.dev/docs",
    " * Portfolio:      https://kadir.dev",
    " * Contact:        contact@kadir.dev",
    "",
    "Last login: Mon Feb 13 10:00:22 2026 from 192.168.1.5",
];

export const TerminalApp = () => {
    const [history, setHistory] = useState<CommandHistory[]>([]);
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Initial greeting
    useEffect(() => {
        setHistory([{
            command: '',
            output: (
                <div className="text-gray-400">
                    {BOOT_LOGS.map((line, i) => <div key={i}>{line}</div>)}
                </div>
            )
        }]);
    }, []);

    // Scroll to bottom on history change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    // Focus input on click
    const handleContainerClick = () => {
        inputRef.current?.focus();
    };

    const handleCommand = () => {
        const cmd = input.trim();
        if (!cmd) {
            setHistory(prev => [...prev, { command: '', output: null }]);
            setInput('');
            return;
        }

        let output: React.ReactNode;
        const args = cmd.split(' ');
        const commandName = args[0].toLowerCase();

        switch (commandName) {
            case 'help':
                output = "Available commands: help, ls, cat, whoami, clear, exit";
                break;
            case 'ls':
                output = (
                    <div className="flex gap-4">
                        <span className="text-blue-400 font-bold">Desktop/</span>
                        <span className="text-blue-400 font-bold">Documents/</span>
                        <span className="text-white">cv.json</span>
                        <span className="text-white">readme.txt</span>
                        <span className="text-white">contact.txt</span>
                    </div>
                );
                break;
            case 'cat':
                if (args[1] === 'cv.json') {
                    output = <pre className="text-xs text-green-300">{JSON.stringify(cvData, null, 2)}</pre>;
                } else if (args[1] === 'readme.txt') {
                    output = "Welcome to Kadir's Interactive Portfolio OS! Double click icons to open apps.";
                } else if (args[1] === 'contact.txt') {
                    output = "Email: contact@kadir.dev\nLocation: Ankara, Turkiye";
                } else if (!args[1]) {
                    output = "Usage: cat [filename]";
                } else {
                    output = `cat: ${args[1]}: No such file or directory`;
                }
                break;
            case 'whoami':
                output = "kadir";
                break;
            case 'clear':
                setHistory([]);
                setInput('');
                return;
            case 'exit':
                output = "Use the window controls to close this terminal.";
                break;
            case 'sudo':
                output = "kadir is not in the sudoers file. This incident will be reported.";
                break;
            default:
                output = `${commandName}: command not found`;
        }

        setHistory(prev => [...prev, { command: cmd, output }]);
        setInput('');
    };

    return (
        <div
            className="w-full h-full bg-[#300a24] text-white font-mono p-2 overflow-y-auto text-sm"
            onClick={handleContainerClick}
        >
            {history.map((item, idx) => (
                <div key={idx} className="mb-1">
                    {item.command && (
                        <div className="flex gap-2">
                            <span className="text-ubuntu-corr-green font-bold">kadir@os:~$</span>
                            <span>{item.command}</span>
                        </div>
                    )}
                    <div>{item.output}</div>
                </div>
            ))}

            <div className="flex gap-2">
                <span className="text-green-500 font-bold">kadir@os:~$</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
                    className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 p-0"
                    autoFocus
                    autoComplete="off"
                />
            </div>
            <div ref={bottomRef} />
        </div>
    );
};
