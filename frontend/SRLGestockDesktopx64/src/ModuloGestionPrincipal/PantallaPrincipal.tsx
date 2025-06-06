import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import iconoUsuario from "../images/UsuarioIcono.png"
import iconoEquipo from "../images/EquipoIcono.png"
import iconoFactura from "../images/FacturaIcono.png"
import iconoInventario from "../images/InventarioIcono.png"
import iconoManana from "../images/iconoManana.png"
import iconoTarde from "../images/iconoTarde.png"
import iconoNoche from "../images/iconoNoche.png"
import iconoTazaCafe from "../images/TazaCafeIcono.png"
import "./PantallaPrincpal.css"
import InfoSesion from "../ModuloSesion/Sesion";


function MenuPrincipal(){

  const navegador = useNavigate();

  const rolUsuario : string = InfoSesion.ObtenerRolUsuario();

  const nombreUsuario = InfoSesion.ObtenerNombreUsuario();

  const verificarEsAdministrador = () => {
    if (rolUsuario === "Administrador")
      return true;
    return false;
  }

  const obtenerIconoDelDia = (): string => {
    const hora: number = new Date().getHours();
    if (hora >= 5 && hora < 12) {
      return iconoManana;
    } else if(hora >= 15 && hora < 16) {
      return iconoTazaCafe;
    } else if (hora >= 12 && hora < 18) {
      return iconoTarde;
    } else {
      return iconoNoche;
    }
  };

  const obtenerMomentoDelDia = (): string => {
    const hora: number = new Date().getHours();
  
    if (hora >= 5 && hora < 12) {
      return "Buenos días " + nombreUsuario + ".";
    } else if (hora >= 12 && hora < 18) {
      return "Buenas tardes " + nombreUsuario + ".";
    } else {
      return "Buenas noches " + nombreUsuario + ".";
    }
  };

  const irAdministracion = () => {
    navegador("/administracion");
  }

  const irMiUsuario = () => {
    navegador("/actualizarInformacionUsuario");
  }
  
  const irMenuInventario = () => {
    navegador("/menuInventario");
  }

  const irMenuFacturacion = () => {
    navegador("/menuFacturacion")
  }

  return(
    <div className="contenedorPrincipalMenuPrincipal">
      <div className="contenedortituloMenuPrincipal">
        <div className="contenedorSaludoImagenMenuPrincipal">
          <div className="contenedorSaludoMenuPrincipal">
            <h1 className="tituloSaludoMenuPrincipal">{obtenerMomentoDelDia()}</h1>
          </div>
          <img className="iconoDelDiaMenuPrincipal" src={obtenerIconoDelDia()} />
        </div>
        <div className="tituloUbicacionMenuPrincipal">
          Menú Principal
        </div>
      </div>
      <div className="contenedorBotonesMenuPrincipal">
        <div className="contenedorBotonMenuPrincipal">
          <Button className="botonMenuPrincipal" onClick={irMenuFacturacion}>
            <img src={iconoFactura} className="imagenBotonMenuPrincipal"/>
            <div className="textoBotonesMenuPrincipal">Facturación</div>
          </Button>
        </div>
        <div className="contenedorBotonMenuPrincipal">
          <Button className="botonMenuPrincipal" onClick={irMenuInventario}>
            <img src={iconoInventario} className="imagenBotonMenuPrincipal"/>
            <div className="textoBotonesMenuPrincipal">Gestión de inventario</div>
          </Button>
        </div>
        <div className="contenedorBotonMenuPrincipal">
          <Button className="botonMenuPrincipal" onClick={irMiUsuario}>
            <img src={iconoUsuario} className="imagenBotonMenuPrincipal"/>
            <div className="textoBotonesMenuPrincipal">Mi usuario</div>
          </Button>
        </div>
        {verificarEsAdministrador() &&
          <div className="contenedorBotonMenuPrincipal">
            <Button className="botonMenuPrincipal" onClick={irAdministracion}>
              <img src={iconoEquipo} className="imagenBotonMenuPrincipal"/>
              <div className="textoBotonesMenuPrincipal">Administración</div>
            </Button>
          </div>
        }
      </div>
    </div>
  );
}

export default MenuPrincipal;