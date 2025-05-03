import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InicioSesion from './ModuloSesion/InicioSesion';
import ContrasenaOlvidada from './ModuloSesion/ContrasenaOlvidada';
import MenuPrincipal from './ModuloGestionPrincipal/PantallaPrincipal';
import Admistracion from './ModuloAdministracion/Administracion';
import ActualizacionInformacionUsuario from './ModuloGestionUsuario/ActualizarInformacionUsuario';
import MenuInventario from './ModuloInventario/MenuInventario';
import CrearProducto from './ModuloInventario/CrearProducto';
import SeleccionarProducto from './ModuloInventario/SeleccionarProducto';
import EditarProducto from './ModuloInventario/EditarProducto';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioSesion />} />
        <Route path="/recuperarContrasena" element={<ContrasenaOlvidada />} />
        <Route path="/menuPrincipal" element={<MenuPrincipal />} />
        <Route path="/administracion" element={<Admistracion />} />
        <Route path="/actualizarInformacionUsuario" element={<ActualizacionInformacionUsuario />} />
        <Route path="/menuInventario" element={<MenuInventario />} />
        <Route path="/crearProducto" element={<CrearProducto />} />
        <Route path="/seleccionarProducto" element={<SeleccionarProducto />} />
        <Route path="/editarProducto/:id" element={<EditarProducto />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
