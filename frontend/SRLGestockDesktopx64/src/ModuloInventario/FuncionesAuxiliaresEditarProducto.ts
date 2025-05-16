import InfoSesion from "../ModuloSesion/Sesion";
import Producto from "./Producto";

const seleccionarProductoAux = async (consecutivo : number) => {
  const idSesion : string = InfoSesion.ObtenerIdSesion();
  const respuestaEliminar = await fetch(InfoSesion.ObtenerIPBackend() + "/SeleccionarProducto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({consecutivo, idSesion}),
  });
  if (!respuestaEliminar.ok) {
    const { error } = await respuestaEliminar.json();
    throw new Error(error);
  }
  const { resultado } = await respuestaEliminar.json() as { resultado : Producto};
  return resultado;
}

const eliminarProductoAux = async (consecutivo : number) => {
  const idSesion : string = InfoSesion.ObtenerIdSesion();
  const respuestaEliminar = await fetch(InfoSesion.ObtenerIPBackend() + "/EliminarProducto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({consecutivo, idSesion}),
  });
  if (!respuestaEliminar.ok) {
    const { error } = await respuestaEliminar.json();
    throw new Error(error);
  }
  const { resultado } = await respuestaEliminar.json() as { resultado : boolean};
  return resultado;
}

export { eliminarProductoAux , seleccionarProductoAux };