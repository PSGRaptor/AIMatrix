import React, { useEffect, useRef } from "react";

export default function ConfigModal({ onClose }: { onClose: () => void }) {
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
                <h2 className="text-2xl font-bold mb-3">Settings</h2>
                <div className="mb-8 text-gray-700 dark:text-gray-300">
                    This is a placeholder for app configuration.<br />
                    Tool management and preferences coming soon.
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
