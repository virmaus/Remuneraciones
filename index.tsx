
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("Sistema Transtecnia Remuneraciones Local Iniciado.");

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
