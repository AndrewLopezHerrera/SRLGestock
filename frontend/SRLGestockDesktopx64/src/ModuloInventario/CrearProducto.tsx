import { Button, Form, Input, Modal , InputNumber, Spin } from "antd";
import "./CrearProducto.css"
import { useNavigate } from "react-router-dom";
import Producto from "./Producto";
import InfoSesion from "../ModuloSesion/Sesion";
import { useState } from "react";

function CrearProducto(){
  const navegador = useNavigate();

  const [form] = Form.useForm();

  const [esVisible, setEsVisible] = useState<boolean>(false);
  const [tituloModal, setTituloModal] = useState<string>("");
  const [cuerpoModal, setCuerpoModal] = useState<string>("");

  const [error, setError] = useState<boolean>(false);
  const [tituloError, setTituloError] = useState<string>("");
  const [cuerpoError, setCuerpoError] = useState<string>(""); 

  const [cargando, setCargando] = useState<boolean>(false);

  const crearProducto = async (producto: Producto ) => {
    try {
      setCargando(true);
      if(String(producto.Consecutivo).length > 15)
        throw new Error("El consecutivo debe tener 15 dígitos como máximo")
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
      setCargando(false);
      setTituloModal("Producto creado");
      setCuerpoModal("Su creado el producto exitosamente");
      setEsVisible(true);
    }
    catch (err) {
      setCargando(false);
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
            form={form}
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
              <InputNumber min={1000000} placeholder="Escriba el consecutivo de producto" type="number" className="entradasTextoInicioSesion" />
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
              <InputNumber
                min = {0}
                max = {1000000000}
                placeholder="Escriba el precio del producto"
                className="entradasTextoInicioSesion"
                type="number"
              />
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
              label="Cantidad ingresada: "
              name="Cantidad"
              rules={[{ required: true, message: "La cantidad de unidades del producto es obligatorio"}]}
              className="itemForm"
            >
              <InputNumber stringMode step = {1} value={0} min={0} placeholder="Escriba la cantidad de unidades del producto" className="entradasTextoInicioSesion" type="number"/>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                <b>Crear nuevo producto</b>
              </Button>
              <Button color="primary" variant="dashed" onClick={() => form.resetFields()} block style={{marginTop: "2vh"}}>
                Limpiar campos
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
          <Spin spinning={cargando} size="large" fullscreen/>
        </div>
      </div>
    </div>
  );
}
;
export default CrearProducto;