
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure we're using React.StrictMode
import React from 'react';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
