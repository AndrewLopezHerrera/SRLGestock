import { useNavigate } from "react-router-dom";
import "./Administracion.css"
import { Button } from "antd";
import CreacionUsuario from "../ModuloGestionUsuario/CrearUsuarios";
import { useState } from "react";

function Admistracion(){
  const navegador = useNavigate();

  const [pantallaActual, setPantallaActual] = useState<React.ReactNode>(null);

  const irMenuPrincipal = () => {
    navegador("/menuPrincipal");
  }

  const cambiarPantalla = (pantalla : string) => {
    if(pantalla === 'CrearUsuario'){
      setPantallaActual(<CreacionUsuario/>);
      return;
    }
  }

  return(
    <div className="contenedorPrincipalAdministracion">
      <div className="contenedorTituloBotonVolverAdministracion">
        <div className="contenedorBotonVolverAdministracion">
          <Button onClick={irMenuPrincipal} className="botonVolver">Volver</Button>
        </div>
        <div className="contenedorTituloAdministracion">
          <h1 className="tituloAdministracion">Administracion</h1>
        </div>
        <div className="contenedorBotonVolverAdministracion" />
      </div>
      <div className="contenedorAccionesAdministracion">
        <div className="contenedorBotonesAccionesAdministracion">
          <Button onClick={() => cambiarPantalla("CrearUsuario")} className="botonAccionAdministracion">Crear Usuarios</Button>
        </div>
        <div className="contenedorPantallaAccionAdministracion">
          {pantallaActual}
        </div>
      </div>
    </div>
  );
}
;
export default Admistracion;
