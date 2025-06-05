// Root React app shell: includes layout, logo, About/config modal state, and main UI scaffolding
import React, { useState } from 'react';
import MainView from './views/MainView';
import AboutModal from './components/AboutModal';
import ConfigModal from './components/ConfigModal';

export default function App() {
    const [showAbout, setShowAbout] = useState(false);
    const [showConfig, setShowConfig] = useState(false);

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-950 text-white">
            {/* Top Navigation Bar */}
            <header className="flex items-center px-4 py-2 bg-gray-900 shadow-lg">
                <img src="./assets/app-logo.svg" className="w-8 h-8 mr-3" alt="AIMatrix Logo" />
                <span className="text-xl font-bold tracking-wide mr-8">AIMatrix</span>
                <nav className="flex gap-4">
                    <button onClick={() => setShowAbout(true)} className="hover:underline">About</button>
                    <button onClick={() => setShowConfig(true)} className="hover:underline">Settings</button>
                </nav>
                <span className="ml-auto text-xs text-gray-400">Alpha Build</span>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 min-h-0">
                <MainView
                    openAboutModal={() => setShowAbout(true)}
                    openConfigModal={() => setShowConfig(true)}
                />
            </main>

            {/* About Modal */}
            {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
            {/* Config Modal */}
            {showConfig && <ConfigModal onClose={() => setShowConfig(false)} />}
        </div>
    );
}
