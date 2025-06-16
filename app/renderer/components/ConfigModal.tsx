import React, { useState, useEffect } from "react";
import type { ToolConfig } from "../env";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    initialTool?: ToolConfig | null;
    onSave: () => void;
};

const defaultTool: ToolConfig = {
    name: "",
    icon: "",
    description: "",
    toolRoot: "",
    url: "",
    outputFolder: "",
    updateCommand: "",
    startCommand: "",
};

const ConfigModal: React.FC<Props> = ({ isOpen, onClose, initialTool, onSave }) => {
    const [tool, setTool] = useState<ToolConfig>(initialTool ?? defaultTool);
    const [iconPreview, setIconPreview] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [saving, setSaving] = useState(false);

    // Reset form each open
    useEffect(() => {
        setTool(initialTool ?? defaultTool);
        setIconPreview(initialTool?.icon ?? "");
        setError("");
    }, [isOpen, initialTool]);

    // Field change handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTool((prev) => ({ ...prev, [name]: value }));
        if (name === "icon") setIconPreview(value);
    };

    // Browse dialogs
    const handleIconPick = async () => {
        const { canceled, filePaths } = await window.electronAPI.showOpenDialog();
        if (!canceled && filePaths[0]) {
            const relPath = await window.electronAPI.toolsCopyIcon(filePaths[0]);
            setTool((prev) => ({ ...prev, icon: relPath }));
            const userData = await window.electronAPI.getUserDataPath();
            setIconPreview(`file://${userData}/${relPath}`);
        }
    };
    const handleRootPick = async () => {
        const { canceled, filePaths } = await window.electronAPI.showOpenDialog();
        if (!canceled && filePaths[0]) setTool((prev) => ({ ...prev, toolRoot: filePaths[0] }));
    };
    const handleOutputPick = async () => {
        const { canceled, filePaths } = await window.electronAPI.showOpenDialog();
        if (!canceled && filePaths[0]) setTool((prev) => ({ ...prev, outputFolder: filePaths[0] }));
    };

    // Save handler
    const handleSave = async () => {
        setSaving(true);
        setError("");
        if (
            !tool.name ||
            !tool.icon ||
            !tool.description ||
            !tool.toolRoot ||
            !tool.url ||
            !tool.outputFolder ||
            !tool.startCommand
        ) {
            setError("Please fill all required fields.");
            setSaving(false);
            return;
        }
        try {
            await window.electronAPI.toolsSave(tool);
            setSaving(false);
            onSave();
            onClose();
        } catch (e: any) {
            setError(`Failed to save: ${e.message ?? e}`);
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-lg w-full border border-gray-300 dark:border-gray-700 p-6 relative">
                <button
                    className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500"
                    aria-label="Close"
                    onClick={onClose}
                >&times;</button>
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                    {initialTool ? "Edit Tool" : "Add New Tool"}
                </h2>
                <form
                    onSubmit={e => { e.preventDefault(); handleSave(); }}
                    className="flex flex-col gap-5"
                >
                    <div>
                        <label className="block font-semibold mb-1">Tool Name *</label>
                        <input
                            name="name"
                            value={tool.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Tool Icon / Image *</label>
                        <div className="flex gap-3 items-center">
                            <input
                                name="icon"
                                value={tool.icon}
                                onChange={handleChange}
                                placeholder="Emoji or icon path"
                                required
                                className="flex-1 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                            />
                            <button
                                type="button"
                                onClick={handleIconPick}
                                className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
                            >
                                Browse
                            </button>
                            {iconPreview && (
                                iconPreview.startsWith("file://") ?
                                    <img src={iconPreview} alt="Icon preview" className="w-8 h-8 rounded" /> :
                                    <span className="text-2xl">{iconPreview}</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Description *</label>
                        <textarea
                            name="description"
                            value={tool.description}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Tool Root Folder *</label>
                        <div className="flex gap-3 items-center">
                            <input
                                name="toolRoot"
                                value={tool.toolRoot}
                                onChange={handleChange}
                                required
                                className="flex-1 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                            />
                            <button
                                type="button"
                                onClick={handleRootPick}
                                className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
                            >
                                Browse
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Tool URL *</label>
                        <input
                            name="url"
                            value={tool.url}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Output Folder *</label>
                        <div className="flex gap-3 items-center">
                            <input
                                name="outputFolder"
                                value={tool.outputFolder}
                                onChange={handleChange}
                                required
                                className="flex-1 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                            />
                            <button
                                type="button"
                                onClick={handleOutputPick}
                                className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
                            >
                                Browse
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Update Command</label>
                        <input
                            name="updateCommand"
                            value={tool.updateCommand}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Start Command *</label>
                        <input
                            name="startCommand"
                            value={tool.startCommand}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                        />
                    </div>
                    {error && <div className="text-red-600 font-medium mt-2">{error}</div>}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold"
                        >
                            {saving ? "Saving..." : initialTool ? "Save Changes" : "Add Tool"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConfigModal;
