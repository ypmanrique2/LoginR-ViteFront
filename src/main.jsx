import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

{logueado && (
  <button style={{ position: "absolute", top: 10, right: 10 }} onClick={cerrarSesion}>
      Cerrar Sesión
  </button>
)}
