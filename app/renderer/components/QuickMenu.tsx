// app/renderer/components/QuickMenu.tsx

import React from 'react';
// Import SVGs as React components
import CardsIcon from '../assets/icons/cards.svg?react';
import ImagesIcon from '../assets/icons/images.svg?react';
import TerminalIcon from '../assets/icons/terminal.svg?react';
import SettingsIcon from '../assets/icons/settings.svg?react';
import ThemeDarkIcon from '../assets/icons/theme-dark.svg?react';
import ThemeLightIcon from '../assets/icons/theme-light.svg?react';

type QuickMenuProps = {
    onConfigClick: () => void;
    theme: "dark" | "light";
    setTheme: (t: "dark" | "light") => void;
    activeMenu?: "cards" | "imageViewer" | "terminal";
    setActiveMenu?: (type: "cards" | "imageViewer" | "terminal") => void;
};

const ICON_SIZE = 32; // 20% larger than original

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
                <CardsIcon width={ICON_SIZE} height={ICON_SIZE} />
            </IconButton>
            <IconButton
                onClick={() => setActiveMenu && setActiveMenu("imageViewer")}
                label="Image Viewer"
                active={activeMenu === "imageViewer"}
                disabled={!setActiveMenu}
            >
                <ImagesIcon width={ICON_SIZE} height={ICON_SIZE} />
            </IconButton>
            <IconButton
                onClick={() => setActiveMenu && setActiveMenu("terminal")}
                label="Terminal"
                active={activeMenu === "terminal"}
                disabled={!setActiveMenu}
            >
                <TerminalIcon width={ICON_SIZE} height={ICON_SIZE} />
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
                <SettingsIcon width={ICON_SIZE} height={ICON_SIZE} />
            </IconButton>
        </nav>
    );
}
