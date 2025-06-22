import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from "vite-plugin-svgr";

export default defineConfig({
    root: 'app/renderer',
    build: {
        outDir: '../../dist/renderer',
        emptyOutDir: true,
    },
    plugins: [
        react(),
        svgr(),
    ],
    server: {
        port: 5173
    },
});
