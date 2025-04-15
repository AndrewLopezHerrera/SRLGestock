import { useNavigate } from "react-router-dom";
import { Form, Button, Input, Modal } from "antd";
import "./InicioSesion.css"
import InfoSesion from "./Sesion";
import { useState } from "react";

function ContrasenaOlvidada(){

  const [esVisible, setEsVisible] = useState<boolean>(false);
  const [tituloModal, setTituloModal] = useState<string>("");
  const [cuerpoModal, setCuerpoModal] = useState<string>(""); 

  const navegador = useNavigate();

  const recuperarContrasena = async (datos: { correoElectronico: string}) => {

    try {
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

      navegador("/");
    }
    catch (err) {
      setTituloModal("Error al recuperar contraseña");
      if (typeof err === "object" && err !== null && "message" in err) {
        setCuerpoModal(String((err as any).message));
      } else {
        setCuerpoModal("Error desconocido.");
      }
      setEsVisible(true);
    }
  }

  const mostrarError = () => {
    setTituloModal("Error al recuperar contraseña");
    setCuerpoModal("Por favor, revisa los campos antes de continuar");
    setEsVisible(true);
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
              title={tituloModal}
              open={esVisible}
              onOk={() => setEsVisible(false)}
              cancelButtonProps={{ style: { display: "none" } }}
            >
              <p>{cuerpoModal}</p>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContrasenaOlvidada;