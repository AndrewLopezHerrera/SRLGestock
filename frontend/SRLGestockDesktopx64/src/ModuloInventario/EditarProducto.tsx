import { Button, Form, Input } from "antd";
import "./CrearProducto.css"
import { useNavigate } from "react-router-dom";

function EditarProducto(){
  const navegador = useNavigate();

  const editarProducto = () => {

  }

  const eliminarProducto = () => {
    
  }

  const mostrarError = () => {

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
              name="consecutivo"
              rules={[{ type: "number"}]}
              className="itemForm"
            >
              <Input placeholder="" type="number" className="entradasTextoInicioSesion" disabled/>
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
              label="Precio del producto: "
              name="precio"
              rules={[{ required: true, message: "El precio del producto es obligatorio", type: "number"}]}
              className="itemForm"
            >
              <Input placeholder="Escriba el precio del producto" className="entradasTextoInicioSesion" type="number"/>
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
              label="Cantidad en inventario: "
              name="impuesto"
              rules={[{ type: "number"}]}
              className="itemForm"
            >
              <Input placeholder="" className="entradasTextoInicioSesion" type="number" disabled/>
            </Form.Item>

            <Form.Item
              label="Cantidad en inventario: "
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
            <Form.Item>
              <Button
                type="primary"
                danger
                ghost
                onClick={eliminarProducto}
                block
              >
                <b>Eliminar producto</b>
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
;
export default EditarProducto;