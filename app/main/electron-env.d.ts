// TypeScript declaration for Electron APIs available in preload
export {};

declare global {
    interface Window {
        electronAPI?: any;
    }
}
