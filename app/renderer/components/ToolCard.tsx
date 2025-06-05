// Individual tool card stub (for future expansion)
import React from 'react';

interface ToolCardProps {
    name: string;
    icon: string;
    description: string;
}

export default function ToolCard({ name, icon, description }: ToolCardProps) {
    return (
        <div className="bg-gray-800 rounded-xl shadow-md p-4 flex flex-col items-center m-2 w-60 hover:scale-105 transition-transform">
            <img src={icon} className="w-14 h-14 mb-3" alt={`${name} icon`} />
            <h3 className="font-semibold text-lg mb-1">{name}</h3>
            <p className="text-sm text-gray-400 text-center mb-2">{description}</p>
            <div className="flex gap-3 mt-2">
                <button className="bg-green-600 text-white px-3 py-1 rounded-md text-sm">Start</button>
                <button className="bg-gray-700 text-white px-3 py-1 rounded-md text-sm">Info</button>
            </div>
        </div>
    );
}
