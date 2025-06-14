import React, { useState, useEffect, useCallback } from "react";
import QuickMenu from '../components/QuickMenu';
import ConfigModal, { Tool } from '../components/ConfigModal';
import ToolCard from "../components/ToolCard";
import ThemeToggle from "../components/ThemeToggle";
import TerminalPane from "../components/TerminalPane";
import ImageViewerPane from "../components/ImageViewerPane";
import { ToolConfig } from "../env";
import { loadTools } from "../utils/loadTools";

type QuickMenuType = "cards" | "imageViewer" | "terminal";

type MainViewProps = {
    openAboutModal: () => void;
    theme: "dark" | "light";
    setTheme: (t: "dark" | "light") => void;
};

export default function MainView({
                                     openAboutModal,
                                     theme,
                                     setTheme,
                                 }: MainViewProps) {
    const [tools, setTools] = useState<ToolConfig[]>([]);
    const [infoPaneWidth, setInfoPaneWidth] = useState(25);
    const [activeTool, setActiveTool] = useState<ToolConfig | null>(null);
    const [activeMenu, setActiveMenu] = useState<QuickMenuType>("cards");
    const [terminalTool, setTerminalTool] = useState<ToolConfig | null>(null);
    const [imageViewerTool, setImageViewerTool] = useState<ToolConfig | null>(null);

    // === MODAL STATE for Add/Edit Tools ===
    const [configModalOpen, setConfigModalOpen] = useState(false);
    const [editTool, setEditTool] = useState<Tool | null>(null);

    // Load tools at mount or after saving
    useEffect(() => {
        async function fetchTools() {
            try {
                const loaded = await loadTools();
                setTools(Array.isArray(loaded) ? loaded : []);
            } catch (err) {
                setTools([]);
            }
        }
        fetchTools();
    }, [configModalOpen]); // reload on modal close/save

    const handleStartTerminal = useCallback((tool: ToolConfig) => {
        setTerminalTool(tool);
        setActiveMenu("terminal");
    }, []);

    const handleOpenImageViewer = useCallback((tool: ToolConfig) => {
        setImageViewerTool(tool);
        setActiveMenu("imageViewer");
    }, []);

    // Info pane resizer
    const handleDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = infoPaneWidth;
        const onMouseMove = (moveEvent: MouseEvent) => {
            const delta = moveEvent.clientX - startX;
            const percent = Math.min(60, Math.max(25, startWidth - (delta / window.innerWidth) * 100));
            setInfoPaneWidth(percent);
        };
        const onMouseUp = () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    // Handler for opening modal to add a tool
    const handleAddTool = () => {
        setEditTool(null);
        setConfigModalOpen(true);
    };

    // Handler for editing a tool (you can use this from ToolCard if you add an edit button)
    const handleEditTool = (tool: Tool) => {
        setEditTool(tool);
        setConfigModalOpen(true);
    };

    // Main center pane switching logic
    let centerPane: React.ReactNode;
    if (activeMenu === "cards") {
        centerPane = (
            <div
                className="grid gap-8"
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
                            // Add this if you want in-card editing:
                            // onEditClick={() => handleEditTool(tool)}
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
            {/* Quick Menu */}
            <QuickMenu onConfigClick={handleAddTool} />
            {/* Center */}
            <div
                className="flex-1 p-8 overflow-y-auto bg-white text-gray-900 dark:bg-gray-950 dark:text-white transition-colors duration-300"
                style={{
                    maxWidth: `calc(100vw - ${infoPaneWidth}vw - 120px)`,
                    minWidth: 0,
                }}
            >
                {centerPane}
            </div>
            {/* Draggable divider */}
            <div
                className="cursor-col-resize w-2 hover:bg-gray-600 transition-colors duration-200"
                style={{ zIndex: 10, background: "#2c2c2c" }}
                onMouseDown={handleDrag}
            />
            {/* Info Pane */}
            <aside
                className="h-full bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white border-l border-gray-200 dark:border-gray-800 transition-all duration-200"
                style={{
                    width: `${infoPaneWidth}vw`,
                    minWidth: "220px",
                    maxWidth: "640px",
                }}
            >
                <div className="p-6">
                    {activeTool ? (
                        <>
                            <h2 className="text-2xl font-semibold mb-2">{activeTool.name}</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">{activeTool.description}</p>
                            <button
                                className="mt-4 px-4 py-2 bg-blue-700 rounded hover:bg-blue-800 transition text-white"
                                onClick={() => handleEditTool(activeTool as Tool)}
                            >
                                Edit Tool Settings
                            </button>
                        </>
                    ) : (
                        <div className="text-gray-700 dark:text-gray-300">Select a tool card to view more info.</div>
                    )}
                </div>
            </aside>
            {/* Tool Config Modal */}
            <ConfigModal
                isOpen={configModalOpen}
                onClose={() => setConfigModalOpen(false)}
                initialTool={editTool}
                onSave={() => setConfigModalOpen(false)}
            />
        </div>
    );
}
