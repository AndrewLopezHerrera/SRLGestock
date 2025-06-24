import { useNavigate } from "react-router-dom";
import { Form, Button, Input, Modal, Spin } from "antd";
import "./InicioSesion.css"
import InfoSesion from "./Sesion";
import { useState } from "react";

function ContrasenaOlvidada(){

  const [esVisibleError, setEsVisibleError] = useState<boolean>(false);
  const [tituloModalError, setTituloModalError] = useState<string>("");
  const [cuerpoModalError, setCuerpoModalError] = useState<string>("");
  const [esVisible, setEsVisible] = useState<boolean>(false);
  const [tituloModal, setTituloModal] = useState<string>("");
  const [cuerpoModal, setCuerpoModal] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);

  const navegador = useNavigate();

  const recuperarContrasena = async (datos: { correoElectronico: string}) => {
    try {
      setCargando(true);
      const response = await fetch(InfoSesion.ObtenerIPBackend() + "/RecuperarContrasena", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }
      setCargando(false);
      setTituloModal("Contraseña cambiada");
      setCuerpoModal("Se ha cambiado la contraseña exitosamente");
      setEsVisible(true);
    }
    catch (err) {
      setCargando(false);
      setTituloModalError("Error al recuperar contraseña");
      if (typeof err === "object" && err !== null && "message" in err) {
        setCuerpoModalError(String((err as any).message));
      } else {
        setCuerpoModalError("Error desconocido.");
      }
      setEsVisibleError(true);
    }
  }

  const mostrarError = () => {
    setTituloModalError("Error al recuperar contraseña");
    setCuerpoModalError("Por favor, revisa los campos antes de continuar");
    setEsVisibleError(true);
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
            name="recuperarContrasenaFormulario"
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
          <div>
            <Modal
              title={tituloModalError}
              open={esVisibleError}
              onOk={() => setEsVisibleError(false)}
              cancelButtonProps={{ style: { display: "none" } }}
            >
              <p>{cuerpoModalError}</p>
            </Modal>
          </div>
          <div>
            <Modal
              title={tituloModal}
              open={esVisible}
              onOk={() => volverInicioSesion()}
              cancelButtonProps={{ style: { display: "none" } }}
            >
              <p>{cuerpoModal}</p>
            </Modal>
          </div>
          <Spin spinning={cargando} size="large" fullscreen />
        </div>
      </div>
    </div>
  );
}

export default ContrasenaOlvidada;