// Sidebar quick menu; stub for now
import React from 'react';

export default function QuickMenu() {
    return (
        <nav className="flex flex-col items-center py-4 bg-gray-900 w-[64px] h-full">
            {/* Icons will go here (cards, image viewer, terminal, theme, config) */}
            <button className="mb-6">
                <span role="img" aria-label="cards" className="text-2xl">🗂️</span>
            </button>
            <button className="mb-6 opacity-50 cursor-not-allowed">
                <span role="img" aria-label="image viewer" className="text-2xl">🖼️</span>
            </button>
            <button className="mb-6 opacity-50 cursor-not-allowed">
                <span role="img" aria-label="terminal" className="text-2xl">💻</span>
            </button>
            <div className="flex-1" />
            <button>
                <span role="img" aria-label="settings" className="text-2xl">⚙️</span>
            </button>
        </nav>
    );
}
