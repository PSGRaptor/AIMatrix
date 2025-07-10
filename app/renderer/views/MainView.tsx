// app/renderer/views/MainView.tsx

import React, { useState, useEffect, useCallback } from "react";
import QuickMenu from '../components/QuickMenu';
import ConfigModal from '../components/ConfigModal';
import ToolCard from "../components/ToolCard";
import TerminalPane from "../components/TerminalPane";
import ImageViewerPane from "../components/ImageViewerPane";
import { ToolConfig } from "../env";
import { loadTools } from "../utils/loadTools";

/** Which pane is shown in the center */
type QuickMenuType = "cards" | "imageViewer" | "terminal";

type MainViewProps = {
    openAboutModal: () => void;
    theme: "dark" | "light";
    setTheme: (t: "dark" | "light") => void;
};

const MainView: React.FC<MainViewProps> = ({
                                               openAboutModal,
                                               theme,
                                               setTheme,
                                           }) => {
    // List of tools (cards)
    const [tools, setTools] = useState<ToolConfig[]>([]);
    // Info pane width (vw)
    const [infoPaneWidth, setInfoPaneWidth] = useState(15);
    // Which tool is shown in info pane
    const [activeTool, setActiveTool] = useState<ToolConfig | null>(null);
    // Which "main" window/pane is active
    const [activeMenu, setActiveMenu] = useState<QuickMenuType>("cards");
    // If a terminal is open, for which tool?
    const [terminalTool, setTerminalTool] = useState<ToolConfig | null>(null);
    // If image viewer is open, for which tool?
    const [imageViewerTool, setImageViewerTool] = useState<ToolConfig | null>(null);
    // Modal state for tool config (add/edit)
    const [configModalOpen, setConfigModalOpen] = useState(false);
    const [editTool, setEditTool] = useState<ToolConfig | null>(null);

    // Load all tools at startup (or after config modal closes)
    useEffect(() => {
        async function fetchTools() {
            try {
                const loaded = await loadTools();
                setTools(Array.isArray(loaded) ? loaded : []);
            } catch {
                setTools([]);
            }
        }
        fetchTools();
    }, [configModalOpen]);

    // Show cards/terminal/image viewer via menu or button
    const handleShowCards = () => setActiveMenu("cards");
    const handleShowImageViewer = () => {
        if (imageViewerTool) setActiveMenu("imageViewer");
    };
    const handleShowTerminal = () => {
        if (terminalTool) setActiveMenu("terminal");
    };

    // Open terminal for a tool
    const handleStartTerminal = useCallback((tool: ToolConfig) => {
        setTerminalTool(tool);
        setActiveMenu("terminal");
    }, []);

    // Open image viewer for a tool
    const handleOpenImageViewer = useCallback((tool: ToolConfig) => {
        setImageViewerTool(tool);
        setActiveMenu("imageViewer");
    }, []);

    // Handle dragging the info pane divider
    const handleDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = infoPaneWidth;
        const onMouseMove = (moveEvent: MouseEvent) => {
            const delta = moveEvent.clientX - startX;
            const percent = Math.min(60, Math.max(15, startWidth - (delta / window.innerWidth) * 100));
            setInfoPaneWidth(percent);
        };
        const onMouseUp = () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    // Add a tool (reset form)
    const handleAddTool = () => {
        setEditTool(null);
        setConfigModalOpen(true);
    };

    // Edit a tool (open with prefilled form)
    const handleEditTool = (tool: ToolConfig) => {
        setEditTool(tool);
        setConfigModalOpen(true);
    };

    // --- Which pane to show? ---
    let centerPane: React.ReactNode;
    if (activeMenu === "cards") {
        centerPane = (
            <div className="grid gap-8 p-8 pt-10 mt-4 ml-4"
                 style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}
            >

                {tools.length === 0 ? (
                    <div className="col-span-full text-gray-500 text-xl p-12 text-center">
                        No tools found. Please add .json files in <code>app/config/tools/</code>
                    </div>
                ) : (
                    tools.map(tool => (
                        <ToolCard
                            key={tool.name}
                            tool={tool}
                            onStartTerminal={() => handleStartTerminal(tool)}
                            onShowInfo={() => setActiveTool(tool)}
                            onOpenImageViewer={() => handleOpenImageViewer(tool)}
                            active={activeTool?.name === tool.name}
                        />
                    ))
                )}
            </div>
        );
    } else if (activeMenu === "terminal") {
        centerPane = (
            <TerminalPane
                tool={terminalTool}
                onBack={() => setActiveMenu("cards")}
            />
        );
    } else if (activeMenu === "imageViewer") {
        centerPane = (
            <ImageViewerPane
                tool={imageViewerTool}
                onBack={() => setActiveMenu("cards")}
            />
        );
    }

    return (
        <div className="flex w-full h-full">
            {/* --- Left: Quick Menu --- */}
            <QuickMenu
                onConfigClick={handleAddTool}
                theme={theme}
                setTheme={setTheme}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                terminalEnabled={!!terminalTool}
                imageViewerEnabled={!!imageViewerTool}
                onShowCards={handleShowCards}
                onShowImageViewer={handleShowImageViewer}
                onShowTerminal={handleShowTerminal}
            />
            {/* --- Center Pane (main area) --- */}
            <div
                className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden bg-white text-gray-900 dark:bg-gray-950 dark:text-white transition-colors duration-300"
                style={{
                    maxWidth: activeMenu === "imageViewer"
                        ? "100vw"
                        : `calc(100vw - ${infoPaneWidth}vw - 120px)`,
                    minWidth: 0,
                }}
            >
                {centerPane}
            </div>
            {/* --- Draggable divider for info pane (hidden for image viewer) --- */}
            <div
                className="cursor-col-resize w-2 hover:bg-gray-600 transition-colors duration-200"
                style={{ zIndex: 10, background: "#2c2c2c", display: activeMenu === "imageViewer" ? "none" : undefined }}
                onMouseDown={handleDrag}
            />
            {/* --- Right Info Pane (hide for image viewer) --- */}
            {(activeMenu === "cards" || activeMenu === "terminal") && (
                <aside
                    className="h-full bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white border-l border-gray-200 dark:border-gray-800 transition-all duration-200"
                    style={{
                        width: `${infoPaneWidth}vw`,
                        minWidth: "150px",
                        maxWidth: "240px",
                    }}
                >
                    <div className="p-6">
                        {activeTool ? (
                            <>
                                <h2 className="text-2xl font-semibold mb-2">{activeTool.name}</h2>
                                <p className="text-gray-700 dark:text-gray-300 mb-4">{activeTool.description}</p>
                                <button
                                    className="mt-4 px-4 py-2 bg-blue-700 rounded hover:bg-blue-800 transition text-white"
                                    onClick={() => handleEditTool(activeTool as ToolConfig)}
                                >
                                    Edit Tool Settings
                                </button>
                            </>
                        ) : (
                            <div className="text-gray-700 dark:text-gray-300">
                                Select a tool card to view more info.
                            </div>
                        )}
                    </div>
                </aside>
            )}
            {/* --- Tool Config Modal --- */}
            <ConfigModal
                isOpen={configModalOpen}
                onClose={() => setConfigModalOpen(false)}
                tool={editTool}
                onSaved={() => setConfigModalOpen(false)}
            />
        </div>
    );
};

export default MainView;
