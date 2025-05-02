import { Button, Form, Input } from "antd";
import "./MenuInventario.css"
import "./CrearProducto.css"
import { useNavigate } from "react-router-dom";

function CrearProducto(){
  const navegador = useNavigate();

  const crearProducto = () => {

  }

  const mostrarError = () => {

  }

  const irMenuInventario = () => {
    navegador("/menuPrincipal");
  }

  return(
    <div className="contenedorMenuInventario">
      <div className="contenedorTituloBotonVolverMenuInventario">
        <div className="contenedorBotonVolverMiUsuario">
          <Button onClick={irMenuInventario} className="botonVolver">Volver</Button>
        </div>
        <div className="contenedortituloMenuInventario">
          <h1 className="tituloMenuInventario">Crear Producto</h1>
        </div>
        <div className="contenedorBotonVolverMiUsuario" />
      </div>
      <div className="contenedorBotonesMenuInventario">
        <div className="seccionFormularioCrearProducto">
          <Form
            name="crearUsuarioFormulario"
            onFinish={crearProducto}
            onFinishFailed={mostrarError}
            className="formularioInicioSesion"
          >

            <Form.Item
              label="Consecutivo: "
              name="consecutivo"
              rules={[{ required: true, message: "El consecutivo es obligatorio", type: "number"}]}
              className="itemForm"
            >
              <Input placeholder="Escriba el consecutivo de producto" type="number" className="entradasTextoInicioSesion" />
            </Form.Item>

            <Form.Item
              label="Nombre: "
              name="nombre"
              rules={[{ required: true, message: "El nombre del producto es obligatorio"}]}
              className="itemForm"
            >
              <Input placeholder="Escriba el nombre del producto" className="entradasTextoInicioSesion" />
            </Form.Item>

            <Form.Item
              label="Descripción: "
              name="descripcion"
              rules={[{ required: true, message: "La descripción del producto es obligatorio"}]}
              className="itemForm"
            >
              <Input placeholder="Escriba la descripción del producto" className="entradasTextoInicioSesion" />
            </Form.Item>

            <Form.Item
              label="Impuesto del producto: "
              name="impuesto"
              rules={[{ required: true, message: "El impuesto del producto es obligatorio", type: "number"}]}
              className="itemForm"
            >
              <Input placeholder="Escriba el impuesto del producto" className="entradasTextoInicioSesion" type="number"/>
            </Form.Item>

            <Form.Item
              label="Cantidad ingresada: "
              name="impuesto"
              rules={[{ required: true, message: "La cantidad de unidades del producto es obligatorio", type: "number"}]}
              className="itemForm"
            >
              <Input placeholder="Escriba la cantidad de unidades del producto" className="entradasTextoInicioSesion" type="number"/>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                <b>Crear nuevo producto</b>
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
;
export default CrearProducto;