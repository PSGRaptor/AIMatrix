// app/env.d.ts

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
    // Tool data
    getTools: () => Promise<ToolConfig[]>;
    toolsSave: (tool: ToolConfig) => Promise<any>;
    toolsCopyIcon: (srcPath: string) => Promise<string>;
    // Dialogs
    showOpenDialog: (opts?: { properties?: string[] }) => Promise<{ canceled: boolean; filePaths: string[] }>;
    getUserDataPath: () => Promise<string>;
    // Terminal
    runToolTerminal: (cmd: string, dir: string, toolName: string) => Promise<any>;
    onToolTerminalData: (cb: (data: string) => void) => void;
    onToolTerminalExit: (cb: (code: number) => void) => void;
    // Tool windows and explorer
    openToolWindow: (url: string) => Promise<any>;
    openImageViewer: (outputFolder: string) => Promise<any>;
    // Optional: For legacy or advanced control
    startTool?: (startCommand: string, workingDir: string) => Promise<{ success: boolean; error?: string }>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
