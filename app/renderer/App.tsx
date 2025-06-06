import React, { useState, useEffect } from "react";
import MainView from "./views/MainView";
import AboutModal from "./components/AboutModal";
import ConfigModal from "./components/ConfigModal";

export default function App() {
    const [showAbout, setShowAbout] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const [theme, setTheme] = useState<"dark" | "light">(() => {
        const stored = localStorage.getItem("aimatrix-theme");
        return stored === "light" ? "light" : "dark";
    });

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("aimatrix-theme", theme);
    }, [theme]);

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-white">
            {/* Top Navigation Bar */}
            <header className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-900 shadow-lg">
                <img src="./assets/app-logo.svg" className="w-8 h-8 mr-3" alt="AIMatrix Logo" />
                <span className="text-xl font-bold tracking-wide mr-8">AIMatrix</span>
                <nav className="flex gap-4">
                    <button onClick={() => setShowAbout(true)} className="hover:underline">
                        About
                    </button>
                    <button onClick={() => setShowConfig(true)} className="hover:underline">
                        Settings
                    </button>
                </nav>
                <span className="ml-auto text-xs text-gray-400">Alpha Build</span>
            </header>
            <main className="flex flex-1 min-h-0">
                <MainView
                    openAboutModal={() => setShowAbout(true)}
                    openConfigModal={() => setShowConfig(true)}
                    theme={theme}
                    setTheme={setTheme}
                />
            </main>
            {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
            {showConfig && <ConfigModal onClose={() => setShowConfig(false)} />}
        </div>
    );
}
