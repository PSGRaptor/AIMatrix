// app/renderer/components/ThemeToggle.tsx

import React from "react";

type ThemeToggleProps = {
    theme: "dark" | "light";
    setTheme: (t: "dark" | "light") => void;
};

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme }) => (
    <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={`
            w-10 h-10 rounded-full flex items-center justify-center
            transition-colors duration-200
            ${theme === "dark"
            ? "bg-gray-800 text-yellow-400"
            : "bg-gray-200 text-gray-800"}
            shadow-lg
        `}
        title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        aria-label="Theme toggle"
    >
        {theme === "dark" ? (
            <span role="img" aria-label="Light Mode" style={{ fontSize: 22 }}>🌞</span>
        ) : (
            <span role="img" aria-label="Dark Mode" style={{ fontSize: 22 }}>🌙</span>
        )}
    </button>
);

export default ThemeToggle;
