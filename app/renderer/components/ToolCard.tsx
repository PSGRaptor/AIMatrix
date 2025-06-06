import React from "react";
import { ToolConfig } from "../env";
import { startTool, launchTool, openTerminal, openImageViewer } from "../utils/loadTools";

/**
 * ToolCard — Renders each tool with actions.
 * Now uses ToolConfig (all fields from JSON).
 */

export default function ToolCard({
                                     tool,
                                     onClick,
                                     onImageViewer,
                                     onTerminal,
                                     active,
                                 }: {
    tool: ToolConfig;
    onClick: () => void;
    onImageViewer?: () => void;
    onTerminal?: () => void;
    active?: boolean;
}) {
    // Start tool handler
    const handleStart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const result = await startTool(tool.startCommand, tool.toolRoot);
        if (result.success) {
            if (tool.url) launchTool(tool.url); // Optionally open the web UI
        } else {
            alert(`Failed to launch tool: ${result.error}`);
        }
    };

    return (
        <div
            className={`rounded-xl shadow-lg p-6 mb-2 cursor-pointer transition
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-800
        hover:bg-blue-50 dark:hover:bg-gray-800
        ${active ? "ring-2 ring-blue-500" : "border-gray-700"}
      `}
            style={{
                maxWidth: 450,
                minWidth: 320,
                minHeight: 210,
                maxHeight: 200,
                height: 200,
                overflow: "hidden",
            }}
            onClick={onClick}
            tabIndex={0}
            role="button"
            aria-pressed={!!active}
            aria-label={`View info for ${tool.name}`}
        >
            <div className="flex items-center mb-4">
                {tool.icon && (
                    <span className="text-5xl mr-3 select-none" aria-hidden>
            {tool.icon}
          </span>
                )}
                <h3 className="text-xl font-bold">{tool.name}</h3>
            </div>
            <p className="flex-1 text-gray-700 dark:text-gray-300 mb-2 overflow-hidden text-ellipsis">
                {tool.description}
            </p>
            <div className="flex gap-2 mt-auto">
                <button
                    className="px-3 py-1 rounded bg-blue-700 hover:bg-blue-800 text-white text-sm"
                    title="Start Tool"
                    onClick={handleStart}
                >
                    Start
                </button>
                <button
                    className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-700 text-white text-sm"
                    title="Open Tool Terminal"
                    onClick={e => {
                        e.stopPropagation();
                        openTerminal(tool.toolRoot);
                    }}
                >
                    Terminal
                </button>
                <button
                    className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-700 text-white text-sm"
                    title="Open Image Output Folder"
                    onClick={e => {
                        e.stopPropagation();
                        openImageViewer(tool.outputFolder);
                    }}
                >
                    Images
                </button>
            </div>
        </div>
    );
}
