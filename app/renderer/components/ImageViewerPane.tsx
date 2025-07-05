// app/renderer/components/ImageViewerPane.tsx

import React, { useEffect, useState, useRef, useCallback } from "react";
import { ToolConfig } from "../env";
import Viewer from "react-viewer-aim";
import piexif from "piexifjs";
import chunksExtract from "png-chunks-extract";
import PNGtext from "png-chunk-text";
import { FixedSizeGrid as Grid, GridChildComponentProps } from "react-window";

// --- Constants ---
const THUMB_SIZE = 220;
const GRID_GAP = 16;
const GRID_BUFFER_ROWS = 2;

// --- Type Definitions ---
type ImageViewerPaneProps = {
    tool: ToolConfig | null;
    onBack: () => void;
};
type ImageFile = { alt: string; filePath: string };
type ThumbCache = Record<number, string>;

// --- Extract PNG Metadata as Text Chunks ---
function extractPngTextChunks(dataUrl: string): Record<string, string> {
    try {
        const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
        const buffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const chunks = chunksExtract(buffer);
        const texts: Record<string, string> = {};
        for (const chunk of chunks) {
            if (chunk.name === "tEXt" || chunk.name === "zTXt" || chunk.name === "iTXt") {
                try {
                    const textData = PNGtext.decode(chunk.data);
                    texts[textData.keyword] = textData.text;
                } catch {}
            }
        }
        return texts;
    } catch {
        return {};
    }
}

const ImageViewerPane: React.FC<ImageViewerPaneProps> = ({ tool, onBack }) => {
    // --- State ---
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);
    const [folders, setFolders] = useState<string[]>([]);
    const [images, setImages] = useState<ImageFile[]>([]);
    const [thumbs, setThumbs] = useState<ThumbCache>({});
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [thumbView, setThumbView] = useState(true);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [visible, setVisible] = useState(false);
    const [showExif, setShowExif] = useState(false);
    const [exifData, setExifData] = useState<any | null>(null);

    // For grid width calculation
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(1200);

    // --- Tool/folder state resets ---
    useEffect(() => {
        setThumbView(true);
        setShowExif(false);
        setVisible(false);
        setImages([]);
        setThumbs({});
        setProgress(0);
        setExifData(null);
        setActiveIndex(0);

        if (!tool?.outputFolder) {
            setCurrentFolder(null);
            setFolders([]);
            return;
        }
        setCurrentFolder(tool.outputFolder);

        (async () => {
            try {
                const subfolders: string[] = await window.electronAPI.listFoldersInFolder(tool.outputFolder);
                setFolders([tool.outputFolder, ...subfolders]);
            } catch {
                setFolders([tool.outputFolder]);
            }
        })();
    }, [tool]);

    // --- Folder: get image names (not base64!) ---
    useEffect(() => {
        let isMounted = true;
        setImages([]);
        setThumbs({});
        setProgress(0);
        setExifData(null);
        setActiveIndex(0);

        if (!currentFolder) return;

        (async () => {
            setIsLoading(true);
            try {
                const files: string[] = await window.electronAPI.getImageFilesInFolder(currentFolder);
                const imageArr: ImageFile[] = files
                    .filter(filename => !!filename)
                    .map(filename => ({
                        alt: filename,
                        filePath: `${currentFolder}/${filename}`,
                    }));
                if (isMounted) setImages(imageArr);
            } catch {
                if (isMounted) setImages([]);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        })();

        return () => { isMounted = false; };
    }, [currentFolder]);

    // --- Responsive: recalc columns ---
    useEffect(() => {
        function handleResize() {
            if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    useEffect(() => {
        if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
    }, [thumbView, images.length]);

    const colCount = Math.max(1, Math.floor(containerWidth / (THUMB_SIZE + GRID_GAP)));
    const rowCount = Math.ceil(images.length / colCount);

    // --- JIT thumbnail loader ---
    const loadThumb = useCallback(
        (idx: number) => {
            if (!images[idx] || thumbs[idx]) return;
            window.electronAPI.readImageAsDataUrl(images[idx].filePath).then(dataUrl => {
                if (dataUrl) {
                    setThumbs(old => ({ ...old, [idx]: dataUrl }));
                    setProgress(() => {
                        const total = images.length || 1;
                        const loaded = Object.keys(thumbs).length + 1;
                        return Math.round((loaded / total) * 100);
                    });
                }
            });
        },
        // don't include thumbs in deps: otherwise it triggers infinite loads!
        [images]
    );

    // --- EXIF for current image, only when showExif changes ---
    useEffect(() => {
        if (!showExif) return;
        const src = thumbs[activeIndex];
        if (!src) { setExifData(null); return; }
        if (src.startsWith("data:image/png")) {
            setExifData(extractPngTextChunks(src));
        } else {
            try {
                setExifData(piexif.load(src));
            } catch { setExifData(null); }
        }
    }, [activeIndex, thumbs, showExif]);

    // --- Folder display helper ---
    function displayFolder(folderPath: string) {
        if (!tool?.outputFolder) return folderPath;
        if (folderPath === tool.outputFolder) return "Root";
        return folderPath.replace(tool.outputFolder, "").replace(/^[/\\]/, "");
    }

    // --- Virtual Grid Cell Renderer ---
    const Cell = ({ columnIndex, rowIndex, style }: GridChildComponentProps) => {
        const idx = rowIndex * colCount + columnIndex;
        if (idx >= images.length) return null;
        const img = images[idx];
        if (!thumbs[idx]) loadThumb(idx);
        return (
            <div
                style={{
                    ...style,
                    left: (style.left as number) + GRID_GAP,
                    top: (style.top as number) + GRID_GAP,
                    width: THUMB_SIZE,
                    height: THUMB_SIZE,
                    padding: 0,
                }}
                className="flex items-center justify-center bg-[#1c1c1c] rounded-xl shadow-lg cursor-pointer hover:ring-4 ring-blue-400"
                title={img.alt}
                onClick={() => {
                    setActiveIndex(idx);
                    setThumbView(false);
                    setVisible(true);
                    setShowExif(false);
                    setExifData(null);
                }}
            >
                {thumbs[idx] ? (
                    <img
                        src={thumbs[idx]}
                        alt={img.alt}
                        style={{
                            maxWidth: "96%",
                            maxHeight: "96%",
                            borderRadius: 10,
                            objectFit: "contain",
                            background: "#fff"
                        }}
                    />
                ) : (
                    <div className="text-xs text-gray-600">Loading...</div>
                )}
            </div>
        );
    };

    // --- Render ---
    return (
        <div className="relative w-full h-full bg-[#111] flex flex-col" style={{ minHeight: 0, minWidth: 0 }}>
            {/* --- Top Bar: Back & Folder Picker --- */}
            <div className="flex items-center gap-4 p-3 z-20">
                <button
                    onClick={() => {
                        setVisible(false);
                        setThumbView(true);
                        setShowExif(false);
                        setExifData(null);
                        setTimeout(onBack, 250);
                    }}
                    className="bg-gray-800 text-white px-4 py-2 rounded"
                >
                    Back
                </button>
                {folders.length > 1 && (
                    <select
                        className="bg-gray-900 text-white px-2 py-1 rounded"
                        value={currentFolder || ""}
                        onChange={e => setCurrentFolder(e.target.value)}
                    >
                        {folders.map(folder =>
                            <option key={folder} value={folder}>
                                {displayFolder(folder)}
                            </option>
                        )}
                    </select>
                )}
            </div>

            {/* --- Loading Progress Overlay --- */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-xl text-blue-300 mb-4">Scanning Images…</div>
                    <div className="w-2/3 h-4 bg-gray-800 rounded overflow-hidden mb-2">
                        <div
                            className="h-full bg-blue-500"
                            style={{ width: `${progress}%`, transition: "width 0.3s" }}
                        />
                    </div>
                    <div className="text-xs text-gray-400">{progress}%</div>
                </div>
            )}

            {/* --- Virtualized Thumbnail Grid --- */}
            {thumbView && !isLoading && (
                <div
                    ref={containerRef}
                    className="flex-1 w-full h-full pt-8 pb-4 overflow-auto"
                    style={{ minHeight: 0, minWidth: 0 }}
                >
                    {images.length === 0 ? (
                        <div className="text-xl text-gray-400 mt-10 select-none">
                            No images found in this folder.
                        </div>
                    ) : (
                        // TS2786 workaround: cast Grid to any if types package causes error
                        <Grid
                            columnCount={colCount}
                            rowCount={rowCount}
                            columnWidth={THUMB_SIZE + GRID_GAP}
                            rowHeight={THUMB_SIZE + GRID_GAP}
                            width={containerWidth}
                            height={window.innerHeight - 110}
                            overscanRowCount={GRID_BUFFER_ROWS}
                        >
                            {Cell}
                        </Grid>
                    )}
                </div>
            )}

            {/* --- Single Image Viewer (zoomable, modal style) --- */}
            {!thumbView && images.length > 0 && (
                <Viewer
                    visible={visible}
                    images={images.map((img, idx) => ({
                        src: thumbs[idx] || "",
                        alt: img.alt
                    }))}
                    activeIndex={activeIndex}
                    onChange={(i: any) =>
                        setActiveIndex(
                            typeof i === "number"
                                ? i
                                : (typeof i === "object" && i !== null && typeof i.index === "number")
                                    ? i.index
                                    : activeIndex
                        )
                    }
                    onClose={() => {
                        setVisible(false);
                        setThumbView(true);
                        setShowExif(false);
                        setExifData(null);
                    }}
                    zIndex={9999}
                    drag={true}
                    noNavbar={false}
                    noToolbar={false}
                    scalable={true}
                    zoomable={true}
                    downloadable={true}
                    customToolbar={(toolbar: any) =>
                        [
                            ...toolbar,
                            {
                                key: "exif",
                                render: (
                                    <button
                                        key="exif"
                                        title="Show EXIF"
                                        className="react-viewer-toolbar-btn"
                                        style={{ margin: "0 8px", padding: 4, borderRadius: 4 }}
                                        onClick={e => {
                                            e.stopPropagation();
                                            setShowExif(true);
                                        }}
                                    >
                                        🛈 EXIF
                                    </button>
                                ),
                                onClick: () => setShowExif(true),
                            }
                        ]
                    }
                />
            )}

            {/* --- EXIF Modal for current image --- */}
            {showExif && images.length > 0 && thumbs[activeIndex] && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-[11000]">
                    <div className="max-w-lg max-h-[90vh] overflow-auto bg-white/95 dark:bg-gray-900/95 text-black dark:text-white rounded-xl shadow-xl p-6 border border-blue-400 relative">
                        <button
                            className="absolute top-4 right-4 px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 text-black dark:bg-gray-700 dark:text-white dark:hover:bg-gray-800"
                            onClick={() => setShowExif(false)}
                        > Close </button>
                        <h3 className="text-lg font-bold mb-2">
                            Metadata for <span className="font-mono">{images[activeIndex]?.alt || ""}</span>
                        </h3>
                        <div className="text-xs max-h-[60vh] overflow-auto">
                            {exifData && typeof exifData === "object" && Object.keys(exifData).length > 0 ? (
                                Array.isArray(exifData) ? (
                                    exifData.map((item: any, idx: number) => (
                                        <div key={idx}>
                                            {typeof item === "object" ? JSON.stringify(item) : String(item)}
                                        </div>
                                    ))
                                ) : (
                                    Object.entries(exifData).map(([k, v]) =>
                                        typeof v === "object" && v !== null && Object.keys(v).length > 0 ? (
                                            <div key={k} className="mb-2">
                                                <div className="font-semibold text-blue-700 dark:text-blue-400">{k}</div>
                                                {Object.entries(v).map(([tag, val]) => (
                                                    <div key={tag} className="flex gap-2 py-0.5">
                                                        <div className="w-40 text-gray-700 dark:text-gray-200">{tag}</div>
                                                        <div className="flex-1 text-gray-900 dark:text-gray-50 break-words">{String(val)}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div key={k} className="mb-2">
                                                <div className="font-semibold text-blue-700 dark:text-blue-400">{k}</div>
                                                <div className="flex-1 text-gray-900 dark:text-gray-50 break-words">{String(v)}</div>
                                            </div>
                                        )
                                    )
                                )
                            ) : (
                                <div className="text-gray-400">No EXIF or PNG metadata found.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageViewerPane;
