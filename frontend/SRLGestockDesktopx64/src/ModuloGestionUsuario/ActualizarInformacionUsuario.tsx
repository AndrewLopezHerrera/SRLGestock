import { useNavigate } from "react-router-dom";
import { Form, Button, Input, Modal, Spin } from "antd";
import "./ActualizarInformacionUsuario.css"
import InfoSesion from "../ModuloSesion/Sesion";
import { useEffect, useState } from "react";

function ActualizacionInformacionUsuario(){
  const [esVisible, setEsVisible] = useState<boolean>(false);
  const [tituloModal, setTituloModal] = useState<string>("");
  const [cuerpoModal, setCuerpoModal] = useState<string>(""); 

  const [nombreUsuario, setNombreUsuario] = useState<string>("");
  const [correoElectronicoUsuario, setCorreoElectronicoUsuario] = useState<string>("");
  const [primerApellidoUsuario, setPrimerApellidoUsuario] = useState<string>("");
  const [segundoApellidoUsuario, setSegundoApellidoUsuario] = useState<string>("");
  const [idUsuario, setIdUsuario] = useState<string>("");
  const [rolUsuario, setRolUsuario] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);

  const navegador = useNavigate();

  useEffect(() => {
    const ejecutar = async () => {
      try {
        setCargando(true);
        await mostrarInformacionGeneral();
        setCargando(false);
      } catch (err) {
        setCargando(false);
        setTituloModal("Error al mostrar datos del usuario");
        if (typeof err === "object" && err !== null && "message" in err) {
          setCuerpoModal(String((err as any).message));
        } else {
          setCuerpoModal("Error desconocido");
        }
        setEsVisible(true);
      }
    };
  
    ejecutar(); // se llama a la función async
  }, []);
  

  const mostrarInformacionGeneral = async () => {
    const idSesion : string = InfoSesion.ObtenerIdSesion();
    const response = await fetch(InfoSesion.ObtenerIPBackend() + "/RecuperarInformacionGeneralUsuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idSesion }),
    });
    const { error , idUsuario , correoElectronico , nombre , apellidoPaterno , apellidoMaterno , nombreRol } = await response.json();
    if (!response.ok) {
      throw new Error(error);
    }
    setNombreUsuario(nombre);
    setCorreoElectronicoUsuario(correoElectronico);
    setPrimerApellidoUsuario(apellidoPaterno);
    setSegundoApellidoUsuario(apellidoMaterno);
    setIdUsuario(idUsuario);
    setRolUsuario(nombreRol);
  }

  const actualizarContrasena = async (
    datos: {contrasenaActual: string, 
    contrasenaNueva: string,
    confirmacionNuevaContrasena: string,
    idSesion: string
  }) => {
    datos.idSesion = InfoSesion.ObtenerIdSesion();
    try {
      if(datos.contrasenaNueva != datos.confirmacionNuevaContrasena)
        throw new Error("Las contraseñas nuevas no coinciden");
      if(datos.contrasenaNueva == datos.contrasenaActual)
        throw new Error("La contraseña no puede ser igual a la anterior");
      setCargando(true);
      const response = await fetch(InfoSesion.ObtenerIPBackend() + "/CambiarContrasena", {
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
      setTituloModal("Contraseña actualizado");
      setCuerpoModal("Su contraseña se ha actualizado");
      setEsVisible(true);
    }
    catch (err) {
      setCargando(false);
      setTituloModal("Error al actualizar el usuario");
      if (typeof err === "object" && err !== null && "message" in err) {
        setCuerpoModal(String((err as any).message));
      }
      else {
        setCuerpoModal("Error desconocido");
      }
      setEsVisible(true);
    }
  }

  const cerrarSesion = async () => {
    const idSesion : string = InfoSesion.ObtenerIdSesion();
    fetch(InfoSesion.ObtenerIPBackend() + "/CerrarSesion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idSesion }),
    });
    InfoSesion.CerrarSesion();
    navegador("/");
  }

  const mostrarError = () => {
    setTituloModal("Error al cambiar contraseña")
    setCuerpoModal("Por favor, revisa los campos antes de continuar");
    setEsVisible(true);
  }

  const irMenuPrincipal = () => {
    navegador("/menuPrincipal");
  }

  return(
    <div className="contenedorMiUsuario">
      <div className="contenedorTituloBotonVolverMiUsuario">
        <div className="contenedorBotonVolverMiUsuario">
          <Button onClick={irMenuPrincipal} className="botonVolver">Volver</Button>
        </div>
        <div className="contenedortituloMiUsuario">
          <h1 className="tituloMiUsuario">Mi usuario</h1>
        </div>
        <div className="contenedorBotonVolverMiUsuario" />
      </div>
      <div className="contenedorFormularios">
        <div className="contenedorFormularioActualizarUsuario">
          <div className="seccionFormularioActualizarUsuario">
            <div className="tituloFormularioMiUsuario">Mi informacion</div>
            <Form
              name="verInformacionUsuarioFormulario"
              className="formularioInicioSesion"
            >

              <Form.Item
                label="ID del usuario "
                name="idUsuario"
                rules={[{ required: false, message: "Este campo no se puede modificar"}]}
                className="itemForm"
              >
                <Input placeholder={idUsuario} className="entradasTextoInicioSesion" readOnly/>
              </Form.Item>
              <Form.Item
                label="Primer Nombre: "
                name="nombre"
                rules={[{ required: false, message: "El nombre es obligatorio"}]}
                className="itemForm"
              >
                <Input placeholder={nombreUsuario} className="entradasTextoInicioSesion" readOnly />
              </Form.Item>

              <Form.Item
                label="Primer Apellido: "
                name="apellidoPaterno"
                rules={[{ required: false, message: "El primer apellido es obligatorio"}]}
                className="itemForm"
              >
                <Input placeholder={primerApellidoUsuario} className="entradasTextoInicioSesion" readOnly />
              </Form.Item>

              <Form.Item
                label="Segundo Apellido: "
                name="apellidoMaterno"
                rules={[{ required: false, message: "El segundo apellido es obligatorio"}]}
                className="itemForm"
              >
                <Input placeholder={segundoApellidoUsuario} className="entradasTextoInicioSesion" readOnly />
              </Form.Item>

              <Form.Item
                label="Correo Electrónico"
                name="correoElectronico"
                rules={[{ required: false, message: "El correo electrónico es obligatorio", type: "email"}]}
                className="itemForm"
              >
                <Input placeholder={correoElectronicoUsuario} className="entradasTextoInicioSesion" type="email" readOnly/>
              </Form.Item>

              <Form.Item
                label="Rol del usuario "
                name="rol"
                rules={[{ required: false, message: "Este campo no se puede modificar"}]}
                className="itemForm"
              >
                <Input placeholder={rolUsuario} className="entradasTextoInicioSesion" readOnly/>
              </Form.Item>

            </Form>
          </div>
        </div>
        <div className="contenedorFormularioActualizarUsuario">
          <div className="seccionFormularioActualizarUsuario">
            <div className="tituloFormularioMiUsuario">Actualizar contraseña</div>
            <Form
              name="actualizarContrasenaFormulario"
              onFinish={actualizarContrasena}
              onFinishFailed={mostrarError}
              className="formularioInicioSesion"
            >

              <Form.Item
                label="Contraseña actual"
                name="contrasenaActual"
                rules={[{ required: true, message: "Este campo es obligatorio"}]}
                className="itemForm"
              >
                <Input placeholder="Ingrese la contraseña actual de su usuario" className="entradasTextoInicioSesion" type="password"/>
              </Form.Item>

              <Form.Item
                label="Nueva contraseña"
                name="contrasenaNueva"
                rules={[{ required: true, message: "Este campo es obligatorio"}]}
                className="itemForm"
              >
                <Input placeholder="Invente una contraseña y escríbala" className="entradasTextoInicioSesion" type="password"/>
              </Form.Item>

              <Form.Item
                label="Confirme la nueva contraseña"
                name="confirmacionNuevaContrasena"
                rules={[{ required: true, message: "Este campo es obligatorio"}]}
                className="itemForm"
              >
                <Input placeholder="Escriba otra vez la contraseña inventada" className="entradasTextoInicioSesion" type="password"/>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  <b>Actualizar contraseña</b>
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      <Button className="botonCerrarSesion" onClick={cerrarSesion}>Cerrar Sesión</Button>
      <Modal
        title={tituloModal}
        open={esVisible}
        onOk={() => setEsVisible(false)}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <p>{cuerpoModal}</p>
      </Modal>
      <Spin spinning={cargando} size="large" fullscreen />
    </div>
  );
}
;
export default ActualizacionInformacionUsuario;