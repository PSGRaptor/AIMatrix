// app/renderer/components/ImageViewerPane.tsx

import React, { useEffect, useState } from "react";
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

type ImageFile = {
    url: string;      // Data URL or file:// URL for the viewer
    name: string;     // Filename
    exif?: any;       // Optionally EXIF data, you can extract if desired
};

const isTiff = (filename: string) =>
    /\.(tiff?|tif)$/i.test(filename);

const isImage = (filename: string) =>
    /\.(jpg|jpeg|png|webp|bmp|gif|tiff?|tif)$/i.test(filename);

export default function ImageViewerPane({ folderPath, onClose }: ImageViewerPaneProps) {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [visible, setVisible] = useState(true);

    // Fetch image file list from main process on mount
    useEffect(() => {
            async function loadImages() {
                if (!window.electronAPI?.getImageFilesInFolder) {
                    alert("Missing Electron API for file listing.");
                    return;
                }
                const files: string[] = await window.electronAPI.getImageFilesInFolder(folderPath);
                const imgFiles: ImageFile[] = [];
                for (const file of files) {
                    // Get ArrayBuffer from main process
                    const buf: ArrayBuffer = await window.electronAPI.readImageFileAsArrayBuffer(folderPath, file);
                    const blob = new Blob([buf]);
                    const url = URL.createObjectURL(blob);
                    imgFiles.push({ url, name: file });
                }
                setImages(imgFiles);
            }
            loadImages();
            return () => {
                // Clean up blobs on close
                images.forEach(img => URL.revokeObjectURL(img.url));
            };
            // eslint-disable-next-line
        }, [folderPath]);

    return (
        <Viewer
            visible={visible}
            images={images.map(img => ({ src: img.url, alt: img.name }))}
            activeIndex={0}
            onClose={() => { setVisible(false); onClose(); }}
            downloadable={true}
            drag={true}
            zIndex={4000}
            // You can add more props from react-viewer as needed
        />
    );
}
