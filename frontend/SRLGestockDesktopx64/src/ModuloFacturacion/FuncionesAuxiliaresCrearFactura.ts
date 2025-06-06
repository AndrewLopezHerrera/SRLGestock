import ProductoLista from "../ModuloInventario/ProductoLista";
import InfoSesion from "../ModuloSesion/Sesion";

const TraerProductosCoincidencias = async (busqueda : string) : Promise<ProductoLista[]> => {
  let consecutivo = "";
  let nombre = "";
  const soloNumeros = /^\d+$/;
  if(soloNumeros.test(busqueda))
    consecutivo = busqueda;
  else
    nombre = busqueda;
  const idSesion : string = InfoSesion.ObtenerIdSesion();
  const respuestaBusqueda = await fetch(InfoSesion.ObtenerIPBackend() + "/VerProducto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({consecutivo, nombre, idSesion}),
  });
  if (!respuestaBusqueda.ok) {
    const { error } = await respuestaBusqueda.json();
    throw new Error(error);
  }
  const { resultado } = await respuestaBusqueda.json() as { resultado : ProductoLista[]};
  return resultado;
}

export { TraerProductosCoincidencias };