// ─────────────────────────────────────────────────────────────
// index.js — Entry point
// You never need to edit this file.
// It just mounts the App into the HTML page.
// ─────────────────────────────────────────────────────────────
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
