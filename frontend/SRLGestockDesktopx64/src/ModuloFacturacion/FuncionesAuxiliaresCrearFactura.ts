import ProductoLista from "../ModuloInventario/ProductoLista";
import InfoSesion from "../ModuloSesion/Sesion";
import Factura from "./Factura";
import FacturaLista from "./FacturaLista";

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

const CrearFacturaAux = async (factura: Factura) : Promise<string> => {
  const facturaProcesada : Factura = reemplazarVaciosPorNA(factura);
  const idSesion : string = InfoSesion.ObtenerIdSesion();
  const respuestaProceso = await fetch(InfoSesion.ObtenerIPBackend() + "/CrearFactura", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({factura: facturaProcesada, idSesion}),
  });
  if (!respuestaProceso.ok) {
    const { error } = await respuestaProceso.json();
    throw new Error(error);
  }
  const { idFactura } = await respuestaProceso.json() as { idFactura : string};
  return idFactura;
}

function reemplazarVaciosPorNA<T extends Record<string, any>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, value === '' || value === "  " || value === "   " ? 'N/A' : value])
  ) as T;
}

const buscarFacturasAux = async (idFactura : string) : Promise<FacturaLista[]> => {
  const idSesion : string = InfoSesion.ObtenerIdSesion();
  const respuestaProceso = await fetch(InfoSesion.ObtenerIPBackend() + "/BuscarFactura", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({idFactura, idSesion}),
  });
  if (!respuestaProceso.ok) {
    const { error } = await respuestaProceso.json();
    throw new Error(error);
  }
  const { factura } = await respuestaProceso.json() as { factura : FacturaLista[]};
  return factura;
}

const seleccionarFacturaAux = async (idFactura : string) : Promise<Factura> => {
  const idSesion : string = InfoSesion.ObtenerIdSesion();
  const respuestaProceso = await fetch(InfoSesion.ObtenerIPBackend() + "/SeleccionarFactura", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({idFactura, idSesion}),
  });
  if (!respuestaProceso.ok) {
    const { error } = await respuestaProceso.json();
    throw new Error(error);
  }
  const { factura } = await respuestaProceso.json() as { factura : Factura};
  return factura;
}

export { TraerProductosCoincidencias, CrearFacturaAux, buscarFacturasAux, seleccionarFacturaAux};