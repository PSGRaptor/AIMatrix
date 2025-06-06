import React from "react";

export default function ThemeToggle({
                                        theme,
                                        setTheme,
                                    }: {
    theme: "dark" | "light";
    setTheme: (t: "dark" | "light") => void;
}) {
    return (
        <button
            title="Toggle dark/light mode"
            aria-label="Toggle dark or light theme"
            className="p-3 rounded-lg text-2xl transition focus:outline-none"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            {theme === "dark" ? (
                // Moon outline
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                    <path
                        d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ) : (
                // Sun outline
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5" />
                    <path
                        d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 12.02l-1.41-1.41M6.34 17.66l-1.41 1.41"
                    />
                </svg>
            )}
        </button>
    );
}
