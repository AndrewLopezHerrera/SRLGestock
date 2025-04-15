import { useNavigate } from "react-router-dom";
import { Form, Button, Input, Modal } from "antd";
import "./InicioSesion.css"
import InfoSesion from "./Sesion";
import { useState } from "react";

function InicioSesion(){
  const [error, setError] = useState<boolean>(false);
  const [tituloError, setTituloError] = useState<string>("");
  const [cuerpoError, setCuerpoError] = useState<string>(""); 

  const navegador = useNavigate();

  const iniciarSesion = async (datos: { correoElectronico: string; contrasena: string }) => {
    try {
      const respuestaInicioSesion = await fetch(InfoSesion.ObtenerIPBackend() + "/IniciarSesion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      if (!respuestaInicioSesion.ok) {
        const { error } = await respuestaInicioSesion.json();
        throw new Error(error);
      }

      const { idSesion } = await respuestaInicioSesion.json();

      const respuestaInformacion = await fetch(InfoSesion.ObtenerIPBackend() + "/RecuperarInformacionGeneralUsuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({idSesion}),
      });

      if (!respuestaInformacion.ok) {
        const { error } = await respuestaInformacion.json();
        throw new Error(error);
      }

      const { nombre, apellidoPaterno, nombreRol } = await respuestaInformacion.json();

      InfoSesion.IniciarSesion(idSesion, nombre, apellidoPaterno, nombreRol);

      navegador("/menuPrincipal");
    }
    catch (err) {
      if (typeof err === "object" && err !== null && "message" in err) {
        setTituloError("Error al iniciar sesión");
        setCuerpoError(String((err as any).message));
      } else {
        setTituloError("Error al iniciar sesión");
        setCuerpoError("Error desconocido");
      }
      setError(true);
    }
  }

  const mostrarError = () => {
    setTituloError("Error al iniciar sesión");
    setCuerpoError("Por favor, revisa los campos antes de continuar");
    setError(true);
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
    </div>
  );
}
;
export default InicioSesion;