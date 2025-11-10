// En: src/main.tsx  <-- ¡FíjATE EN EL NUEVO NOMBRE DE ARCHIVO!
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App' // <-- Esto ahora buscará App.tsx
import './App.css' 
import 'react-toastify/dist/ReactToastify.css';  

// El '!' al final le dice a TypeScript: "Confía en mí, este elemento existe".
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)