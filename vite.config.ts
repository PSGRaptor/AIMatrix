import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    root: 'app/renderer',
    build: {
        outDir: '../../dist/renderer',
        emptyOutDir: true,
    },
    plugins: [react()],
    server: {
        port: 5173
    }
});
