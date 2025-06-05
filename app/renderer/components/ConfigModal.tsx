// Settings/config modal (stub for now)
import React from 'react';

interface Props {
    onClose: () => void;
}

export default function ConfigModal({ onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-gray-900 rounded-lg shadow-xl p-8 max-w-lg w-full relative">
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                    onClick={onClose}
                    aria-label="Close Settings"
                >&times;</button>
                <h2 className="font-bold text-2xl mb-2">Settings (Coming Soon)</h2>
                <p className="text-sm text-gray-300">
                    The configuration modal will let you add/edit AI tools and change global app settings.
                </p>
            </div>
        </div>
    );
}
