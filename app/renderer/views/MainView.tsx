import React, { useState } from "react";
import ToolCard from "../components/ToolCard";
import ThemeToggle from "../components/ThemeToggle";

// Example tool data
const tools = [
    { id: 1, name: "Stable Diffusion", description: "AI image generator", icon: "🧠" },
    { id: 2, name: "ComfyUI", description: "Workflow node AI", icon: "🔧" },
    { id: 3, name: "InvokeAI", description: "Stable Diffusion toolkit", icon: "🎨" },
    { id: 4, name: "FaceFusion", description: "AI face swapper", icon: "😎" },
];

type QuickMenuType = "cards" | "imageViewer" | "terminal";

export default function MainView({
                                     openAboutModal,
                                     openConfigModal,
                                     theme,
                                     setTheme,
                                 }: {
    openAboutModal: () => void;
    openConfigModal: () => void;
    theme: "dark" | "light";
    setTheme: (t: "dark" | "light") => void;
}) {
    const [infoPaneWidth, setInfoPaneWidth] = useState(25);
    const [activeTool, setActiveTool] = useState<typeof tools[0] | null>(null);

    // Track which menu is active, plus which are enabled
    const [activeMenu, setActiveMenu] = useState<QuickMenuType>("cards");
    const [imageViewerEnabled, setImageViewerEnabled] = useState(false);
    const [terminalEnabled, setTerminalEnabled] = useState(false);

    // Simulate activating ImageViewer and Terminal from ToolCard actions
    function handleOpenImageViewer() {
        setImageViewerEnabled(true);
        setActiveMenu("imageViewer");
    }
    function handleOpenTerminal() {
        setTerminalEnabled(true);
        setActiveMenu("terminal");
    }
    function handleBackToCards() {
        setActiveMenu("cards");
    }

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

    // Display area based on active quick menu
    let centerPane;
    if (activeMenu === "cards") {
        centerPane = (
            <div
                className="grid gap-8"
                style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                }}
            >
                {tools.map((tool) => (
                    <ToolCard
                        key={tool.id}
                        tool={tool}
                        onClick={() => setActiveTool(tool)}
                        onImageViewer={handleOpenImageViewer}
                        onTerminal={handleOpenTerminal}
                        active={activeTool?.id === tool.id}
                    />
                ))}
            </div>
        );
    } else if (activeMenu === "imageViewer") {
        centerPane = (
            <div className="flex items-center justify-center h-full text-gray-400 text-2xl">
                Image Viewer Placeholder
                <button
                    className="ml-8 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
                    onClick={handleBackToCards}
                >
                    Back to Cards
                </button>
            </div>
        );
    } else if (activeMenu === "terminal") {
        centerPane = (
            <div className="flex items-center justify-center h-full text-gray-400 text-2xl">
                Terminal Window Placeholder
                <button
                    className="ml-8 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
                    onClick={handleBackToCards}
                >
                    Back to Cards
                </button>
            </div>
        );
    }

    return (
        <div className="flex w-full h-full">
            {/* Left Quick Menu (fixed 120px) */}
            <aside className="flex flex-col justify-between items-center w-[80px] bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-white py-6 border-r border-gray-200 dark:border-gray-900 transition-colors duration-300">
                <div className="flex flex-col gap-4">
                    {/* Cards icon */}
                    <button
                        title="Cards"
                        aria-label="Show Tool Cards"
                        className={`p-3 rounded-lg transition 
                            ${activeMenu === "cards" ? "bg-blue-100 text-blue-700 dark:bg-gray-800 dark:text-blue-400" : ""}`}
                        onClick={() => setActiveMenu("cards")}
                    >
                        {/* Grid icon */}
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                            <rect x="3" y="3" width="7" height="7" rx="2" />
                            <rect x="14" y="3" width="7" height="7" rx="2" />
                            <rect x="14" y="14" width="7" height="7" rx="2" />
                            <rect x="3" y="14" width="7" height="7" rx="2" />
                        </svg>
                    </button>
                    {/* Image Viewer icon */}
                    <button
                        title="Image Viewer"
                        aria-label="Open Image Viewer"
                        className={`p-3 rounded-lg transition ${activeMenu === "imageViewer" ? "bg-blue-100 text-blue-700 dark:bg-gray-800 dark:text-blue-400" : ""} ${!imageViewerEnabled ? "opacity-50 pointer-events-none cursor-not-allowed" : ""}`}
                        onClick={() => imageViewerEnabled && setActiveMenu("imageViewer")}
                        disabled={!imageViewerEnabled}
                    >
                        {/* Image icon */}
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <circle cx="8.5" cy="10.5" r="1.5" />
                            <path d="M21 19l-5.5-5.5c-.66-.66-1.74-.66-2.4 0L3 19" />
                        </svg>
                    </button>
                    {/* Terminal icon */}
                    <button
                        title="Terminal"
                        aria-label="Open Terminal"
                        className={`p-3 rounded-lg transition ${activeMenu === "terminal" ? "bg-blue-100 text-blue-700 dark:bg-gray-800 dark:text-blue-400" : ""} ${!terminalEnabled ? "opacity-50 pointer-events-none cursor-not-allowed" : ""}`}
                        onClick={() => terminalEnabled && setActiveMenu("terminal")}
                        disabled={!terminalEnabled}
                    >
                        {/* Terminal icon */}
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="16" rx="2" />
                            <path d="M8 9l4 4-4 4" />
                            <path d="M16 15h2" />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    {/* Theme Toggle (here!) */}
                    <ThemeToggle theme={theme} setTheme={setTheme} />
                    {/* Settings icon */}
                    <button title="Settings" aria-label="Open Settings"
                            onClick={openConfigModal}
                            className="p-3 rounded-lg transition">
                        {/* Gear icon */}
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82A1.65 1.65 0 0 0 3 12.91V12a2 2 0 1 1 0-4v-.09a1.65 1.65 0 0 0 .33-1.82l-.06-.06A2 2 0 1 1 6.1 3.1l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09c.14.39.39.74 1 .74a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09c0 .37.14.72.39.98" />
                        </svg>
                    </button>
                </div>
            </aside>

            {/* Center area */}
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
                                onClick={openConfigModal}
                            >
                                Edit Tool Settings
                            </button>
                        </>
                    ) : (
                        <div className="text-gray-700 dark:text-gray-300">Select a tool card to view more info.</div>
                    )}
                </div>
            </aside>
        </div>
    );
}
