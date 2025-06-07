declare global {
    interface Window {
        electronAPI: {
            getTools: () => Promise<any[]>;
            runToolTerminal: (cmd: string, dir: string) => Promise<any>;
            openToolWindow: (url: string) => Promise<any>;
            onToolTerminalData: (cb: (data: string) => void) => void;
            onToolTerminalExit: (cb: (code: number) => void) => void;
        };
    }
}

export function runToolTerminal(startCommand: string, workingDir: string) {
    window.electronAPI?.runToolTerminal(startCommand, workingDir);
}
export function openToolWindow(url: string) {
    window.electronAPI?.openToolWindow(url);
}
export function listenToolTerminalData(cb: (data: string) => void) {
    window.electronAPI?.onToolTerminalData(cb);
}
export function listenToolTerminalExit(cb: (code: number) => void) {
    window.electronAPI?.onToolTerminalExit(cb);
}
