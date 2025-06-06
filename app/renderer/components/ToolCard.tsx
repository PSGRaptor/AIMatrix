import React from "react";

export default function ToolCard({
                                     tool,
                                     onClick,
                                     onImageViewer,
                                     onTerminal,
                                     active,
                                 }: {
    tool: { name: string; description: string; icon?: string };
    onClick: () => void;
    onImageViewer?: () => void;
    onTerminal?: () => void;
    active?: boolean;
}) {
    return (
        <div
            className={`flex flex-col items-start justify-between bg-gray-800 border rounded-2xl shadow-lg p-6 cursor-pointer hover:bg-gray-700 transition
        ${active ? "border-blue-500 ring-2 ring-blue-500" : "border-gray-700"}
      `}
            style={{
                maxWidth: 450,
                minWidth: 320,
                minHeight: 210,
                maxHeight: 300,
                height: 300,
                overflow: "hidden",
            }}
            onClick={onClick}
        >
            <div className="flex items-center mb-4">
                {tool.icon && (
                    <span className="text-3xl mr-3 select-none" aria-hidden>
            {tool.icon}
          </span>
                )}
                <h3 className="text-xl font-bold">{tool.name}</h3>
            </div>
            <p className="flex-1 text-gray-300 mb-4 overflow-hidden text-ellipsis">
                {tool.description}
            </p>
            <div className="flex gap-2 mt-auto">
                <button
                    className="px-3 py-1 rounded bg-blue-700 hover:bg-blue-800 text-white text-sm"
                    onClick={e => { e.stopPropagation(); /* TODO: launch tool */ }}
                >
                    Launch
                </button>
                <button
                    className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-700 text-white text-sm"
                    onClick={e => { e.stopPropagation(); if (onTerminal) onTerminal(); }}
                >
                    Terminal
                </button>
                <button
                    className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-700 text-white text-sm"
                    onClick={e => { e.stopPropagation(); if (onImageViewer) onImageViewer(); }}
                >
                    Images
                </button>
            </div>
        </div>
    );
}
