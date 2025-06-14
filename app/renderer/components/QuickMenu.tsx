import React from 'react';

type QuickMenuProps = {
    onConfigClick: () => void;
};

const QuickMenu: React.FC<QuickMenuProps> = ({ onConfigClick }) => {
    return (
        <nav className="flex flex-col items-center py-4 bg-gray-900 w-[64px] h-full">
            {/* Top Icons */}
            <button className="mb-6" aria-label="Cards">
                <span role="img" aria-label="cards" className="text-2xl">🗂️</span>
            </button>
            <button className="mb-6 opacity-50 cursor-not-allowed" aria-label="Image Viewer" disabled>
                <span role="img" aria-label="image viewer" className="text-2xl">🖼️</span>
            </button>
            <button className="mb-6 opacity-50 cursor-not-allowed" aria-label="Terminal" disabled>
                <span role="img" aria-label="terminal" className="text-2xl">💻</span>
            </button>

            <div className="flex-1" />

            {/* Settings (Gear) Icon */}
            <button onClick={onConfigClick} aria-label="Settings">
                <span role="img" aria-label="settings" className="text-2xl">⚙️</span>
            </button>
        </nav>
    );
};

export default QuickMenu;
