import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Basic global styles to ensure the app displays correctly
const style = document.createElement('style');
style.textContent = `
  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; background-color: #f5f5f5; }
  #root { min-height: 100vh; }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
