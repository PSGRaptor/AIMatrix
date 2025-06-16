import { ipcMain, app, dialog } from 'electron';
import * as fs from "fs";
import * as path from "path";

// Tools directory in app data
const toolsDir = path.join(app.getPath('userData'), 'tools');
if (!fs.existsSync(toolsDir)) fs.mkdirSync(toolsDir, { recursive: true });

ipcMain.handle('tools:list', async () => {
    // List all JSON tool files
    const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.json'));
    return files.map(file => JSON.parse(fs.readFileSync(path.join(toolsDir, file), 'utf-8')));
});

ipcMain.handle('tools:save', async (_, tool) => {
    // Set timestamps
    tool.lastModified = new Date().toISOString();
    if (!tool.createdAt) tool.createdAt = tool.lastModified;
    const filePath = path.join(toolsDir, `${tool.name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(tool, null, 2));
    return true;
});

ipcMain.handle('tools:delete', async (_, toolName: string) => {
    const filePath = path.join(toolsDir, `${toolName}.json`);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return true;
});

/**
 * ToolConfig type: Describes each tool, matching your project spec.
 */
export type ToolConfig = {
    name: string;
    icon: string;
    description: string;
    toolRoot: string;
    url: string;
    outputFolder: string;
    updateCommand: string;
    startCommand: string;
};

/**
 * Loads all tool configs from app/config/tools/
 * Returns an array of ToolConfig objects.
 */
export function loadTools(): ToolConfig[] {
    // Always reference from process.cwd(), which is your project root when developing
    const dir = path.join(process.cwd(), "app/config/tools");
    if (!fs.existsSync(dir)) {
        console.log("Tool config directory does not exist:", dir);
        return [];
    }
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
    return files.map(filename => {
        const filePath = path.join(dir, filename);
        const data = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(data) as ToolConfig;
    });
}
