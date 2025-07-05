// app/renderer/utils/ipc.ts

// Import the ElectronAPI type
import type { ElectronAPI } from "../env";

// Run the tool's terminal command (start script, etc.)
export async function runToolTerminal(
    cmd: string,
    dir: string,
    toolName: string
): Promise<{ success: boolean; error?: string }> {
    if (window.electronAPI && window.electronAPI.runToolTerminal) {
        // Only call with 2 arguments
        return await window.electronAPI.runToolTerminal(cmd, dir, toolName);
    }
    return { success: false, error: "Electron API not available." };
}

// Open a tool's Web UI in a new Electron window
export async function openToolWindow(url: string) {
    if (window.electronAPI && window.electronAPI.openToolWindow) {
        return await window.electronAPI.openToolWindow(url);
    }
    window.open(url, "_blank");
}

// Open a folder (image output) in the system's file explorer
export async function openImageViewer(outputFolder: string) {
    if (window.electronAPI && window.electronAPI.openImageViewer) {
        return await window.electronAPI.openImageViewer(outputFolder);
    }
    alert(`Would open folder: ${outputFolder}`);
}

export function isToolRunning(toolName: string): Promise<boolean> {
    return window.electronAPI.isToolRunning(toolName);
}

// Get Electron user data path
export const getUserDataPath = () =>
    (window as any).electronAPI?.getUserDataPath
        ? (window as any).electronAPI.getUserDataPath()
        : Promise.resolve('');
