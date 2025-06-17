import React, { useEffect, useRef } from "react";
import { ToolConfig } from "../env";

/**
 * WebToolPane: Embeds the tool's web UI as a tab (using Electron webview).
 */
export default function WebToolPane({
                                        url,
                                        onBack,
                                        tool
                                    }: {
    url: string;
    onBack: () => void;
    tool: ToolConfig;
}) {
    const webviewRef = useRef<any>(null);

    useEffect(() => {
        if (webviewRef.current && url) {
            webviewRef.current.src = url;
        }
    }, [url]);

    return (
        <div className="relative h-full w-full bg-black">
            <button
                onClick={onBack}
                className="absolute top-4 left-4 z-10 bg-gray-800 text-white px-4 py-2 rounded"
            >
                Back
            </button>
            <webview
                ref={webviewRef}
                src={url}
                style={{ width: "100%", height: "100%", border: "none" }}
                allowpopups={true}
                webpreferences="contextIsolation=yes,nodeIntegration=no"
            />
        </div>
    );
}
