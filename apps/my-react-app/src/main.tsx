import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import type { Config } from './types';
import './index.css';

// Normally you'd use some other more secure way of creating and validating your config dependency, but we're keeping it
// simple for the purposes of this demo
const config: Config = {
  api: {
    baseUrl: import.meta.env.VITE_APP_API_URL || 'http://localhost:3000',
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App config={config} />
  </React.StrictMode>,
);
