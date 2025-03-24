import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InicioSesion from './ModuloSesion/InicioSesion';
import ContrasenaOlvidada from './ModuloSesion/ContrasenaOlvidada';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioSesion />} />
        <Route path="/recuperarContrasena" element={<ContrasenaOlvidada />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
