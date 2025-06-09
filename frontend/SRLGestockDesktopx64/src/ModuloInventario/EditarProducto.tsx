import { Button, Form, Input, InputNumber, Modal, Spin } from "antd";
import "./EditarProducto.css"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import InfoSesion from "../ModuloSesion/Sesion";
import Producto from "./Producto";
import { actualizarProductoAux, eliminarProductoAux, seleccionarProductoAux } from "./FuncionesAuxiliaresEditarProducto";

function EditarProducto(){
  const navegador = useNavigate();
  const [rol, setRol] = useState<string>("");
  const rolObtenido = InfoSesion.ObtenerRolUsuario();
  const [error, setError] = useState<boolean>(false);
  const [tituloError, setTituloError] = useState<string>("");
  const [cuerpoError, setCuerpoError] = useState<string>("");
  const [producto, setProducto] = useState<Producto>();
  const [esVisible, setEsVisible] = useState<boolean>(false);
  const [tituloModal, setTituloModal] = useState<string>("");
  const [cuerpoModal, setCuerpoModal] = useState<string>("");
  const [confimacionEliminacion, setConfirmacionEliminacion] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(false);
  const { id } = useParams();
  const idProducto = Number(id);

  const seleccionarProducto = async () => {
    try {
      setCargando(true);
      const producto : Producto = await seleccionarProductoAux(idProducto);
      setProducto(producto);
      setCargando(false);
    }
    catch (err) {
      setCargando(false);
      if (typeof err === "object" && err !== null && "message" in err) {
        setTituloError("Error al crear el producto");
        setCuerpoError(String((err as any).message));
      } else {
        setTituloError("Error al eliminar el producto");
        setCuerpoError("Error desconocido");
      }
      setError(true);
    }
  }
  
  const editarProducto = async (producto: Producto) => {
    try {
      setCargando(true);
      if(!await actualizarProductoAux(producto))
        throw Error("Hubo un error al actualizar el producto");
      setCargando(false);
      setTituloModal("Producto Actualizado");
      setCuerpoModal("Se ha actualizado el producto correctamente");
      setEsVisible(true);
      setProducto(undefined);
      seleccionarProducto();
    }
    catch (err) {
      setCargando(false);
      if (typeof err === "object" && err !== null && "message" in err) {
        setTituloError("Error al crear el producto");
        setCuerpoError(String((err as any).message));
      } else {
        setTituloError("Error al eliminar el producto");
        setCuerpoError("Error desconocido");
      }
      setError(true);
    }
  }

  const eliminarProducto = async () => {
    try {
      setConfirmacionEliminacion(false);
      setCargando(true);
      await eliminarProductoAux(idProducto);
      setCargando(false);
      setTituloModal("Producto Eliminado");
      setCuerpoModal("Se ha eliminado el producto correctamente");
      setEsVisible(true);
    }
    catch (err) {
      setCargando(false);
      if (typeof err === "object" && err !== null && "message" in err) {
        setTituloError("Error al crear el producto");
        setCuerpoError(String((err as any).message));
      } else {
        setTituloError("Error al eliminar el producto");
        setCuerpoError("Error desconocido");
      }
      setError(true);
    }
  }

  const mostrarError = () => {
    setTituloError("Error al editar el producto");
    setCuerpoError("Por favor, revisa los campos antes de continuar");
    setError(true);
  }

  const irSeleccionarInventario = () => {
    navegador("/seleccionarProducto");
  }

  useEffect(() => {
    seleccionarProducto();
    setRol(rolObtenido);
  }, []);

  return(
    <div className="contenedorEditarProducto">
      <div className="contenedorTituloBotonVolverEditarProducto">
        <div className="contenedorBotonVolverEditarProducto">
          <Button onClick={irSeleccionarInventario} className="botonVolver">Volver</Button>
        </div>
        <div className="contenedortituloEditarProducto">
          <h1 className="tituloEditarProducto">Editar Producto</h1>
        </div>
        <div className="contenedorBotonVolverEditarProducto" />
      </div>
      <div className="contenedorFormularioEditarProducto">
        <div className="seccionFormularioEditarProducto">
          {producto && <Form
            name="editarProductoFormulario"
            onFinish={editarProducto}
            onFinishFailed={mostrarError}
            className="formularioEditarProducto"
            initialValues={{
              Consecutivo: producto.Consecutivo,
              Nombre: producto.Nombre,
              Descripcion: producto.Descripcion,
              Precio: producto.Precio,
              Impuesto: producto.Impuesto,
              CantidadInventario: producto.Cantidad,
              Cantidad: 0
            }}
          >
            <Form.Item
              label="Consecutivo: "
              name="Consecutivo"
              rules={[{ required: true }]}
              className="itemForm"
            >
              <Input placeholder="Escriba el consecutivo del producto" type="number" className="entradasTextoInicioSesion" disabled />
            </Form.Item>

            <Form.Item
              label="Nombre: "
              name="Nombre"
              rules={[{ required: true, message: "El nombre del producto es obligatorio"}]}
              className="itemForm"
            >
              <Input placeholder="Escriba el nombre del producto" type = "text" className="entradasTextoInicioSesion"/>
            </Form.Item>

            <Form.Item
              label="Descripción: "
              name="Descripcion"
              rules={[{ required: true, message: "La descripción del producto es obligatorio"}]}
              className="itemForm"
            >
              <Input placeholder="Escriba la descripción del producto" className="entradasTextoInicioSesion"/>
            </Form.Item>

            <Form.Item
              label="Precio del producto: "
              name="Precio"
              rules={[{ required: true, message: "El precio del producto es obligatorio" }]}
              className="itemForm"
            >
              <Input placeholder="Escriba el precio del producto" className="entradasTextoInicioSesion" type="number"/>
            </Form.Item>

            <Form.Item
              label="Impuesto del producto: "
              name="Impuesto"
              rules={[{ required: true, message: "El impuesto del producto es obligatorio. Debe estar entre 0 y 100."}]}
              className="itemForm"
            >
              <InputNumber<number>
                min = {0}
                max={100}
                step={0.01}
                placeholder="Escriba el impuesto del producto. Debe estar entre 0% y 100%."
                className="entradasTextoInicioSesion"
                formatter={(value) => `${value}%`}
                parser={(value) => value?.replace('%', '') as unknown as number}
              />
            </Form.Item>

            <Form.Item
              label="Cantidad en inventario: "
              name="CantidadInventario"
              rules={[{ type: "number"}]}
              className="itemForm"
            >
              <Input placeholder="" className="entradasTextoInicioSesion" type="number" disabled/>
            </Form.Item>

            <Form.Item
              label="Agregar inventario"
              name="Cantidad"
              rules={[{ required: true, message: "La cantidad de unidades del producto es obligatorio" }]}
              className="itemForm"
            >
              <Input value={0} min={0} className="entradasTextoInicioSesion" type="number"/>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                <b>Editar producto</b>
              </Button>
            </Form.Item>
            {(rol == "Administrador") && <Form.Item>
              <Button
                type="primary"
                danger
                ghost
                onClick={() => setConfirmacionEliminacion(true)}
                block
              >
                <b>Eliminar producto</b>
              </Button>
            </Form.Item>}
          </Form>}
        </div>
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
        <div>
          <Modal
            title={"Eliminar Producto"}
            open={confimacionEliminacion}
            onOk={() => eliminarProducto()}
            cancelButtonProps={{
              onClick: () => setConfirmacionEliminacion(false),
            }}
            okText="Sí, eliminar"
            cancelText="Cancelar"
            okButtonProps={{
              danger: true,
            }}
          >
            <p>{"¿Seguro que desea eliminar el producto?"}</p>
          </Modal>
        </div>
        <Spin spinning={cargando} size="large" fullscreen />
      </div>
    </div>
  );
}
;
export default EditarProducto;