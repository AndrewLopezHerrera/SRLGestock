import { Button, Input, Card, List } from "antd";
import "./SeleccionarProducto.css"
import Producto from "./Producto";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SeleccionarProducto(){
  const navegador = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([
      {
        consecutivo: 1,
        nombre: "Laptop Dell XPS 13",
        descripcion: "Laptop ultradelgada con pantalla 4K y procesador Intel i7.",
        precio: 1200,
        impuesto: 13,
        cantidad: 5,
      },
      {
        consecutivo: 2,
        nombre: "Smartphone Samsung Galaxy S21",
        descripcion: "Smartphone de alta gama con cámara de 108MP y pantalla AMOLED.",
        precio: 800,
        impuesto: 13,
        cantidad: 8,
      },
      {
        consecutivo: 3,
        nombre: "Auriculares Bose QuietComfort 35 II",
        descripcion: "Auriculares inalámbricos con cancelación de ruido activa.",
        precio: 350,
        impuesto: 13,
        cantidad: 12,
      },
      {
        consecutivo: 4,
        nombre: "Smartwatch Apple Watch Series 7",
        descripcion: "Reloj inteligente con ECG y seguimiento de actividad física.",
        precio: 400,
        impuesto: 13,
        cantidad: 10,
      },
      {
        consecutivo: 5,
        nombre: "Monitor LG 27UL850-W",
        descripcion: "Monitor 4K de 27 pulgadas con USB-C y HDR10.",
        precio: 500,
        impuesto: 13,
        cantidad: 15,
      },
      {
        consecutivo: 6,
        nombre: "Teclado mecánico Logitech G Pro X",
        descripcion: "Teclado mecánico con interruptores intercambiables y retroiluminación RGB.",
        precio: 150,
        impuesto: 13,
        cantidad: 20,
      },
      {
        consecutivo: 7,
        nombre: "Cámara DSLR Canon EOS 90D",
        descripcion: "Cámara DSLR de 32.5 megapíxeles con grabación 4K.",
        precio: 1300,
        impuesto: 13,
        cantidad: 7,
      },
      {
        consecutivo: 8,
        nombre: "Tablet Apple iPad Pro 11",
        descripcion: "Tablet de 11 pulgadas con chip M1 y pantalla Liquid Retina.",
        precio: 800,
        impuesto: 13,
        cantidad: 4,
      },
      {
        consecutivo: 9,
        nombre: "Altavoces Sonos One",
        descripcion: "Altavoces inalámbricos inteligentes con integración con Alexa y Google Assistant.",
        precio: 200,
        impuesto: 13,
        cantidad: 25,
      },
      {
        consecutivo: 10,
        nombre: "Impresora HP LaserJet Pro",
        descripcion: "Impresora láser monocromática con capacidad de impresión dúplex.",
        precio: 150,
        impuesto: 13,
        cantidad: 30,
      },
  ]);

  const buscarProducto = () => {

  }

  const editarProducto = () => {
    navegador("/editarProducto");
  }

  const mostrarError = () => {

  }

  const irMenuInventario = () => {
    navegador("/menuInventario");
  }

  return(
    <div className="contenedorSeleccionarProducto">
      <div className="contenedorTituloBotonVolverSeleccionarProducto">
        <div className="contenedorBotonVolverSeleccionarProducto">
          <Button onClick={irMenuInventario} className="botonVolver">Volver</Button>
        </div>
        <div className="contenedorTituloSeleccionarProducto">
          <h1 className="tituloSeleccionarProducto">Seleccionar Producto</h1>
        </div>
        <div className="contenedorBotonVolverSeleccionarProducto" />
      </div>
      <div className="contenedorListaSeleccionarProducto">
        <div className="seccionFormularioSeleccionarProducto">
          <Input placeholder="Escriba el consecutivo o el nombre del producto"  className="entradaSeleccionarProducto" />
          <Button className="botonBuscarProducto">
            <b>Buscar</b>
          </Button>
        </div>
        <div className="contenedorProductos">
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={productos}
            renderItem={(producto) => (
              <List.Item>
                <Card
                  title={`${producto.nombre} - ₡${producto.precio.toLocaleString()}`}
                  extra={<Button type="primary" onClick={editarProducto}>Editar</Button>}
                >
                  <p><strong>Consecutivo: </strong> {producto.consecutivo} </p>
                  <p>{producto.descripcion}</p>
                  <p><strong>Impuesto:</strong> {producto.impuesto * 100}%</p>
                  <p><strong>Cantidad:</strong> {producto.cantidad}</p>
                </Card>
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
}
;
export default SeleccionarProducto;