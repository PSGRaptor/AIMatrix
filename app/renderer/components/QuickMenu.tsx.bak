import React from "react";

// Theme Toggle SVG (Sun/Moon as one toggle)
const IconTheme = ({ theme }: { theme: "dark" | "light" }) =>
    theme === "dark" ? (
        // Sun for Light Mode
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
             stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
    ) : (
        // Moon for Dark Mode
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
             stroke="#22223b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
        </svg>
    );

// Cards icon
const IconCards = ({ theme }: { theme: "dark" | "light" }) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
         stroke={theme === "dark" ? "#f1f5f9" : "#22223b"}
         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 5v14M17 5v14" opacity=".3" />
    </svg>
);

// Image Viewer icon
const IconImage = ({ theme }: { theme: "dark" | "light" }) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
         stroke={theme === "dark" ? "#f1f5f9" : "#22223b"}
         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8" cy="8" r="2.5" />
        <path d="M21 15l-5-5L5 21" />
    </svg>
);

// Terminal icon
const IconTerminal = ({ theme }: { theme: "dark" | "light" }) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
         stroke={theme === "dark" ? "#f1f5f9" : "#22223b"}
         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M8 10l2 2-2 2m4 2h4" />
    </svg>
);

// Settings (Gear) icon
const IconSettings = ({ theme }: { theme: "dark" | "light" }) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
         stroke={theme === "dark" ? "#60a5fa" : "#2563eb"}
         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.16a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82A1.65 1.65 0 0 0 3 12.89V12a1.65 1.65 0 0 0-1-1.51V11a2 2 0 0 1 0-4v.09A1.65 1.65 0 0 0 5 8.84c.42 0 .83-.16 1.14-.46.31-.31.47-.73.46-1.14A1.65 1.65 0 0 0 8 3.05V3a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 16 4.84c.42 0 .83.16 1.14.46.31.31.47.73.46 1.14A1.65 1.65 0 0 0 19 7.05V7a2 2 0 0 1 0 4v-.09A1.65 1.65 0 0 0 19.4 15Z" />
    </svg>
);

type QuickMenuProps = {
    onConfigClick: () => void;
    theme: "dark" | "light";
    setTheme: (t: "dark" | "light") => void;
};

const QuickMenu: React.FC<QuickMenuProps> = ({ onConfigClick, theme, setTheme }) => {
    return (
        <nav
            className={`flex flex-col items-center py-4 w-[78px] h-full border-r transition-colors duration-300
                ${theme === "dark"
                ? "bg-gray-900 border-gray-800"
                : "bg-gray-100 border-gray-200"
            }`}
            style={{ minWidth: 78, zIndex: 20 }}
        >
            {/* Top Icons */}
            <button className="mb-8" aria-label="Cards">
                <IconCards theme={theme} />
            </button>
            <button className="mb-8 opacity-50 cursor-not-allowed" aria-label="Image Viewer" disabled>
                <IconImage theme={theme} />
            </button>
            <button className="mb-8 opacity-50 cursor-not-allowed" aria-label="Terminal" disabled>
                <IconTerminal theme={theme} />
            </button>

            <div className="flex-1" />

            {/* Theme Toggle above gear icon */}
            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`
                    mb-5 w-14 h-14 rounded-full flex items-center justify-center border-2
                    transition-colors duration-300
                    ${theme === "dark"
                    ? "bg-gray-800 text-white "
                    : "bg-gray-200 text-gray-800 border-blue-300 shadow-md"}
                `}
                title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
                aria-label="Theme toggle"
            >
                <IconTheme theme={theme} />
            </button>

            {/* Settings (Gear) Icon */}
            <button
                onClick={onConfigClick}
                aria-label="Settings"
                title="Settings add tool"
                className={`
                    w-14 h-14 flex items-center justify-center rounded-full
                    ${theme === "dark"
                    ? "hover:bg-blue-800/40"
                    : "hover:bg-blue-200/60"}
                    transition
                `}
            >
                <IconSettings theme={theme} />
            </button>
        </nav>
    );
};

export default QuickMenu;
