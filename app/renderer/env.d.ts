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
    startTool: (startCommand: string, workingDir: string) => Promise<{ success: boolean; error?: string }>;
}
declare global {
    interface Window {
        ElectronAPI: ElectronAPI;
    }
}
