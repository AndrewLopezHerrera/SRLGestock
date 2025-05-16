import { Button, Form, Input, Modal } from "antd";
import "./CrearProducto.css"
import { useNavigate } from "react-router-dom";
import Producto from "./Producto";
import InfoSesion from "../ModuloSesion/Sesion";
import { useState } from "react";

function CrearProducto(){
  const navegador = useNavigate();

  const [error, setError] = useState<boolean>(false);
  const [tituloError, setTituloError] = useState<string>("");
  const [cuerpoError, setCuerpoError] = useState<string>(""); 

  const crearProducto = async (producto: Producto ) => {
    try {
      console.log(producto);
      const idSesion : string = InfoSesion.ObtenerIdSesion();
      const respuestaCrearProducto = await fetch(InfoSesion.ObtenerIPBackend() + "/CrearProducto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({producto, idSesion}),
      });

      if (!respuestaCrearProducto.ok) {
        const { error } = await respuestaCrearProducto.json();
        throw new Error(error);
      }
    }
    catch (err) {
      if (typeof err === "object" && err !== null && "message" in err) {
        setTituloError("Error al crear el producto");
        setCuerpoError(String((err as any).message));
      } else {
        setTituloError("Error al crear el producto");
        setCuerpoError("Error desconocido");
      }
      setError(true);
    }
  }

  const mostrarError = () => {
    setTituloError("Error al crear un producto");
    setCuerpoError("Por favor, revisa los campos antes de continuar");
    setError(true);
  }

  const irMenuInventario = () => {
    navegador("/menuInventario");
  }

  return(
    <div className="contenedorCrearProducto">
      <div className="contenedorTituloBotonVolverCrearProducto">
        <div className="contenedorBotonVolverCrearProducto">
          <Button onClick={irMenuInventario} className="botonVolver">Volver</Button>
        </div>
        <div className="contenedortituloCrearProducto">
          <h1 className="tituloCrearProducto">Crear Producto</h1>
        </div>
        <div className="contenedorBotonVolverCrearProducto" />
      </div>
      <div className="contenedorFormularioCrearProducto">
        <div className="seccionFormularioCrearProducto">
          <Form
            name="crearProductoFormulario"
            onFinish={crearProducto}
            onFinishFailed={mostrarError}
            className="formularioCrearProducto"
          >

            <Form.Item
              label="Consecutivo: "
              name="Consecutivo"
              rules={[{ required: true, message: "El consecutivo es obligatorio"}]}
              className="itemForm"
            >
              <Input min={1000000} placeholder="Escriba el consecutivo de producto" type="number" className="entradasTextoInicioSesion" />
            </Form.Item>

            <Form.Item
              label="Nombre: "
              name="Nombre"
              rules={[{ required: true, message: "El nombre del producto es obligatorio"}]}
              className="itemForm"
            >
              <Input placeholder="Escriba el nombre del producto" className="entradasTextoInicioSesion" />
            </Form.Item>

            <Form.Item
              label="Descripción: "
              name="Descripcion"
              rules={[{ required: true, message: "La descripción del producto es obligatorio"}]}
              className="itemForm"
            >
              <Input placeholder="Escriba la descripción del producto" className="entradasTextoInicioSesion" />
            </Form.Item>

            <Form.Item
              label="Precio del producto: "
              name="Precio"
              rules={[{ required: true, message: "El precio del producto es obligatorio"}]}
              className="itemForm"
            >
              <Input min = {0} value = {0} placeholder="Escriba el precio del producto" className="entradasTextoInicioSesion" type="number"/>
            </Form.Item>

            <Form.Item
              label="Impuesto del producto: "
              name="Impuesto"
              rules={[{ required: true, message: "El impuesto del producto es obligatorio"}]}
              className="itemForm"
            >
              <Input min = {0} max={100} value = {0} placeholder="Escriba el impuesto del producto" className="entradasTextoInicioSesion" type="number"/>
            </Form.Item>

            <Form.Item
              label="Cantidad ingresada: "
              name="Cantidad"
              rules={[{ required: true, message: "La cantidad de unidades del producto es obligatorio"}]}
              className="itemForm"
            >
              <Input value={0} min={0} placeholder="Escriba la cantidad de unidades del producto" className="entradasTextoInicioSesion" type="number"/>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                <b>Crear nuevo producto</b>
              </Button>
            </Form.Item>
          </Form>
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
export default CrearProducto;