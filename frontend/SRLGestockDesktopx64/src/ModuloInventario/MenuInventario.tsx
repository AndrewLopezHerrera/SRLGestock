import { Button } from "antd";
import "./MenuInventario.css"
import { useNavigate } from "react-router-dom";
import CrearProducto from "../images/CrearProductoIcono.png"
import EditarProducto from "../images/EditarProductoIcono.png"

function MenuInventario(){
  const navegador = useNavigate();

  const irCrearProducto = () => {
    navegador("/crearProducto");
  };

  const irSeleccionarProducto = () => {
    navegador("/seleccionarProducto");
  }

  const irMenuPrincipal = () => {
    navegador("/menuPrincipal");
  }

  return(
    <div className="contenedorMenuInventario">
      <div className="contenedorTituloBotonVolverMenuInventario">
        <div className="contenedorBotonVolverMiUsuario">
          <Button onClick={irMenuPrincipal} className="botonVolver">Volver</Button>
        </div>
        <div className="contenedortituloMenuInventario">
          <h1 className="tituloMenuInventario">Menú de Inventarios</h1>
        </div>
        <div className="contenedorBotonVolverMiUsuario" />
      </div>
      <div className="contenedorBotonesMenuInventario">
        <div className="contenedorBotonMenuInventario">
          <Button onClick={irCrearProducto} className="botonMenuInventario">
            <img src={CrearProducto} className="imagenBotonMenuInventario" onClick={irCrearProducto}/>
            <div className="textoBotonesMenuInventario">Crear Producto</div>
          </Button>
        </div>
        <div className="contenedorBotonMenuInventario">
          <Button onClick={irSeleccionarProducto} className="botonMenuInventario">
            <img src={EditarProducto} className="imagenBotonMenuInventario"/>
            <div className="textoBotonesMenuInventario">Editar Producto</div>
          </Button>
        </div>
      </div>
    </div>
  );
}
;
export default MenuInventario;