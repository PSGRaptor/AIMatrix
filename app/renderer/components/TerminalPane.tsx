import React, { useEffect, useRef } from "react";
import { ToolConfig } from "../env";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";

type TerminalPaneProps = {
    tool: ToolConfig | null;
    onBack: () => void;
};

export default function TerminalPane({ tool, onBack }: TerminalPaneProps) {
    const termRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);

    useEffect(() => {
        if (!tool || !termRef.current) return;

        if (xtermRef.current) {
            xtermRef.current.dispose();
        }

        const xterm = new Terminal({
            fontSize: 16,
            theme: { background: "#101014", foreground: "#fff" },
            cursorBlink: true, // <-- Make cursor blink
        });
        xterm.open(termRef.current);
        xterm.writeln(`Launching: ${tool.startCommand} (in ${tool.toolRoot})...`);

        // Run process with tool.name as key
        window.electronAPI.runToolTerminal(tool.startCommand, tool.toolRoot, tool.name);

        // Display output from main process
        const dataHandler = (data: string) => xterm.write(data);
        const exitHandler = (code: number) => xterm.writeln(`\r\n[Process exited with code ${code}]`);
        window.electronAPI.onToolTerminalData(dataHandler);
        window.electronAPI.onToolTerminalExit(exitHandler);

        // Handle user input and send to main process
        const handleUserInput = (data: string) => {
            window.electronAPI.sendTerminalInput(tool.name, data);
        };
        xterm.onData(handleUserInput);

        xtermRef.current = xterm;

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
            <div ref={termRef} style={{ height: "calc(100% - 40px)", background: "#101014", borderRadius: 8, padding: 4, flex: 1 }} />
        </div>
    );
}
