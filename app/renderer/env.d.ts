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

export interface electronAPI {
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
    sendTerminalInput: (toolName: string, data: string) => void;
    killToolProcess: (toolName: string) => Promise<any>;
    // Tool windows and explorer
    openToolWindow: (url: string) => Promise<any>;
    openImageViewer: (outputFolder: string) => Promise<any>;
    // Optional: For legacy or advanced control
    startTool?: (startCommand: string, workingDir: string) => Promise<{ success: boolean; error?: string }>;
    toolsDelete: (name: string) => Promise<any>;
    isToolRunning: (toolName: string) => Promise<boolean>;
}

declare module '*.svg?url' {
    const src: string;
    export default src;
}

declare global {
    interface Window {
        electronAPI: electronAPI;

        appInfo?: {
            version: string;
        };
    }
}
