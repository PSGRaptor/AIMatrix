import React, { useEffect, useRef } from "react";
import { ToolConfig } from "../env";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";

// --- Strongly Typed Props ---
type TerminalPaneProps = {
    tool: ToolConfig | null;
    onBack: () => void;
};

// --- TerminalPane Component ---
const TerminalPane: React.FC<TerminalPaneProps> = ({ tool, onBack }) => {
    const termRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);

    useEffect(() => {
        if (!tool || !termRef.current) return;

        // Dispose previous xterm if exists
        if (xtermRef.current) {
            xtermRef.current.dispose();
        }

        const xterm = new Terminal({
            fontSize: 16,
            theme: { background: "#101014", foreground: "#fff" },
            cursorBlink: true,
        });
        xterm.open(termRef.current);
        xterm.writeln(`Launching: ${tool.startCommand} (in ${tool.toolRoot})...`);

        // Start the tool process (custom electronAPI must provide these methods)
        window.electronAPI.runToolTerminal(tool.startCommand, tool.toolRoot, tool.name);

        // Pipe terminal output from backend
        const dataHandler = (data: string) => xterm.write(data);
        const exitHandler = (code: number) => xterm.writeln(`\r\n[Process exited with code ${code}]`);
        window.electronAPI.onToolTerminalData(dataHandler);
        window.electronAPI.onToolTerminalExit(exitHandler);

        // Pipe user input from xterm to backend
        const handleUserInput = (data: string) => {
            window.electronAPI.sendTerminalInput(tool.name, data);
        };
        xterm.onData(handleUserInput);

        xtermRef.current = xterm;

        // Cleanup handlers and xterm on unmount/change
        return () => {
            xterm.dispose();
            window.electronAPI.onToolTerminalData(() => {});
            window.electronAPI.onToolTerminalExit(() => {});
        };
    }, [tool]);

    if (!tool) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                No tool selected.
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col">
            <div className="flex-none flex items-center mb-2">
                <button
                    className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
                    onClick={onBack}
                >
                    Back to Cards
                </button>
                <span className="ml-4 text-lg font-semibold">{tool.name} Terminal</span>
            </div>
            <div
                ref={termRef}
                style={{
                    height: "calc(100% - 40px)",
                    background: "#101014",
                    borderRadius: 8,
                    padding: 4,
                    flex: 1,
                    minHeight: 200,
                    minWidth: 0,
                }}
            />
        </div>
    );
};

export default TerminalPane;
