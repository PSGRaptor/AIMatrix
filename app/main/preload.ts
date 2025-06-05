// Electron preload script: safely exposes limited APIs to renderer
import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    // add secure APIs as needed
});
