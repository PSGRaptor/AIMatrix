import React, { useState } from "react";
import ToolCard from "../components/ToolCard";

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
                                 }: {
    openAboutModal: () => void;
    openConfigModal: () => void;
}) {
    const [infoPaneWidth, setInfoPaneWidth] = useState(25);
    const [activeTool, setActiveTool] = useState<typeof tools[0] | null>(null);

    // Track which menu is active, plus which are enabled
    const [activeMenu, setActiveMenu] = useState<QuickMenuType>("cards");
    const [imageViewerEnabled, setImageViewerEnabled] = useState(false);
    const [terminalEnabled, setTerminalEnabled] = useState(false);

    // Simulate activating ImageViewer and Terminal from ToolCard actions
    // In a real app, these would be set from the actual ToolCard interactions!
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
                <button className="ml-8 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600" onClick={handleBackToCards}>Back to Cards</button>
            </div>
        );
    } else if (activeMenu === "terminal") {
        centerPane = (
            <div className="flex items-center justify-center h-full text-gray-400 text-2xl">
                Terminal Window Placeholder
                <button className="ml-8 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600" onClick={handleBackToCards}>Back to Cards</button>
            </div>
        );
    }

    return (
        <div className="flex w-full h-full">
            {/* Left Quick Menu (fixed 120px) */}
            <aside className="flex flex-col justify-between items-center w-[120px] bg-gray-950 py-6 border-r border-gray-900">
                <div className="flex flex-col gap-4">
                    {/* Cards: always active */}
                    <button
                        title="Cards"
                        className={`p-3 rounded-lg text-2xl transition
              ${activeMenu === "cards" ? "bg-gray-800" : ""}
            `}
                        onClick={() => setActiveMenu("cards")}
                    >
                        📇
                    </button>
                    {/* Image Viewer: only clickable if enabled */}
                    <button
                        title="Image Viewer"
                        className={`p-3 rounded-lg text-2xl transition
              ${activeMenu === "imageViewer" ? "bg-gray-800" : ""}
              ${!imageViewerEnabled ? "opacity-50 pointer-events-none cursor-not-allowed" : ""}
            `}
                        onClick={() => imageViewerEnabled && setActiveMenu("imageViewer")}
                        disabled={!imageViewerEnabled}
                    >
                        🖼️
                    </button>
                    {/* Terminal: only clickable if enabled */}
                    <button
                        title="Terminal"
                        className={`p-3 rounded-lg text-2xl transition
              ${activeMenu === "terminal" ? "bg-gray-800" : ""}
              ${!terminalEnabled ? "opacity-50 pointer-events-none cursor-not-allowed" : ""}
            `}
                        onClick={() => terminalEnabled && setActiveMenu("terminal")}
                        disabled={!terminalEnabled}
                    >
                        💻
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    <button title="Dark/Light Mode" className="p-3 rounded-lg text-2xl">🌗</button>
                    <button title="Settings" onClick={openConfigModal} className="p-3 rounded-lg text-2xl">⚙️</button>
                </div>
            </aside>

            {/* Center area */}
            <div
                className="flex-1 p-8 overflow-y-auto"
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
                className="h-full bg-gray-900 border-l border-gray-800 transition-all duration-200"
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
                            <p className="text-gray-300 mb-4">{activeTool.description}</p>
                            <button
                                className="mt-4 px-4 py-2 bg-blue-700 rounded hover:bg-blue-800 transition"
                                onClick={openConfigModal}
                            >
                                Edit Tool Settings
                            </button>
                        </>
                    ) : (
                        <div className="text-gray-400">Select a tool card to view more info.</div>
                    )}
                </div>
            </aside>
        </div>
    );
}
