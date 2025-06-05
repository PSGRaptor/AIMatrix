// Main layout view: left quick menu, tool card grid, right info panel
import React from 'react';
import QuickMenu from '../components/QuickMenu';
import ToolCard from '../components/ToolCard';

const dummyTools = [
    {
        name: 'Stable Diffusion',
        icon: './assets/app-logo.svg',
        description: 'Advanced image synthesis and text-to-image generation.',
    },
    {
        name: 'ComfyUI',
        icon: './assets/app-logo.svg',
        description: 'Visual node-based workflow for AI image models.',
    },
    {
        name: 'InvokeAI',
        icon: './assets/app-logo.svg',
        description: 'Creative image generation interface.',
    },
];

export default function MainView(props: { openAboutModal: () => void; openConfigModal: () => void }) {
    return (
        <div className="flex flex-1 min-h-0">
            {/* Left: Quick Menu */}
            <aside className="h-full">
                <QuickMenu />
            </aside>
            {/* Center: Tool Cards */}
            <section className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
                {dummyTools.map((tool) => (
                    <ToolCard
                        key={tool.name}
                        name={tool.name}
                        icon={tool.icon}
                        description={tool.description}
                    />
                ))}
            </section>
            {/* Right: Info Panel (stub) */}
            <aside className="w-[320px] p-6 bg-gray-900 hidden lg:block border-l border-gray-800">
                <h2 className="font-bold text-xl mb-2">Information Panel</h2>
                <p className="text-sm text-gray-400">
                    Select a tool card to view more information, settings, or logs here.
                </p>
            </aside>
        </div>
    );
}
