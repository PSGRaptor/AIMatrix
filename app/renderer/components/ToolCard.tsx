// File: app/renderer/components/ToolCard.tsx

import React, { useEffect, useState } from "react";
import { ToolConfig } from "../env";
import { openToolWindow } from "../utils/ipc";

/**
 * ToolCard — Displays a tool and actions.
 */
export default function ToolCard({
                                     tool,
                                     onStartTerminal,
                                     onShowInfo,
                                     onOpenImageViewer,
                                     active,
                                 }: {
    tool: ToolConfig;
    onStartTerminal: () => void;
    onShowInfo: () => void;
    onOpenImageViewer: () => void;
    active?: boolean;
}) {
    // State for base64 icon data
    const [iconDataUrl, setIconDataUrl] = useState<string | null>(null);

    // Only load icon as DataURL if it looks like a stored icon path
    useEffect(() => {
        let cancelled = false;
        async function fetchIcon() {
            if (tool.icon && tool.icon.startsWith("icons/")) {
                // Fetch as data URL from main process
                const dataUrl = await window.electronAPI.getToolIcon(tool.icon);
                if (!cancelled) setIconDataUrl(dataUrl);
            } else {
                setIconDataUrl(null); // for emoji or direct URLs
            }
        }
        fetchIcon();
        return () => { cancelled = true };
    }, [tool.icon]);

    // Checks if icon is an emoji (single Unicode) or a file path
    const isEmoji = tool.icon && /^[\p{Emoji}\u200d]+$/u.test(tool.icon);
    let iconElem: React.ReactNode = null;

    if (isEmoji) {
        iconElem = (
            <span className="text-5xl mr-3 select-none" aria-hidden>
                {tool.icon}
            </span>
        );
    } else if (tool.icon) {
        // If iconDataUrl is present, use it, otherwise use fallback
        if (iconDataUrl) {
            iconElem = (
                <img
                    src={iconDataUrl}
                    alt="icon"
                    className="w-12 h-12 mr-3 rounded border border-gray-300 dark:border-gray-800 object-contain bg-white"
                />
            );
        } else {
            iconElem = (
                <img
                    src={tool.icon}
                    alt="icon"
                    className="w-12 h-12 mr-3 rounded border border-gray-300 dark:border-gray-800 object-contain bg-white"
                />
            );
        }
    }

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
            <div className="flex items-center mb-4">
                {iconElem}
                <h3 className="text-xl font-bold">{tool.name}</h3>
            </div>
            <p className="flex-1 text-gray-700 dark:text-gray-300 mb-2 overflow-hidden text-ellipsis">
                {tool.description}
            </p>
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
                {tool.outputFolder && (
                    <button
                        className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-700 text-white text-sm"
                        title="Open Outputs"
                        onClick={e => {
                            e.stopPropagation();
                            onOpenImageViewer();
                        }}
                    >
                        Outputs
                    </button>
                )}
                <button
                    className="px-3 py-1 rounded bg-red-700 hover:bg-red-800 text-white text-sm"
                    title="Stop Tool"
                    onClick={e => {
                        e.stopPropagation();
                        window.electronAPI?.killToolProcess(tool.name);
                    }}
                >
                    Stop
                </button>
            </div>
        </div>
    );
}
