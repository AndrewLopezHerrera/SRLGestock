import { Form, Button, Input, Select, Modal } from "antd";
import "./CrearUsuarios.css"
import InfoSesion from "../ModuloSesion/Sesion";
import { useState } from "react";

const { Option } = Select;

function CreacionUsuario(){
  const [esVisible, setEsVisible] = useState<boolean>(false);
  const [tituloModal, setTituloModal] = useState<string>("");
  const [cuerpoModal, setCuerpoModal] = useState<string>("");

  const crearUsuario = async (
      datos: {correoElectronico: string, 
      nombre: string,
      apellidoPaterno: string,
      apellidoMaterno: string,
      idSesion: string
    }) => {
    datos.idSesion = InfoSesion.ObtenerIdSesion();
    try {
      const response = await fetch(InfoSesion.ObtenerIPBackend() + "/CrearUsuario", {
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

      const { idUsuario } = await response.json();

      setTituloModal("Usuario creado");
      setCuerpoModal("El ID del nuevo usuario es: " + String(idUsuario));
      setEsVisible(true);

    }
    catch (err) {
      setTituloModal("Error al crear el nuevo usuario");
      if (typeof err === "object" && err !== null && "message" in err) {
        setCuerpoModal(String((err as any).message));
      }
      else {
        setCuerpoModal("Error desconocido");
      }
      setEsVisible(true);
    }
  }

  const mostrarError = () => {
    setCuerpoModal("Por favor, revisa los campos antes de continuar");
    setEsVisible(true);
  }

  return(
    <div className="contenedorPrincipalCrearUsuario">
      <div className="tituloCreacionUsuario">
        <b>Crear un usuario</b>
      </div>
      <div className="contenedorFormularioCrearUsuario">
        <Form
          name="crearUsuarioFormulario"
          onFinish={crearUsuario}
          onFinishFailed={mostrarError}
          className="formularioInicioSesion"
        >

          <Form.Item
            label="Primer Nombre: "
            name="nombre"
            rules={[{ required: true, message: "El primer nombre es obligatorio"}]}
            className="itemForm"
          >
            <Input placeholder="Ejemplo: Juan" className="entradasTextoInicioSesion" />
          </Form.Item>

          <Form.Item
            label="Primer Apellido: "
            name="apellidoPaterno"
            rules={[{ required: true, message: "El primer apellido es obligatorio"}]}
            className="itemForm"
          >
            <Input placeholder="Ejemplo: Perez" className="entradasTextoInicioSesion" />
          </Form.Item>

          <Form.Item
            label="Segundo Apellido: "
            name="apellidoMaterno"
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
            <Input placeholder="Ejemplo: juanperez@mail.com" className="entradasTextoInicioSesion" type="email"/>
          </Form.Item>

          <Form.Item
            label="Selecciona una opción"
            name="idRol"
            rules={[{ required: true, message: "Esta opción es obligatoria" }]}
            className="itemForm"
          >
            <Select placeholder="Selecciona el tipo de empleado" className="entradasTextoInicioSesion">
              <Option value="1" className="entradasTextoInicioSesion">Administrador</Option>
              <Option value="2" className="entradasTextoInicioSesion">Empleado</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              <b>Crear nuevo usuario</b>
            </Button>
          </Form.Item>
        </Form>
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
  );
}
;
export default CreacionUsuario;