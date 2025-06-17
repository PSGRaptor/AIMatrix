import { ToolConfig } from "../env";

// Tool type, can be placed at the top of app/renderer/components/ConfigModal.tsx or utils/loadTools.ts

export interface Tool {
    name: string;
    icon: string;           // emoji or path to icon/image (relative to userData/icons/)
    description: string;
    toolRoot: string;
    url: string;
    outputFolder: string;
    updateCommand?: string;
    startCommand: string;
    createdAt?: string;
    lastModified?: string;
    platforms?: string[];
    author?: string;
    notes?: string;
}


/**
 * Loads all tool configs via Electron's API.
 */
export async function loadTools(): Promise<ToolConfig[]> {
    console.log("loadTools function called");
    if (window.electronAPI && window.electronAPI.getTools) {
        return await window.electronAPI.getTools();
    }
    return [];
}

/**
 * Starts a tool by running its startCommand in its working directory.
 */
export async function startTool(
    startCommand: string,
    workingDir: string
): Promise<{ success: boolean; error?: string }> {
    if (window.electronAPI && window.electronAPI.startTool) {
        return await window.electronAPI.startTool(startCommand, workingDir);
    }
    return { success: false, error: "Electron API not available." };
}

/**
 * Opens a tool's web UI in Electron (or another window).
 */
export function launchTool(url: string) {
    if (window.electronAPI && window.electronAPI.openToolWindow) {
        window.electronAPI.openToolWindow(url);
    } else {
        window.open(url, "_blank"); // fallback for dev in browser
    }
}

/**
 * Opens the tool's terminal (implement as needed; this is a stub).
 */
export function openTerminal(toolRoot: string) {
    // IPC logic can be implemented here for future terminal opening
}

/**
 * Opens the tool's output folder in the system file explorer.
 */
export function openImageViewer(outputFolder: string) {
    // IPC logic can be implemented here for future image viewing
}
