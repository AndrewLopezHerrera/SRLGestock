import { useNavigate } from "react-router-dom";
import { Form, Button, Input, message } from "antd";
import "./InicioSesion.css"

function InicioSesion(){
  const navegador = useNavigate();

  const iniciarSesion = async (datos: { correoElectronico: string; contrasena: string }) => {

    try {
      /**const response = await fetch("https://tubackend.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        throw new Error("Error al iniciar sesión. El servidor no responde");
      }*/

      navegador("/menuPrincipal");
    }
    catch (err) {
      if (typeof err === "object" && err !== null && "message" in err) {
        message.error(String((err as any).message));
      } else {
        message.error("Error desconocido.");
      }
    }
  }

  const mostrarError = () => {
    message.error("Por favor, revisa los campos antes de continuar");
  }

  const irRecuperarContrasena = () => {
    navegador("/recuperarContrasena");
  }

  return(
    <div className="contenedorPrincipal">
      <div className="bloqueFormularioInicioSesion">
        <div className="tituloInicioSesion">
          <b>Iniciar Sesión</b>
        </div>
        <div className="contenedorFormularioInicioSesion">
          <Form
            name="loginForm"
            onFinish={iniciarSesion}
            onFinishFailed={mostrarError}
            className="formularioInicioSesion"
          >
            <Form.Item
              label=""
              name="correoElectronico"
              rules={[{ required: true, message: "El correo electrónico es obligatorio", type: "email"}]}
              className="itemForm"
            >
              <Input placeholder="Ingresa tu Correo Electrónico" className="entradasTextoInicioSesion" />
            </Form.Item>

            <Form.Item
              label=""
              name="contrasena"
              rules={[{ required: true, message: "La contraseña es obligatoria" }]}
              className="itemForm"
            >
              <Input.Password placeholder="Ingresa tu contraseña" className="entradasTextoInicioSesion" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                <b>Iniciar sesión</b>
              </Button>
            </Form.Item>
          </Form>
          <Button className="botonContrasenaOlvidada" onClick={irRecuperarContrasena}>
            <b>He olvidado la contraseña</b>
          </Button>
        </div>
      </div>
    </div>
  );
}
;
export default InicioSesion;