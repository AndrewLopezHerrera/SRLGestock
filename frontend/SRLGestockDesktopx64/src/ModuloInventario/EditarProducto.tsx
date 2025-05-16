import { Button, Form, Input, Modal } from "antd";
import "./CrearProducto.css"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import InfoSesion from "../ModuloSesion/Sesion";
import Producto from "./Producto";
import { eliminarProductoAux, seleccionarProductoAux } from "./FuncionesAuxiliaresEditarProducto";

function EditarProducto(){
  const navegador = useNavigate();
  const [rol, setRol] = useState<string>("");
  const rolObtenido = InfoSesion.ObtenerRolUsuario();
  setRol(rolObtenido);
  const [error, setError] = useState<boolean>(false);
  const [tituloError, setTituloError] = useState<string>("");
  const [cuerpoError, setCuerpoError] = useState<string>("");
  const [producto, setProducto] = useState<Producto>();
  const [esVisible, setEsVisible] = useState<boolean>(false);
  const [tituloModal, setTituloModal] = useState<string>("");
  const [cuerpoModal, setCuerpoModal] = useState<string>("");
  const { id } = useParams();
  const idProducto = Number(id);

  const seleccionarProducto = async () => {
    try {
      const producto : Producto = await seleccionarProductoAux(idProducto);
      setProducto(producto);
    }
    catch (err) {
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
  
  const editarProducto = async () => {
    try {
      
    }
    catch (err) {
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
      await eliminarProductoAux(idProducto);
      setTituloModal("Producto Eliminado");
      setCuerpoModal("Se ha eliminado el producto correctamente");
      setEsVisible(true);
      navegador("/menuInventario");
    }
    catch (err) {
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

  const irMenuInventario = () => {
    navegador("/menuInventario");
  }

  useEffect(() => {seleccionarProducto()});

  return(
    <div className="contenedorCrearProducto">
      <div className="contenedorTituloBotonVolverCrearProducto">
        <div className="contenedorBotonVolverCrearProducto">
          <Button onClick={irMenuInventario} className="botonVolver">Volver</Button>
        </div>
        <div className="contenedortituloCrearProducto">
          <h1 className="tituloCrearProducto">Editar Producto</h1>
        </div>
        <div className="contenedorBotonVolverCrearProducto" />
      </div>
      <div className="contenedorFormularioCrearProducto">
        <div className="seccionFormularioCrearProducto">
          <Form
            name="crearProductoFormulario"
            onFinish={editarProducto}
            onFinishFailed={mostrarError}
            className="formularioCrearProducto"
          >

            <Form.Item
              label="Consecutivo: "
              name="Consecutivo"
              rules={[{ type: "number"}]}
              className="itemForm"
            >
              <Input placeholder="" type="number" className="entradasTextoInicioSesion" value = {producto?.Consecutivo}/>
            </Form.Item>

            <Form.Item
              label="Nombre: "
              name="Nombre"
              rules={[{ required: true, message: "El nombre del producto es obligatorio"}]}
              className="itemForm"
            >
              <Input placeholder="Escriba el nombre del producto" className="entradasTextoInicioSesion" value = {producto?.Nombre}/>
            </Form.Item>

            <Form.Item
              label="Descripción: "
              name="Descripcion"
              rules={[{ required: true, message: "La descripción del producto es obligatorio"}]}
              className="itemForm"
            >
              <Input placeholder="Escriba la descripción del producto" className="entradasTextoInicioSesion" value = {producto?.Descripcion}/>
            </Form.Item>

            <Form.Item
              label="Precio del producto: "
              name="Precio"
              rules={[{ required: true, message: "El precio del producto es obligatorio", type: "number"}]}
              className="itemForm"
            >
              <Input placeholder="Escriba el precio del producto" className="entradasTextoInicioSesion" type="number" value = {producto?.Precio}/>
            </Form.Item>

            <Form.Item
              label="Impuesto del producto: "
              name="Impuesto"
              rules={[{ required: true, message: "El impuesto del producto es obligatorio", type: "number"}]}
              className="itemForm"
            >
              <Input placeholder="Escriba el impuesto del producto" className="entradasTextoInicioSesion" type="number" value = {producto?.Impuesto}/>
            </Form.Item>

            <Form.Item
              label="Cantidad en inventario: "
              name="Cantidad"
              rules={[{ type: "number"}]}
              className="itemForm"
            >
              <Input placeholder="" className="entradasTextoInicioSesion" type="number" disabled value = {producto?.Cantidad}/>
            </Form.Item>

            <Form.Item
              label="Agregar inventario"
              name="impuesto"
              rules={[{ required: true, message: "La cantidad de unidades del producto es obligatorio", type: "number"}]}
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
                onClick={eliminarProducto}
                block
              >
                <b>Eliminar producto</b>
              </Button>
            </Form.Item>}
          </Form>
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
      </div>
    </div>
  );
}
;
export default EditarProducto;