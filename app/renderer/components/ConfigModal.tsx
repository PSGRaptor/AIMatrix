import React, { useEffect, useState } from "react";
import { ToolConfig } from "../env";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    tool?: ToolConfig | null; // If present, we're editing
    onSaved: () => void;
};

const emptyTool: ToolConfig = {
    name: "",
    icon: "",
    description: "",
    toolRoot: "",
    url: "",
    outputFolder: "",
    updateCommand: "",
    startCommand: "",
};

export default function ConfigModal({ isOpen, onClose, tool, onSaved }: Props) {
    // Unique key so React resets state when switching tools
    const [form, setForm] = useState<ToolConfig>(emptyTool);
    const [isDeleteConfirm, setDeleteConfirm] = useState(false);
    const [isSaving, setSaving] = useState(false);
    const [resetKey, setResetKey] = useState(0);

    // When tool or modal open state changes, update/reset form
    useEffect(() => {
        if (tool) setForm(tool);
        else setForm(emptyTool);
        setResetKey(prev => prev + 1); // force input reset
    }, [tool, isOpen]);

    if (!isOpen) return null;

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // --- Browse Button Handlers ---

    const handleBrowseIcon = async () => {
        const result = await window.electronAPI.showOpenDialog({
            title: "Choose an Icon Image",
            filters: [
                { name: "Images", extensions: ["png", "jpg", "jpeg", "ico", "svg", "webp"] },
            ],
            properties: ["openFile"]
        });
        if (result && !result.canceled && result.filePaths.length) {
            const relPath = await window.electronAPI.toolsCopyIcon(result.filePaths[0]);
            setForm(prev => ({ ...prev, icon: relPath }));
        }
    };

    const handleBrowseOutputFolder = async () => {
        const result = await window.electronAPI.showOpenDialog({
            title: "Select Output Folder",
            properties: ["openDirectory"]
        });
        if (result && !result.canceled && result.filePaths.length) {
            setForm(prev => ({ ...prev, outputFolder: result.filePaths[0] }));
        }
    };

    const handleBrowseStartCommand = async () => {
        const result = await window.electronAPI.showOpenDialog({
            title: "Select Start Command (Executable, Script, etc)",
            filters: [
                { name: "Executables", extensions: ["exe", "bat", "cmd", "sh", "ps1"] },
                { name: "All Files", extensions: ["*"] }
            ],
            properties: ["openFile"]
        });
        if (result && !result.canceled && result.filePaths.length) {
            setForm(prev => ({ ...prev, startCommand: result.filePaths[0] }));
        }
    };

    const handleBrowseRootFolder = async () => {
        const result = await window.electronAPI.showOpenDialog({
            title: "Select Tool Root Folder",
            properties: ["openDirectory"]
        });
        if (result && !result.canceled && result.filePaths.length) {
            setForm(prev => ({ ...prev, toolRoot: result.filePaths[0] }));
        }
    };

    // --- Save ---
    const handleSave = async () => {
        setSaving(true);
        await window.electronAPI.toolsSave(form);
        setSaving(false);
        onSaved();
        onClose();
    };

    // --- Delete ---
    const handleDelete = async () => {
        if (!tool) return;
        await window.electronAPI.toolsDelete(tool.name);
        onSaved();
        onClose();
    };

    // --- Modal Title Logic ---
    const modalTitle = tool && tool.name
        ? `Edit: ${tool.name}`
        : "Add New Tool";

    return (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center">
            <div className="relative bg-white dark:bg-gray-900 text-gray-900 dark:text-white w-full max-w-3xl rounded-2xl shadow-xl p-8 border-2 border-blue-500/60 dark:border-blue-400/80">
                <h2 className="text-2xl font-bold mb-4">
                    {tool ? `Edit ${tool.name}` : "Add New Tool"}
                </h2>
                <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    onSubmit={e => {
                        e.preventDefault();
                        handleSave();
                    }}
                    key={resetKey}
                >
                    {/* COLUMN 1 */}
                    <div className="space-y-4">
                        {/* Tool Name */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Tool Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleInput}
                                required
                                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border"
                                disabled={!!tool} // Prevent changing name on edit
                            />
                        </div>
                        {/* Icon (with Browse) */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Icon (emoji or path)</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="icon"
                                    value={form.icon}
                                    onChange={handleInput}
                                    className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border"
                                />
                                <button
                                    type="button"
                                    className="px-2 py-1 bg-blue-600 text-white rounded"
                                    title="Browse for Icon"
                                    onClick={handleBrowseIcon}
                                    disabled={isSaving}
                                >
                                    Browse
                                </button>
                            </div>
                        </div>
                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleInput}
                                rows={3}
                                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border"
                            />
                        </div>
                        {/* Tool Root Folder (with Browse) */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Tool Root Folder</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="toolRoot"
                                    value={form.toolRoot}
                                    onChange={handleInput}
                                    className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border"
                                />
                                <button
                                    type="button"
                                    className="px-2 py-1 bg-blue-600 text-white rounded"
                                    title="Browse for Tool Root Folder"
                                    onClick={handleBrowseRootFolder}
                                    disabled={isSaving}
                                >
                                    Browse
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* COLUMN 2 */}
                    <div className="space-y-4">
                        {/* Web UI URL */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Web UI URL</label>
                            <input
                                type="text"
                                name="url"
                                value={form.url}
                                onChange={handleInput}
                                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border"
                            />
                        </div>
                        {/* Output Folder (with Browse) */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Output Folder</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="outputFolder"
                                    value={form.outputFolder}
                                    onChange={handleInput}
                                    className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border"
                                />
                                <button
                                    type="button"
                                    className="px-2 py-1 bg-blue-600 text-white rounded"
                                    title="Browse for Output Folder"
                                    onClick={handleBrowseOutputFolder}
                                    disabled={isSaving}
                                >
                                    Browse
                                </button>
                            </div>
                        </div>
                        {/* Start Command (with Browse) */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Start Command</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="startCommand"
                                    value={form.startCommand}
                                    onChange={handleInput}
                                    required
                                    className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border"
                                />
                                <button
                                    type="button"
                                    className="px-2 py-1 bg-blue-600 text-white rounded"
                                    title="Browse for Start Command"
                                    onClick={handleBrowseStartCommand}
                                    disabled={isSaving}
                                >
                                    Browse
                                </button>
                            </div>
                        </div>
                        {/* Update Command */}
                        <div>
                            <label className="block text-sm font-semibold mb-1">Update Command</label>
                            <input
                                type="text"
                                name="updateCommand"
                                value={form.updateCommand}
                                onChange={handleInput}
                                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 border"
                            />
                        </div>
                    </div>
                    {/* Modal Actions */}
                    <div className="md:col-span-2 flex justify-end gap-2 pt-6 border-t mt-4">
                        {tool && (
                            <button
                                type="button"
                                className={`px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold mr-auto`}
                                onClick={() => setDeleteConfirm(true)}
                                disabled={isSaving}
                            >
                                Delete
                            </button>
                        )}
                        <button
                            type="button"
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-900 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-800"
                            onClick={onClose}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
                {/* Delete Confirmation Modal */}
                {isDeleteConfirm && (
                    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border shadow-xl text-center">
                            <div className="mb-4 text-xl font-semibold text-red-600">Delete Tool?</div>
                            <div className="mb-6 text-gray-700 dark:text-gray-200">
                                Are you sure you want to delete <b>{tool?.name}</b>? This action cannot be undone.
                            </div>
                            <div className="flex justify-center gap-4">
                                <button
                                    className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-900 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-800"
                                    onClick={() => setDeleteConfirm(false)}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-5 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
                                    onClick={handleDelete}
                                    disabled={isSaving}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
