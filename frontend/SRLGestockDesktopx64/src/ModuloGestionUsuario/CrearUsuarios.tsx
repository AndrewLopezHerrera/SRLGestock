import { useNavigate } from "react-router-dom";
import { Button } from "antd";

function CreacionUsuario(){
  const navegador = useNavigate();

  const irMenuPrincipal = () => {
    navegador("/menuPrincipal");
  }

  return(
    <div>
      <div>
        <Button onClick={irMenuPrincipal}>Volver</Button>
        <h1>Administracion</h1>
      </div>
      <div>
        <div>
          <Button>Crear Usuarios</Button>
        </div>
        <div>

        </div>
      </div>
    </div>
  );
}
;
export default CreacionUsuario;