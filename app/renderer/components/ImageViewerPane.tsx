import React, { useEffect, useState } from "react";
import { ToolConfig } from "../env";
import Viewer from "react-viewer";

type ImageViewerPaneProps = {
    tool: ToolConfig | null;
    onBack: () => void;
};

type ImageFile = { src: string; alt: string };

const ImageViewerPane: React.FC<ImageViewerPaneProps> = ({ tool, onBack }) => {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (!tool || !tool.outputFolder) return;
        (async () => {
            try {
                const files: string[] = await (window.electronAPI as any).getImageFilesInFolder(tool.outputFolder);
                setImages(
                    files.map(filename => ({
                        src: `file://${tool.outputFolder.replace(/\\/g, "/")}/${filename}`,
                        alt: filename,
                    }))
                );
            } catch (e) {
                setImages([]);
            }
        })();
    }, [tool]);

    const noImages = !images || images.length === 0;

    return (
        <div style={{ height: "100%", width: "100%", background: "#111", position: "relative" }}>
            <button
                onClick={() => {
                    setVisible(false);
                    setTimeout(onBack, 250);
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
                    setTimeout(onBack, 250);
                }}
                zIndex={9999}
                drag={true}
                noNavbar={false}
                noToolbar={false}
                scalable={true}
                zoomable={true}
                downloadable={true}
                customToolbar={() => []}
            />
            {noImages && (
                <div className="flex items-center justify-center h-full w-full absolute top-0 left-0 text-xl text-gray-400 bg-black bg-opacity-70 z-50">
                    No images found in this folder.
                </div>
            )}
        </div>
    );
};

export default ImageViewerPane;
