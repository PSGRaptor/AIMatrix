import React, { useState, useEffect, useCallback } from "react";
import QuickMenu from '../components/QuickMenu';
import ConfigModal from '../components/ConfigModal';
import ToolCard from "../components/ToolCard";
import ThemeToggle from "../components/ThemeToggle";
import TerminalPane from "../components/TerminalPane";
import ImageViewerPane from "../components/ImageViewerPane";
import { ToolConfig } from "../env";
import { loadTools } from "../utils/loadTools";

/**
 * Type for center menu switching
 */
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
    // Tool cards state
    const [tools, setTools] = useState<ToolConfig[]>([]);
    // Width of right info pane
    const [infoPaneWidth, setInfoPaneWidth] = useState(25);
    // Active tool for info pane display
    const [activeTool, setActiveTool] = useState<ToolConfig | null>(null);
    // Which view is active
    const [activeMenu, setActiveMenu] = useState<QuickMenuType>("cards");
    // State for Terminal/imageViewer modals
    const [terminalTool, setTerminalTool] = useState<ToolConfig | null>(null);
    const [imageViewerTool, setImageViewerTool] = useState<ToolConfig | null>(null);
    // Add/Edit tool modal
    const [configModalOpen, setConfigModalOpen] = useState(false);
    const [editTool, setEditTool] = useState<ToolConfig | null>(null);

    // --- EXIF integration ---
    // These two states will be set by ImageViewerPane when an image is selected
    const [selectedImage, setSelectedImage] = useState<string | null>(null); // Data URL
    const [selectedExif, setSelectedExif] = useState<any | null>(null);

    // Load tool cards from disk
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

    // Open terminal with selected tool
    const handleStartTerminal = useCallback((tool: ToolConfig) => {
        setTerminalTool(tool);
        setActiveMenu("terminal");
    }, []);

    // Open image viewer with selected tool
    const handleOpenImageViewer = useCallback((tool: ToolConfig) => {
        setImageViewerTool(tool);
        setActiveMenu("imageViewer");
        setSelectedImage(null); // Reset on open
        setSelectedExif(null);
    }, []);

    // Info pane resizer (draggable divider)
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

    // Add new tool (clear form)
    const handleAddTool = () => {
        setEditTool(null);
        setConfigModalOpen(true);
    };

    // Edit existing tool (prefill form)
    const handleEditTool = (tool: ToolConfig) => {
        setEditTool(tool);
        setConfigModalOpen(true);
    };

    // -- MAIN content switching logic --
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
                // Notify parent of image change for info pane EXIF display
                onImageChange={(imageSrc, exif) => {
                    setSelectedImage(imageSrc);
                    setSelectedExif(exif);
                }}
            />
        );
    }

    return (
        <div className="flex w-full h-full">
            {/* Quick Menu (left) */}
            <QuickMenu onConfigClick={handleAddTool} theme={theme} setTheme={setTheme} />
            {/* Main content area */}
            <div
                className="flex-1 p-8 overflow-y-auto bg-white text-gray-900 dark:bg-gray-950 dark:text-white transition-colors duration-300"
                style={{
                    maxWidth: `calc(100vw - ${infoPaneWidth}vw - 120px)`,
                    minWidth: 0,
                }}
            >
                {centerPane}
            </div>
            {/* Draggable divider for resizing info pane */}
            <div
                className="cursor-col-resize w-2 hover:bg-gray-600 transition-colors duration-200"
                style={{ zIndex: 10, background: "#2c2c2c" }}
                onMouseDown={handleDrag}
            />
            {/* Right info pane */}
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
                                onClick={() => handleEditTool(activeTool as ToolConfig)}
                            >
                                Edit Tool Settings
                            </button>
                        </>
                    ) : (
                        <div className="text-gray-700 dark:text-gray-300">Select a tool card to view more info.</div>
                    )}

                    {/* --- Show EXIF data in the right pane if an image is selected --- */}
                    {selectedImage && selectedExif && typeof selectedExif === "object" ? (
                        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl max-h-[40vh] overflow-auto text-xs border border-blue-300 dark:border-blue-800">
                            <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-2">
                                EXIF Metadata
                            </h3>
                            {Object.keys(selectedExif).map(ifd =>
                                    selectedExif[ifd] && Object.keys(selectedExif[ifd]).length > 0 && (
                                        <div key={ifd} className="mb-2">
                                            <div className="font-semibold">{ifd}</div>
                                            {Object.entries(selectedExif[ifd]).map(([tag, val]) => (
                                                <div key={tag} className="flex gap-2 py-0.5">
                                                    <div className="w-40">{tag}</div>
                                                    <div className="flex-1 break-words">{String(val)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                            )}
                        </div>
                    ): null}
                </div>
            </aside>
            {/* Tool Config Modal */}
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
