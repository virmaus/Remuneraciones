
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("Iniciando Motor Transtecnia Remuneraciones...");

const startApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Ocultar error si el renderizado fue exitoso
    const errorBoundary = document.getElementById('error-boundary');
    if (errorBoundary) errorBoundary.style.display = 'none';
  } catch (err) {
    console.error("Error al renderizar React:", err);
  }
};

// Pequeño delay para asegurar que el DOM y el importmap estén listos
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
