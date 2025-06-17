import React, { useEffect, useState } from "react";
import { ToolConfig } from "../env";
import Viewer from "react-viewer";
import piexif from "piexifjs";

// ------ Type Definitions ------

// Props for this component
type ImageViewerPaneProps = {
    tool: ToolConfig | null;         // The tool whose output folder to show
    onBack: () => void;              // Callback for "Back" button
};

// Represents a single image and its source/file info
type ImageFile = { src: string; alt: string; filePath: string };

// ------ ImageViewerPane Component ------
const ImageViewerPane: React.FC<ImageViewerPaneProps> = ({ tool, onBack }) => {
    // Current output folder being viewed
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);

    // All available folders (root + subfolders)
    const [folders, setFolders] = useState<string[]>([]);

    // Loaded images (as data URLs)
    const [images, setImages] = useState<ImageFile[]>([]);

    // Viewer visibility (react-viewer modal)
    const [visible, setVisible] = useState(false);

    // Index of the currently viewed image in the array
    const [activeIndex, setActiveIndex] = useState<number>(0);

    // Loaded EXIF data for current image
    const [exifData, setExifData] = useState<any | null>(null);

    // Loading/progress state
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    // Show/hide the thumbnail grid before full viewer
    const [thumbView, setThumbView] = useState(true);

    // ------ FOLDER & TOOL LOGIC ------
    // On tool change, reset to show root output folder and load subfolders (one level)
    useEffect(() => {
        if (!tool || !tool.outputFolder) {
            setCurrentFolder(null);
            setFolders([]);
            setImages([]);
            return;
        }
        setCurrentFolder(tool.outputFolder);
        (async () => {
            try {
                // Ask backend for all folders in the tool's output folder (including root)
                const subfolders: string[] = await window.electronAPI.listFoldersInFolder(tool.outputFolder);
                setFolders([tool.outputFolder, ...subfolders]);
            } catch {
                setFolders([tool.outputFolder]);
            }
        })();
    }, [tool]);

    // ------ IMAGE LOADING LOGIC ------
    // When currentFolder changes, scan for image files and load them as data URLs
    useEffect(() => {
        let isMounted = true;
        setImages([]);           // Reset images while loading new folder
        setExifData(null);       // Reset exif display
        setProgress(0);          // Reset progress bar
        if (!currentFolder) return;

        (async () => {
            setIsLoading(true);
            try {
                // Get list of image files from backend (filtered by extension)
                const files: string[] = await window.electronAPI.getImageFilesInFolder(currentFolder);
                const imageArr: ImageFile[] = [];
                let loaded = 0;
                for (const filename of files) {
                    if (!filename) continue;
                    const absPath = `${currentFolder}/${filename}`;
                    try {
                        // Read image as base64 data URL via backend
                        const dataUrl = await window.electronAPI.readImageAsDataUrl(absPath);
                        if (dataUrl) {
                            imageArr.push({ src: dataUrl, alt: filename, filePath: absPath });
                        }
                    } catch {}
                    loaded++;
                    // Update progress % (to show in UI)
                    if (isMounted && files.length > 0) setProgress(Math.round((loaded / files.length) * 100));
                }
                if (isMounted) {
                    setImages(imageArr);   // Show found images
                    setActiveIndex(0);     // Start at first image
                }
            } catch {
                if (isMounted) setImages([]);
            } finally {
                if (isMounted) setIsLoading(false); // Done loading
            }
        })();
        return () => { isMounted = false; }; // Cancel async work on unmount
    }, [currentFolder]);

    // ------ EXIF LOGIC ------
    // When image or selection changes, extract EXIF using piexifjs
    useEffect(() => {
        if (!images.length || !images[activeIndex] || !images[activeIndex].src) {
            setExifData(null);
            return;
        }
        try {
            const exifObj = piexif.load(images[activeIndex].src);
            setExifData(exifObj);
        } catch {
            setExifData(null);
        }
    }, [activeIndex, images]);

    // On tool/folder change, always show thumbnails first
    useEffect(() => {
        setThumbView(true);
    }, [tool, currentFolder]);

    // Display helper: get nice subfolder names for dropdown
    function displayFolder(folderPath: string) {
        if (!tool?.outputFolder) return folderPath;
        if (folderPath === tool.outputFolder) return "Root";
        return folderPath.replace(tool.outputFolder, "").replace(/^\/|\\/, "");
    }

    // No images found in current folder
    const noImages = images.length === 0;

    // ------ RENDER ------
    return (
        <div style={{ height: "100%", width: "100%", background: "#111", position: "relative" }}>
            {/* ---------- Top Bar: Folder Picker & Back ---------- */}
            <div className="flex items-center gap-4 p-3 absolute top-0 left-0 z-20">
                {/* Back button: closes viewer */}
                <button
                    onClick={() => {
                        setVisible(false);
                        setTimeout(onBack, 250);
                    }}
                    className="bg-gray-800 text-white px-4 py-2 rounded"
                >
                    Back
                </button>
                {/* Dropdown to pick between root and subfolders */}
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

            {/* ---------- Loading Progress ---------- */}
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black bg-opacity-80">
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

            {/* ---------- Thumbnail Grid ---------- */}
            {thumbView && !isLoading && images.length > 0 && (
                <div className="flex flex-wrap justify-center items-center gap-4 pt-20">
                    {images.map((img, idx) => (
                        <div
                            key={img.alt + idx}
                            className="cursor-pointer hover:ring-4 ring-blue-400"
                            style={{
                                width: 180,
                                height: 180,
                                background: "#1c1c1c",
                                borderRadius: 12,
                                overflow: "hidden",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                            // Clicking a thumb opens modal viewer at that image
                            onClick={() => {
                                setActiveIndex(idx);
                                setThumbView(false);
                                setVisible(true);
                            }}
                        >
                            <img
                                src={img.src}
                                alt={img.alt}
                                style={{
                                    maxWidth: 200,
                                    maxHeight: 170,
                                    borderRadius: 10,
                                    objectFit: "contain",
                                    background: "#fff"
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* ---------- Modal Image Viewer ---------- */}
            <Viewer
                visible={visible && !isLoading && images.length > 0 && !thumbView}
                images={images}
                activeIndex={activeIndex}
                onChange={(obj: any) => {
                    if (typeof obj === "number") setActiveIndex(obj);
                    else if (obj && typeof obj["index"] === "number") setActiveIndex(obj["index"]);
                }}
                onClose={() => {
                    setVisible(false);
                    setTimeout(onBack, 250);
                    setThumbView(true); // return to thumbs
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

            {/* ---------- EXIF Sidebar ---------- */}
            {(!isLoading && images.length > 0 && images[activeIndex] && exifData && !thumbView) && (
                <div className="fixed right-0 top-0 m-6 max-w-lg max-h-[90vh] overflow-auto bg-white/90 dark:bg-gray-900/90 text-black dark:text-white rounded-xl shadow-xl p-4 z-[10000] border border-blue-400">
                    <h3 className="text-lg font-bold mb-2">
                        EXIF Metadata for <span className="font-mono">{images[activeIndex].alt}</span>
                    </h3>
                    <div className="text-xs max-h-[60vh] overflow-auto">
                        {/* Show each EXIF IFD (e.g. "0th", "Exif", "GPS", etc) */}
                        {Object.keys(exifData).map(ifd =>
                                Object.keys(exifData[ifd]).length > 0 && (
                                    <div key={ifd} className="mb-2">
                                        <div className="font-semibold text-blue-700 dark:text-blue-400">{ifd}</div>
                                        {Object.entries(exifData[ifd]).map(([tag, val]) => (
                                            <div key={tag} className="flex gap-2 py-0.5">
                                                <div className="w-40 text-gray-700 dark:text-gray-200">{tag}</div>
                                                <div className="flex-1 text-gray-900 dark:text-gray-50 break-words">{String(val)}</div>
                                            </div>
                                        ))}
                                    </div>
                                )
                        )}
                    </div>
                </div>
            )}

            {/* ---------- Empty State (no images) ---------- */}
            {!isLoading && images.length === 0 && (
                <div className="flex items-center justify-center h-full w-full absolute top-0 left-0 text-xl text-gray-400 bg-black bg-opacity-70 z-50">
                    No images found in this folder.
                </div>
            )}
        </div>
    );
};

export default ImageViewerPane;
