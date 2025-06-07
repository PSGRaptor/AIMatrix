import * as fs from "fs";
import * as path from "path";
//import type { ToolConfig } from "./ToolConfig"; // if you use types
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
