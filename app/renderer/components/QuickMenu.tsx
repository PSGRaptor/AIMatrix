// app/renderer/components/QuickMenu.tsx

import React from 'react';
import { FixedSizeGrid } from "react-window";
// Import SVGs as React components for both dark and light mode
import CardsIconDark from '../assets/icons/cards-dark.svg?react';
import CardsIconLight from '../assets/icons/cards-light.svg?react';
import ImagesIconDark from '../assets/icons/images-dark.svg?react';
import ImagesIconLight from '../assets/icons/images-light.svg?react';
import TerminalIconDark from '../assets/icons/terminal-dark.svg?react';
import TerminalIconLight from '../assets/icons/terminal-light.svg?react';
import SettingsIconDark from '../assets/icons/settings-dark.svg?react';
import SettingsIconLight from '../assets/icons/settings-light.svg?react';
import ThemeDarkIcon from '../assets/icons/theme-dark.svg?react';
import ThemeLightIcon from '../assets/icons/theme-light.svg?react';

type QuickMenuProps = {
    onConfigClick: () => void;
    theme: "dark" | "light";
    setTheme: (t: "dark" | "light") => void;
    activeMenu?: string;
    setActiveMenu?: (type: "cards" | "imageViewer" | "terminal") => void;
};

const ICON_SIZE = 32; // 20% larger than original

// Helper to pick icon based on theme
function pickIcon(theme: string, LightIcon: any, DarkIcon: any) {
    return theme === "dark"
        ? <DarkIcon width={ICON_SIZE} height={ICON_SIZE} />
        : <LightIcon width={ICON_SIZE} height={ICON_SIZE} />;
}

export default function QuickMenu({
                                      onConfigClick,
                                      theme,
                                      setTheme,
                                      activeMenu,
                                      setActiveMenu,
                                  }: QuickMenuProps) {
    // Tooltip color class depending on theme
    const tooltipClass = theme === "dark"
        ? "bg-black text-white border-white"
        : "bg-blue-100 text-blue-900 border-blue-500";

    // Helper for icon buttons with tooltips
    function IconButton({
                            children,
                            onClick,
                            label,
                            active,
                            disabled
                        }: {
        children: React.ReactNode;
        onClick?: () => void;
        label: string;
        active?: boolean;
        disabled?: boolean;
    }) {
        return (
            <div className="relative flex flex-col items-center mb-7 group">
                <button
                    className={`
                        flex items-center justify-center rounded-full w-12 h-12
                        transition-all duration-150
                        ${active ? (theme === "dark" ? "bg-white/20" : "bg-blue-200") : ""}
                        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}
                    `}
                    onClick={disabled ? undefined : onClick}
                    aria-label={label}
                    tabIndex={disabled ? -1 : 0}
                    disabled={disabled}
                    type="button"
                >
                    {children}
                </button>
                {/* Tooltip */}
                <span
                    className={`pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs rounded px-2 py-1 border shadow
                    opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
                    ${tooltipClass}
                    `}
                    style={{ whiteSpace: 'nowrap', zIndex: 20, transition: 'opacity 0.2s' }}
                >
                    {label}
                </span>
            </div>
        );
    }

    return (
        <nav className={`flex flex-col items-center py-4 ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"} w-[72px] h-full transition-colors duration-200`}>
            {/* Main App Icons */}
            <IconButton
                onClick={() => setActiveMenu && setActiveMenu("cards")}
                label="Tool Cards"
                active={activeMenu === "cards"}
                disabled={false}
            >
                {pickIcon(theme, CardsIconLight, CardsIconDark)}
            </IconButton>
            <IconButton
                onClick={() => setActiveMenu && setActiveMenu("imageViewer")}
                label="Image Viewer"
                active={activeMenu === "imageViewer"}
                disabled={!setActiveMenu}
            >
                {pickIcon(theme, ImagesIconLight, ImagesIconDark)}
            </IconButton>
            <IconButton
                onClick={() => setActiveMenu && setActiveMenu("terminal")}
                label="Terminal"
                active={activeMenu === "terminal"}
                disabled={!setActiveMenu}
            >
                {pickIcon(theme, TerminalIconLight, TerminalIconDark)}
            </IconButton>

            {/* Theme Toggle Icon */}
            <div className="mb-10 mt-auto">
                <IconButton
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    label={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
                >
                    {theme === "dark"
                        ? <ThemeLightIcon width={ICON_SIZE} height={ICON_SIZE} />
                        : <ThemeDarkIcon width={ICON_SIZE} height={ICON_SIZE} />}
                </IconButton>
            </div>

            {/* Settings */}
            <IconButton
                onClick={onConfigClick}
                label="Settings"
            >
                {pickIcon(theme, SettingsIconLight, SettingsIconDark)}
            </IconButton>
        </nav>
    );
}
