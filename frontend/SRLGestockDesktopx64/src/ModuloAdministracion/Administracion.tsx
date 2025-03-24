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
      <div>
        <Button onClick={irMenuPrincipal}>Volver</Button>
        <h1>Administracion</h1>
      </div>
      <div>
        <div>
          <Button onClick={() => cambiarPantalla("CrearUsuario")}>Crear Usuarios</Button>
        </div>
        <div>
          {pantallaActual}
        </div>
      </div>
    </div>
  );
}
;
export default Admistracion;
