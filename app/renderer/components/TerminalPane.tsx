import React, { useEffect, useRef } from "react";
import { ToolConfig } from "../env";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

type TerminalPaneProps = {
    tool: ToolConfig | null;
    onBack: () => void;
};

const TerminalPane: React.FC<TerminalPaneProps> = ({ tool, onBack }) => {
    const termRef = useRef<HTMLDivElement>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
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
        const fitAddon = new FitAddon();
        xterm.loadAddon(fitAddon);

        xterm.open(termRef.current);
        fitAddon.fit(); // Always fit after opening

        fitAddonRef.current = fitAddon;
        xtermRef.current = xterm;

        xterm.writeln(`Connecting to: ${tool.startCommand} (in ${tool.toolRoot})...`);

        // Listen for window resize
        function handleResize() {
            if (fitAddonRef.current) fitAddonRef.current.fit();
        }
        window.addEventListener("resize", handleResize);

        // Check if the tool is already running before launching
        window.electronAPI.isToolRunning(tool.name).then(isRunning => {
            if (!isRunning) {
                window.electronAPI.runToolTerminal(tool.startCommand, tool.toolRoot, tool.name);
            }

            // Pipe terminal output from backend
            const dataHandler = (data: string) => xterm.write(data);
            const exitHandler = (code: number) => xterm.writeln(`\r\n[Process exited with code ${code}]`);
            window.electronAPI.onToolTerminalData(dataHandler);
            window.electronAPI.onToolTerminalExit(exitHandler);

            // Pipe user input from xterm to backend
            const handleUserInput = (input: string) => {
                window.electronAPI.sendTerminalInput(tool.name, input);
            };
            xterm.onData(handleUserInput);
        });

        // Cleanup handlers and xterm on unmount/change
        return () => {
            if (xtermRef.current) xtermRef.current.dispose();
            window.electronAPI.onToolTerminalData(() => {});
            window.electronAPI.onToolTerminalExit(() => {});
            window.removeEventListener("resize", handleResize);
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
        <div className="flex flex-col flex-1 min-h-0 min-w-0 w-full h-full">
            <div className="flex-none flex items-center mb-2 px-4 pt-4">
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
                className="flex-1 min-h-0 min-w-0"
                style={{
                    background: "#101014",
                    borderRadius: 8,
                    padding: 4,
                }}
            />
        </div>
    );
};

export default TerminalPane;
