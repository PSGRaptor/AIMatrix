"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTools = loadTools;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Loads all tool configs from app/config/tools/
 * Returns an array of ToolConfig objects.
 */
function loadTools() {
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
        return JSON.parse(data);
    });
}
