// Entry point for React renderer. Mounts App.tsx in #root.
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/main.css';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
