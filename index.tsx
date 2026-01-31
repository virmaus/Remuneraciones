
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.Suspense fallback={<div className="p-8 text-center text-emerald-600 font-bold">Cargando Componentes...</div>}>
        <App />
      </React.Suspense>
    );
    // Si llegamos aquí, el JS cargó bien, ocultamos cualquier msg de error previo
    const errorMsg = document.getElementById('js-error');
    if (errorMsg) errorMsg.style.display = 'none';
  } catch (error) {
    console.error("Error fatal en el arranque:", error);
    rootElement.innerHTML = `<div style="padding: 2rem; color: #991b1b; background: #fee2e2; margin: 1rem; border-radius: 0.5rem; border: 1px solid #f87171;">
      <strong>Error de Aplicación:</strong> ${error instanceof Error ? error.message : 'Error desconocido'}<br>
      <button onclick="location.reload()" style="margin-top: 1rem; background: #991b1b; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">Recargar</button>
    </div>`;
  }
}
