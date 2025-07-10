// app/renderer/env.d.ts

export interface OpenDialogOptions {
    title?: string;
    defaultPath?: string;
    filters?: Array<{ name: string; extensions: string[] }>;
    properties?: Array<
        | "openFile"
        | "openDirectory"
        | "multiSelections"
        | "showHiddenFiles"
        | "createDirectory"
        | "promptToCreate"
        | "noResolveAliases"
        | "treatPackageAsDirectory"
        | "dontAddToRecent"
    >;
}

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
    toolsDelete: (toolName: string) => Promise<any>;
    toolsCopyIcon: (srcPath: string) => Promise<string>;
    // Dialogs
    showOpenDialog: (opts?: OpenDialogOptions) => Promise<{ canceled: boolean; filePaths: string[] }>;
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
    isToolRunning: (toolName: string) => Promise<boolean>;
    getToolIcon: (relPath: string) => Promise<string>;
    // Folder listing for image viewer
    listFoldersInFolder: (folder: string) => Promise<string[]>;
    getImageFilesInFolder: (folder: string) => Promise<string[]>;
    readImageAsDataUrl: (absPath: string) => Promise<string>;
}

declare global {
    interface Window {
        electronAPI: electronAPI;
        appInfo?: { version: string; };
    }
}
