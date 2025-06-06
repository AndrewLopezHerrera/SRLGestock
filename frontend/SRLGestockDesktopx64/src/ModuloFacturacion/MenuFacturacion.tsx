import { Button } from "antd";
import "./MenuFacturacion.css"
import { useNavigate } from "react-router-dom";
import CrearFacturaIcono from "../images/CrearFacturaIcono.png"
import VerFacturasIcono from "../images/VerFacturasIcono.png"

function MenuFacturacion(){
  const navegador = useNavigate();

  const irFacturar = () => {
    navegador("/pantallaFacturacion");
  };

  const irVerFacturas = () => {
    navegador("");
  }

  const irMenuPrincipal = () => {
    navegador("/menuPrincipal");
  }

  return(
    <div className="contenedorMenuFacturacion">
      <div className="contenedorTituloBotonVolverMenuFacturacion">
        <div className="contenedorBotonVolverMiUsuario">
          <Button onClick={irMenuPrincipal} className="botonVolver">Volver</Button>
        </div>
        <div className="contenedortituloMenuFacturacion">
          <h1 className="tituloMenuFacturacion">Menú de Facturacion</h1>
        </div>
        <div className="contenedorBotonVolverMiUsuario" />
      </div>
      <div className="contenedorBotonesMenuFacturacion">
        <div className="contenedorBotonMenuFacturacion">
          <Button onClick={irFacturar} className="botonMenuFacturacion">
            <img src={CrearFacturaIcono} className="imagenBotonMenuFacturacion"/>
            <div className="textoBotonesMenuFacturacion">Crear Factura</div>
          </Button>
        </div>
        <div className="contenedorBotonMenuFacturacion">
          <Button onClick={irVerFacturas} className="botonMenuFacturacion">
            <img src={VerFacturasIcono} className="imagenBotonMenuFacturacion"/>
            <div className="textoBotonesMenuFacturacion">Ver Facturas</div>
          </Button>
        </div>
      </div>
    </div>
  );
}
;
export default MenuFacturacion;