export interface ToolConfig {
    name: string;
    icon: string;
    description: string;
    toolRoot: string;
    url: string;
    outputFolder: string;
    updateCommand: string;
    startCommand: string;
}

export interface ElectronAPI {
    getTools: () => Promise<ToolConfig[]>;
    runToolTerminal: (cmd: string, dir: string) => Promise<any>;
    openToolWindow: (url: string) => Promise<any>;
    onToolTerminalData: (cb: (data: string) => void) => void;
    onToolTerminalExit: (cb: (code: number) => void) => void;
    startTool: (startCommand: string, workingDir: string) => Promise<{ success: boolean; error?: string }>;
    openImageViewer?: (outputFolder: string) => Promise<any>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI; // <<< lowercase e
    }
}
