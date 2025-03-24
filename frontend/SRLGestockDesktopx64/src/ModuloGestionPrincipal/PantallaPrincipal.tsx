import { useNavigate } from "react-router-dom";
import { Form, Button, Input, message } from "antd";

function ContrasenaOlvidada(){

  const navegador = useNavigate();

  const recuperarContrasena = async (datos: { correoElectronico: string}) => {

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

      navegador("/");
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

  const volverInicioSesion = () => {
    navegador("/");
  }

  return(
    <div className="contenedorPrincipal">
      <div className="bloqueFormularioInicioSesion">
        <div className="tituloInicioSesion">
          <b>Ingrese el correo electrónico del usuario a recuperar</b>
        </div>
        <div className="contenedorFormularioInicioSesion">
          <Form
            name="loginForm"
            onFinish={recuperarContrasena}
            onFinishFailed={mostrarError}
            className="formularioInicioSesion"
          >
            <Form.Item
              label=""
              name="correoElectronico"
              rules={[{ required: true, message: "El correo electrónico es obligatorio", type: "email" }]}
              className="itemForm"
            >
              <Input placeholder="Ingresa tu Correo Electrónico" className="entradasTextoInicioSesion" type="email"/>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                <b>Enviarme nueva contrasena</b>
              </Button>
            </Form.Item>
          </Form>
          <Button className="botonContrasenaOlvidada" onClick={volverInicioSesion}>
            <b>Volver</b>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ContrasenaOlvidada;