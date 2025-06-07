import React, { useEffect, useRef } from "react";
import { listenToolTerminalData, listenToolTerminalExit } from "../utils/ipc";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";

export default function ToolTerminalPanel({ onClose }: { onClose?: () => void }) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const term = useRef<Terminal | null>(null);

    useEffect(() => {
        term.current = new Terminal({ fontSize: 16, theme: { background: "#111", foreground: "#fff" } });
        term.current.open(terminalRef.current!);

        listenToolTerminalData(data => {
            term.current?.write(data.replace(/\n/g, "\r\n"));
        });
        listenToolTerminalExit(code => {
            term.current?.writeln(`\r\n\r\nProcess exited with code ${code}`);
            if (onClose) setTimeout(onClose, 1200); // Optional: auto-close panel
        });

        return () => {
            term.current?.dispose();
        };
    }, [onClose]);

    return (
        <div style={{ height: "100%", width: "100%", background: "#111" }}>
            <div ref={terminalRef} style={{ height: "100%", width: "100%" }} />
            <button
                className="absolute top-3 right-3 px-2 py-1 rounded bg-gray-800 text-white hover:bg-gray-700"
                onClick={onClose}
                style={{ zIndex: 10 }}
            >
                Close
            </button>
        </div>
    );
}
