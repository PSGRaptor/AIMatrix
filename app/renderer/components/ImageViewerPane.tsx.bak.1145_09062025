// app/renderer/components/ImageViewerPane.tsx

import React, { useEffect, useState } from "react";
import { ToolConfig } from "../env";
import Viewer from "react-viewer";

import tiff from "tiff";
import piexif from "piexifjs";

type Props = {
    folderPath: string;
    onClose: () => void;
};

type ImageViewerPaneProps = {
    folderPath: string;        // The folder path to show images from
    onClose: () => void;       // Called when viewer should close
};

type ImageFile = { src: string; alt: string };

const isTiff = (filename: string) =>
    /\.(tiff?|tif)$/i.test(filename);

const isImage = (filename: string) =>
    /\.(jpg|jpeg|png|webp|bmp|gif|tiff?|tif)$/i.test(filename);

export default function ImageViewerPane({
                                            tool,
                                            folderPath,
                                            onClose,
                                        }: {
    tool: ToolConfig | null;
    folderPath: string | null;
    onClose: () => void;
}) {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (!folderPath) return;
        // Get file list from backend
        (async () => {
            const files: string[] = await (window.electronAPI as any).getImageFilesInFolder(folderPath);
            setImages(
                files.map(filename => ({
                    src: `file://${folderPath.replace(/\\/g, "/")}/${filename}`,
                    alt: filename,
                }))
            );
        })();
    }, [folderPath]);

    return (
        <div style={{ height: "100%", width: "100%", background: "#111" }}>
            <button
                onClick={() => {
                    setVisible(false);
                    setTimeout(onClose, 250);
                }}
                className="absolute top-4 left-4 z-10 bg-gray-800 text-white px-4 py-2 rounded"
            >
                Back
            </button>
            <Viewer
                visible={visible}
                images={images}
                onClose={() => {
                    setVisible(false);
                    setTimeout(onClose, 250);
                }}
                zIndex={9999}
                drag={true}
                noNavbar={false}
                noToolbar={false}
                scalable={true}
                zoomable={true}
                downloadable={true}
            />
        </div>
    );
}
