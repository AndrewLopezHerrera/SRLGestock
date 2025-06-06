import { Button, Input, Card, List, Modal } from "antd";
import "./SeleccionarProducto.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductoLista from "./ProductoLista";
import InfoSesion from "../ModuloSesion/Sesion";

function SeleccionarProducto(){
  const navegador = useNavigate();
  const [productos, setProductos] = useState<ProductoLista[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [tituloError, setTituloError] = useState<string>("");
  const [cuerpoError, setCuerpoError] = useState<string>("");

  const buscarProducto = async () => {
    try {
      const idSesion : string = InfoSesion.ObtenerIdSesion();
      const busqueda : string = (document.getElementById("entradaBusqueda") as HTMLInputElement)?.value ?? "";
      let consecutivo : string = "";
      let nombre : string = "";
      const soloNumeros = /^\d+$/;
      if(soloNumeros.test(busqueda))
        consecutivo = busqueda;
      else
        nombre = busqueda;
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

      const { resultado } = await respuestaBusqueda.json();
      setProductos(resultado);
    }
    catch (err) {
      if (typeof err === "object" && err !== null && "message" in err) {
        setTituloError("Error al crear el producto");
        setCuerpoError(String((err as any).message));
      } else {
        setTituloError("Error al crear el producto");
        setCuerpoError("Error desconocido");
      }
      setError(true);
    }
  }

  useEffect(() => {buscarProducto()});

  const editarProducto = (consecutivo : number | string) => {
    navegador("/editarProducto/" + consecutivo);
  }

  const irMenuInventario = () => {
    navegador("/menuInventario");
  }

  return(
    <div className="contenedorSeleccionarProducto">
      <div className="contenedorTituloBotonVolverSeleccionarProducto">
        <div className="contenedorBotonVolverSeleccionarProducto">
          <Button onClick={irMenuInventario} className="botonVolver">Volver</Button>
        </div>
        <div className="contenedorTituloSeleccionarProducto">
          <h1 className="tituloSeleccionarProducto">Seleccionar Producto</h1>
        </div>
        <div className="contenedorBotonVolverSeleccionarProducto" />
      </div>
      <div className="contenedorListaSeleccionarProducto">
        <div className="seccionFormularioSeleccionarProducto">
          <Input id="entradaBusqueda" placeholder="Escriba el consecutivo o el nombre del producto"  className="entradaSeleccionarProducto" />
        </div>
        <div className="contenedorProductos">
          <List
            grid={{ gutter: 16, column: 2 }}
            style={{width: '100%'}}
            dataSource={productos}
            locale={{ emptyText: 'Sin productos en el inventario' }}
            renderItem={(producto) => (
              <List.Item>
                <Card
                  title={producto.Nombre}
                  extra={<Button type="primary" onClick={() => editarProducto(producto.Consecutivo)}>Editar/Eliminar</Button>}
                >
                  <p><strong>Consecutivo:</strong> {producto.Consecutivo}</p>
                  <p><strong>Ventas:</strong> {producto.Ventas}</p>
                </Card>
              </List.Item>
            )}
          />
        </div>
        <div>
          <Modal
            title={tituloError}
            open={error}
            onOk={() => setError(false)}
            cancelButtonProps={{ style: { display: "none" } }}
          >
            <p>{cuerpoError}</p>
          </Modal>
        </div>
      </div>
    </div>
  );
}
;
export default SeleccionarProducto;