import { ToolConfig } from "../env";

/**
 * Loads all tool configs via Electron's API.
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
export async function startTool(
    startCommand: string,
    workingDir: string
): Promise<{ success: boolean; error?: string }> {
    if (window.electronAPI) {
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
