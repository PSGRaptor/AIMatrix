import React, { useEffect, useRef } from "react";
import pkg from '../../../package.json';
import AppLogo from '../assets/app-logo.svg';
import gitInfo from '../git-info.json';

export default function AboutModal({ onClose }: { onClose: () => void }) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        function onClick(e: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
        }
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("mousedown", onClick);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("mousedown", onClick);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center">
            <div
                ref={modalRef}
                className="relative bg-white text-gray-900 dark:bg-gray-900 dark:text-white max-w-lg w-full rounded-2xl shadow-xl p-8 border-2 border-blue-500/60 dark:border-blue-400/80"
                tabIndex={-1}
            >
                <div className="flex items-center mb-4">
                    <img src={AppLogo} className="w-20 h-20 mr-4" alt="AIMatrix Logo" />
                    <span className="text-2xl font-bold tracking-wide">AI Matrix</span>
                </div>
                <div className="mb-2 flex items-center">
                    {/* Info Icon */}
                    <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" />
                        <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" />
                        <circle cx="12" cy="8" r="1" stroke="currentColor" />
                    </svg>
                    <span className="font-medium">All-in-one AI launcher & manager for desktop.</span>
                </div>
                <div className="mb-4 max-h-36 overflow-y-auto rounded bg-gray-50/80 dark:bg-gray-800/70 p-3 text-sm leading-relaxed">
                    AI Matrix lets you configure, launch, and manage powerful local AI tools from a unified, beautiful interface. <br />
                    This platform is built for performance, security, and ease-of-use on Windows 11—with cross-platform support coming soon.
                </div>
                <div className="flex items-center mb-1 text-sm">
                    {/* User Icon */}
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" />
                        <path d="M6 20c0-3 4-5 6-5s6 2 6 5" stroke="currentColor" />
                    </svg>
                    <span>Badaxiom</span>
                </div>
                <div className="flex items-center mb-1 text-sm">
                    {/* Calendar Icon */}
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <rect x="4" y="5" width="16" height="16" rx="2" stroke="currentColor" />
                        <path d="M8 3v4M16 3v4" stroke="currentColor" />
                    </svg>
                    <span>
                        Last Update:&nbsp;
                        {gitInfo.lastCommit
                        ? new Date(gitInfo.lastCommit).toLocaleDateString()
                        : "Unknown"}
                    </span>
                </div>
                <div className="flex items-center mb-1 text-sm">
                    <span className="mr-2">v{pkg.version}</span>
                    <a
                        href="https://github.com/PSGRaptor/AIMatrix"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline dark:text-blue-400 ml-2"
                    >
                        GitHub
                        <svg className="w-5 h-5 inline ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M10 14L21 3M21 3v7m0-7h-7" stroke="currentColor" />
                            <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" />
                        </svg>
                    </a>
                </div>
                <button
                    className="absolute top-4 right-4 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    aria-label="Close"
                    onClick={onClose}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" />
                        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
