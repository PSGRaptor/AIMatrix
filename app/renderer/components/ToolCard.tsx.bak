import React from "react";
import { ToolConfig } from "../env";
import { runToolTerminal, openToolWindow, openImageViewer } from "../utils/ipc";

/**
 * ToolCard — Displays a tool and actions (start, open UI, outputs).
 */
export default function ToolCard({
                                     tool,
                                     onStartTerminal,
                                     onShowInfo,
                                     active,
                                 }: {
    tool: ToolConfig;
    onStartTerminal: () => void;
    onShowInfo: () => void;
    active?: boolean;
}) {
    return (
        <div
            className={`rounded-xl shadow-lg p-6 mb-2 cursor-pointer transition
                bg-white dark:bg-gray-900
                border border-gray-200 dark:border-gray-800
                hover:bg-blue-50 dark:hover:bg-gray-800
                ${active ? "ring-2 ring-blue-500" : ""}
          `}
            style={{
                maxWidth: 450,
                minWidth: 320,
                minHeight: 210,
                maxHeight: 200,
                height: 200,
                overflow: "hidden",
            }}
            onClick={onShowInfo}
            tabIndex={0}
            role="button"
            aria-pressed={!!active}
            aria-label={`View info for ${tool.name}`}
        >
            {/* Tool header: Icon and name */}
            <div className="flex items-center mb-4">
                {tool.icon && (
                    <span className="text-5xl mr-3 select-none" aria-hidden>
                        {tool.icon}
                    </span>
                )}
                <h3 className="text-xl font-bold">{tool.name}</h3>
            </div>
            {/* Description */}
            <p className="flex-1 text-gray-700 dark:text-gray-300 mb-2 overflow-hidden text-ellipsis">
                {tool.description}
            </p>
            {/* Actions */}
            <div className="flex gap-2 mt-auto">
                <button
                    className="px-3 py-1 rounded bg-blue-700 hover:bg-blue-800 text-white text-sm"
                    title="Start Tool (Terminal/BAT)"
                    onClick={e => {
                        e.stopPropagation();
                        onStartTerminal();
                    }}
                >
                    Start
                </button>
                {/* Open UI only if tool.url is set */}
                {tool.url && (
                    <button
                        className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-700 text-white text-sm"
                        title="Open Tool Web UI"
                        onClick={e => {
                            e.stopPropagation();
                            openToolWindow(tool.url);
                        }}
                    >
                        Open UI
                    </button>
                )}
                {/* Outputs: Open image output folder */}
                {tool.outputFolder && (
                    <button
                        className="px-3 py-1 rounded bg-gray-500 hover:bg-gray-600 text-white text-sm"
                        title="Open Output Images Folder"
                        onClick={e => {
                            e.stopPropagation();
                            openImageViewer(tool.outputFolder);
                        }}
                    >
                        Outputs
                    </button>
                )}
            </div>
        </div>
    );
}
