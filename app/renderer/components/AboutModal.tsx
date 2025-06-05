// About modal for AIMatrix; opens from top nav
import React from 'react';

interface Props {
    onClose: () => void;
}

export default function AboutModal({ onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-gray-900 rounded-lg shadow-xl p-8 max-w-lg w-full relative">
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                    onClick={onClose}
                    aria-label="Close About"
                >&times;</button>
                <div className="flex items-center mb-4">
                    <img src="./assets/app-logo.svg" className="w-12 h-12 mr-3" alt="Logo" />
                    <div>
                        <h2 className="font-bold text-2xl">AIMatrix</h2>
                        <p className="text-xs text-gray-400">All-in-one AI Desktop Launcher</p>
                    </div>
                </div>
                <div className="mb-4 max-h-40 overflow-y-auto text-sm">
                    <p>
                        AIMatrix is a cross-platform launcher and management suite for locally hosted AI tools such as Stable Diffusion, ComfyUI, InvokeAI, and more. Easily add, configure, and launch tools from a single unified interface.
                        <br /><br />
                        Designed for creators and enthusiasts who want a modern, efficient way to manage their AI workflows.
                    </p>
                </div>
                <ul className="mb-4 text-xs text-gray-300">
                    <li><b>Version:</b> 0.1.0</li>
                    <li><b>Website:</b> <a className="text-blue-400 hover:underline" href="https://github.com/PSGRaptor/AIMatrix" target="_blank" rel="noopener noreferrer">AIMatrix on GitHub</a></li>
                    <li><b>Author:</b> PSGRaptor</li>
                    <li><b>Latest Update:</b> 2025-06-05</li>
                </ul>
            </div>
        </div>
    );
}
