import { Form, Button, Input, Modal, Spin } from "antd";
import "./ActualizarEmpresa.css"
import InfoSesion from "../ModuloSesion/Sesion";
import { useEffect, useState } from "react";
import Empresa from "./Empresa";

function ActualizarEmpresa(){
  const [esVisible, setEsVisible] = useState<boolean>(false);
  const [tituloModal, setTituloModal] = useState<string>("");
  const [cuerpoModal, setCuerpoModal] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);
  const [empresa, setEmpresa] = useState<Empresa>({
    IdEmpresa: 0,
    Cedula: "",
    Nombre: "",
    TipoEmpresa: "",
    Telefono: "",
    Fax: "",
    Correo: "",
    Provincia: "",
    Canton: "",
    Distrito: "",
    Senas: ""
  });
  const [formularioCargado, setFormularioCargado] = useState<boolean>(true);

  const seleccionarEmpresa = async () =>{
    const idSesion : string = InfoSesion.ObtenerIdSesion();
    try {
      setCargando(true);
      const response = await fetch(InfoSesion.ObtenerIPBackend() + "/SeleccionarEmpresa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({'idEmpresa': 1, idSesion}),
      });
      setFormularioCargado(false);
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }
      const { empresaDatos } = await response.json() as {'empresaDatos' : Empresa};
      setEmpresa(empresaDatos);
      setFormularioCargado(true);
      setCargando(false);
    }
    catch (err) {
      setCargando(false);
      setTituloModal("Error al mostrar la empresa");
      if (typeof err === "object" && err !== null && "message" in err) {
        setCuerpoModal(String((err as any).message));
      }
      else {
        setCuerpoModal("Error desconocido");
      }
      setEsVisible(true);
    }
  }

  useEffect(() => {
    seleccionarEmpresa();
  }, []);

  const actualizarEmpresa = async (empresaActualizada : Empresa) => {
    const idSesion : string = InfoSesion.ObtenerIdSesion();
    try {
      setCargando(true);
      empresaActualizada.IdEmpresa = empresa.IdEmpresa;
      const response = await fetch(InfoSesion.ObtenerIPBackend() + "/ActualizarEmpresa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({'empresa': empresaActualizada, idSesion}),
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }
      setCargando(false);
      setTituloModal("Empresa actualizada");
      setCuerpoModal("Se ha actualizado la información de la empresa");
      setEsVisible(true);

    }
    catch (err) {
      setCargando(false);
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
    <div className="contenedorPrincipalActualizarEmpresa">
      <div className="tituloActualizarEmpresa">
        <b>Actualizar Informacion de la Empresa</b>
      </div>
      <div className="contenedorFormularioCrearUsuario">
        {formularioCargado && <Form
          name="crearUsuarioFormulario"
          onFinish={actualizarEmpresa}
          onFinishFailed={mostrarError}
          className="formularioInicioSesion"
          initialValues={empresa}
        >

          <Form.Item
            label="Cedula: "
            name="Cedula"
            rules={[
              { required: true, message: "Se debe ingresar la cédula"},
              {
                pattern: /^[1-9]-\d{3}-\d{6}$/,
                message: "Formato inválido. Use el formato X-XXX-XXXXXX"
              }
            ]}
            className="itemForm"
          >
            <Input placeholder="Ejemplo: 0-000-000000" className="entradasTextoInicioSesion" />
          </Form.Item>

          <Form.Item
            label="Nombre: "
            name="Nombre"
            rules={[{ required: true, message: "El nombre es obligatorio"}]}
            className="itemForm"
          >
            <Input placeholder="Ejemplo: Productos Orgánicos del Sur S.A." className="entradasTextoInicioSesion" />
          </Form.Item>

          <Form.Item
            label="Tipo de empresa: "
            name="TipoEmpresa"
            rules={[{ required: true, message: "El tipo de empresa es obligatorio"}]}
            className="itemForm"
          >
            <Input placeholder="Ejemplo: Electrónica" className="entradasTextoInicioSesion" />
          </Form.Item>

          <Form.Item
            label="Teléfono: "
            name="Telefono"
            rules={[{
              required: true, message: "El teléfono es obligatorio"},
              {
                pattern: /^(2|4|6|7|8)\d{3}-\d{4}$/,
                message: "Formato inválido. Use el formato XXXX-XXXX."
              }
            ]}
            className="itemForm"
          >
            <Input placeholder="Ejemplo: 2000-0000" className="entradasTextoInicioSesion"/>
          </Form.Item>

          <Form.Item
            label="Fax: "
            name="Fax"
            rules={[
              { required: true, message: "El fax es obligatorio" },
              {
                pattern: /^(2|4|6|7|8)\d{3}-\d{4}$/,
                message: "Formato inválido. Use el formato XXXX-XXXX."
              }
            ]}
            className="itemForm"
          >
            <Input placeholder="Ejemplo: 0000-0000" className="entradasTextoInicioSesion"/>
          </Form.Item>

          <Form.Item
            label="Correo: "
            name="Correo"
            rules={[
              { required: true, message: "El fax es obligatorio" },
              { type: 'email', message: 'El formato del correo es incorrecto'}
            ]}
            className="itemForm"
          >
            <Input placeholder="Ejemplo: juanperez@mail.com" className="entradasTextoInicioSesion" type="email"/>
          </Form.Item>

          <Form.Item
            label="Provincia: "
            name="Provincia"
            rules={[
              { required: true, message: "El fax es obligatorio" }
            ]}
            className="itemForm"
          >
            <Input placeholder="Ejemplo: San José" className="entradasTextoInicioSesion"/>
          </Form.Item>

          <Form.Item
            label="Cantón: "
            name="Canton"
            rules={[
              { required: true, message: "El cantón es obligatorio" }
            ]}
            className="itemForm"
          >
            <Input placeholder="Ejemplo: Escazú" className="entradasTextoInicioSesion"/>
          </Form.Item>

          <Form.Item
            label="Distrito: "
            name="Distrito"
            rules={[
              { required: true, message: "El distrito es obligatorio" }
            ]}
            className="itemForm"
          >
            <Input placeholder="Ejemplo: San Rafael" className="entradasTextoInicioSesion"/>
          </Form.Item>

          <Form.Item
            label="Señas exactas: "
            name="Senas"
            rules={[
              { required: true, message: "Las señas exactas son obligatorio" },
            ]}
            className="itemForm"
          >
            <Input placeholder="Ejemplo: 150m oeste de la iglesia" className="entradasTextoInicioSesion"/>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              <b>Actualizar datos de la empresa</b>
            </Button>
          </Form.Item>
        </Form>}
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
        <Spin spinning={cargando} size="large" fullscreen />
      </div>
    </div>
  );
}
;
export default ActualizarEmpresa;