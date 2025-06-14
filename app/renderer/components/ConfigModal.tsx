import React, { useState, useEffect } from "react";

// Tool type, can be placed at the top of app/renderer/components/ConfigModal.tsx or utils/loadTools.ts

export interface Tool {
    name: string;
    icon: string;
    description: string;
    toolRoot: string;
    url: string;
    outputFolder: string;
    updateCommand?: string;
    startCommand: string;
    createdAt?: string;
    lastModified?: string;
    platforms?: string[];
    author?: string;
    notes?: string;
}

type Props = {
    isOpen: boolean;
    onClose: () => void;
    initialTool?: Tool | null;
    onSave: () => void;
};

const defaultTool: Tool = {
    name: '',
    icon: '',
    description: '',
    toolRoot: '',
    url: '',
    outputFolder: '',
    updateCommand: '',
    startCommand: '',
};

const ConfigModal: React.FC<Props> = ({ isOpen, onClose, initialTool, onSave }) => {
    const [tool, setTool] = useState<Tool>(initialTool ?? defaultTool);
    const [iconPreview, setIconPreview] = useState<string>('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    // Access electronAPI safely!
    const electronAPI = (window as any).electronAPI;

    useEffect(() => {
        setTool(initialTool ?? defaultTool);
        setIconPreview(initialTool?.icon ?? '');
        setError('');
    }, [isOpen, initialTool]);

    // Update field handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTool({ ...tool, [e.target.name]: e.target.value });
        if (e.target.name === 'icon') setIconPreview(e.target.value);
    };

    // Icon picker using Electron dialog
    const handleIconPick = async () => {
        const { canceled, filePaths } = await electronAPI.invoke('showOpenDialog');
        if (!canceled && filePaths[0]) {
            const relPath = await electronAPI.invoke('tools:copyIcon', filePaths[0]);
            setTool(t => ({ ...t, icon: relPath }));
            // Icon preview uses local file path
            const userData = await electronAPI.invoke('getUserDataPath');
            setIconPreview(`file://${userData}/${relPath}`);
        }
    };

    // Save tool config
    const handleSave = async () => {
        setSaving(true);
        setError('');
        if (!tool.name || !tool.icon || !tool.description || !tool.toolRoot || !tool.url || !tool.outputFolder || !tool.startCommand) {
            setError('Please fill all required fields.');
            setSaving(false);
            return;
        }
        try {
            await electronAPI.invoke('tools:save', tool);
            setSaving(false);
            onSave();
            onClose();
        } catch (e) {
            setError(`Failed to save: ${e}`);
            setSaving(false);
        }
    };

    if (!isOpen) return null;
    return (
        <div className="modal-backdrop">
            <div className="modal-window">
                <div className="modal-header">
                    <h2>{initialTool ? 'Edit Tool' : 'Add New Tool'}</h2>
                    <button onClick={onClose} aria-label="Close">&times;</button>
                </div>
                <div className="modal-content">
                    <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                        <label>Tool Name *<input name="name" value={tool.name} onChange={handleChange} required /></label>
                        <label>
                            Tool Icon / Image *
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
                                <input name="icon" value={tool.icon} onChange={handleChange} placeholder="Emoji or icon path" required />
                                <button type="button" onClick={handleIconPick}>Browse...</button>
                                {iconPreview && (
                                    iconPreview.startsWith('file://') ?
                                        <img src={iconPreview} alt="Icon preview" style={{ width: 32, height: 32 }} /> :
                                        <span style={{ fontSize: 32 }}>{iconPreview}</span>
                                )}
                            </div>
                        </label>
                        <label>Description *<textarea name="description" value={tool.description} onChange={handleChange} required /></label>
                        <label>Tool Root Folder *<input name="toolRoot" value={tool.toolRoot} onChange={handleChange} required /></label>
                        <label>Tool URL *<input name="url" value={tool.url} onChange={handleChange} required /></label>
                        <label>Output Folder *<input name="outputFolder" value={tool.outputFolder} onChange={handleChange} required /></label>
                        <label>Update Command<input name="updateCommand" value={tool.updateCommand || ''} onChange={handleChange} /></label>
                        <label>Start Command *<input name="startCommand" value={tool.startCommand} onChange={handleChange} required /></label>
                        <label>Notes<textarea name="notes" value={tool.notes || ''} onChange={handleChange} /></label>
                        {error && <div className="error">{error}</div>}
                        <div className="modal-actions">
                            <button type="button" onClick={onClose}>Cancel</button>
                            <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Tool'}</button>
                        </div>
                    </form>
                </div>
            </div>
            {/* Modal CSS */}
            <style>{`
        .modal-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;
        }
        .modal-window {
          background: var(--background, #23272e); color: var(--text, #fff); border-radius: 12px; min-width: 480px; max-width: 98vw;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1em 2em 0 2em; }
        .modal-content { padding: 2em; }
        .error { color: red; margin-top: 1em; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 1em; margin-top: 2em; }
        .modal-actions button { padding: 0.5em 1.5em; border-radius: 6px; border: none; background: #222; color: #fff; }
      `}</style>
        </div>
    );
};

export default ConfigModal;
