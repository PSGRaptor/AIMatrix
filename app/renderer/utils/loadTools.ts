import { ToolConfig } from "../env";

/**
 * Loads tools via Electron's exposed API.
 */
export async function loadTools(): Promise<ToolConfig[]> {
    if (window.electronAPI) {
        return await window.electronAPI.getTools();
    }
    return [];
}

/**
 * Starts a tool by running its startCommand in its working directory.
 */
export async function startTool(startCommand: string, workingDir: string): Promise<{ success: boolean; error?: string }> {
    if (window.electronAPI) {
        return await window.electronAPI.startTool(startCommand, workingDir);
    }
    return { success: false, error: "Electron API not available." };
}
