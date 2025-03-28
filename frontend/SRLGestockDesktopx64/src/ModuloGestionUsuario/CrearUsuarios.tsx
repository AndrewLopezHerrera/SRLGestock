import { useNavigate } from "react-router-dom";
import { Form, Button, Input, message } from "antd";
import "./CrearUsuarios.css"

function CreacionUsuario(){
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
    <div className="contenedorPrincipalCrearUsuario">
      <div className="tituloCreacionUsuario">
        <b>Crear un usuario</b>
      </div>
      <div className="contenedorFormularioCrearUsuario">
        <Form
          name="loginForm"
          onFinish={iniciarSesion}
          onFinishFailed={mostrarError}
          className="formularioInicioSesion"
        >

          <Form.Item
            label="Primer Nombre: "
            name="primerNombre"
            rules={[{ required: true, message: "El primer nombre es obligatorio"}]}
            className="itemForm"
          >
            <Input placeholder="Ejemplo: Juan" className="entradasTextoInicioSesion" />
          </Form.Item>

          <Form.Item
            label="Primer Apellido: "
            name="primerApellido"
            rules={[{ required: true, message: "El primer apellido es obligatorio"}]}
            className="itemForm"
          >
            <Input placeholder="Ejemplo: Perez" className="entradasTextoInicioSesion" />
          </Form.Item>

          <Form.Item
            label="Segundo Apellido: "
            name="segundoApellido"
            rules={[{ required: true, message: "El segundo apellido es obligatorio"}]}
            className="itemForm"
          >
            <Input placeholder="Ejemplo: Orozco" className="entradasTextoInicioSesion" />
          </Form.Item>

          <Form.Item
            label="Correo Electrónico"
            name="correoElectronico"
            rules={[{ required: true, message: "El correo electrónico es obligatorio", type: "email"}]}
            className="itemForm"
          >
            <Input placeholder="Ejemplo: juanperez@mail.com" className="entradasTextoInicioSesion" />
          </Form.Item>

          <Form.Item
            label="Provincia: "
            name="provincia"
            rules={[{ required: true, message: "El telefono es obligatorio", type: "number"}]}
            className="itemForm"
          >
            <Input placeholder="Ejemplo: San José" className="entradasTextoInicioSesion" />
          </Form.Item>

          <Form.Item
            label="Cantón"
            name="canton: "
            rules={[{ required: true, message: "El telefono es obligatorio", type: "number"}]}
            className="itemForm"
          >
            <Input placeholder="Ejemplo: Escazú" className="entradasTextoInicioSesion" />
          </Form.Item>

          <Form.Item
            label="Distrito: "
            name="distrito"
            rules={[{ required: true, message: "El telefono es obligatorio", type: "number"}]}
            className="itemForm"
          >
            <Input placeholder="Ejemplo: San Rafael" className="entradasTextoInicioSesion" />
          </Form.Item>

          <Form.Item
            label="Señas exactas: "
            name="senasExactas"
            rules={[{ required: true, message: "El telefono es obligatorio", type: "number"}]}
            className="itemForm"
          >
            <Input placeholder="Ejemplo: 150m este de la iglesia" className="entradasTextoInicioSesion" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              <b>Crear nuevo usuario</b>
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
;
export default CreacionUsuario;