
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App.tsx';
import './src/i18n.ts';

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
// Fix: Removed the AuthProvider wrapper because it was undefined in this scope and 
// it is already correctly provided inside the App component.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
