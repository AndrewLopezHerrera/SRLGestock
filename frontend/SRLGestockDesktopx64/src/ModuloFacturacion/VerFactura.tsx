import { Breakpoint, Button, Descriptions, Modal, Spin, Table } from "antd";
import "./VerFactura.css"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Factura from "./Factura";
import { seleccionarFacturaAux } from "./FuncionesAuxiliaresCrearFactura";

function VerFactura(){
  const navegador = useNavigate();
  const [error, setError] = useState<boolean>(false);
  const [tituloError, setTituloError] = useState<string>("");
  const [cuerpoError, setCuerpoError] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);
  const { id, seccion } = useParams();
  const idFactura = String(id);
  const seccionAnterior = String(seccion);
  const [factura, setFactura] = useState<Factura>({
    IdFactura: "",
    NombreCliente: "",
    DireccionCliente: "",
    IdentificacionCliente: "",
    CorreoElectronicoCliente: "",
    Vendedor: "",
    Fecha: "",
    SubTotal: 0,
    Descuento: 0,
    Total: 0,
    Lineas: []
  })
  const encabezados = [
    {
      title: 'Consecutivo',
      dataIndex: 'Consecutivo',
      key: 'Consecutivo',
      responsive: ['md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Nombre',
      dataIndex: 'Nombre',
      key: 'Nombre',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Cantidad',
      dataIndex: 'Cantidad',
      key: 'Cantidad',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Precio',
      dataIndex: 'Precio',
      key: 'Precio',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Impuesto',
      dataIndex: 'Impuesto',
      key: 'Impuesto',
      responsive: ['md', 'lg', 'xl'] as Breakpoint[],
    },
    {
      title: 'Total',
      dataIndex: 'Total',
      key: 'total',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[],
    }
  ]

  const irSeleccionarInventario = () => {
    if(seccionAnterior === 'pantallaFacturacion')
      navegador("/pantallaFacturacion");
    if(seccionAnterior === 'buscarFactura')
      navegador("/buscarFactura");
  }

  const seleccionarFactura = async () => {
    try{
      const facturaAux : Factura = await seleccionarFacturaAux(idFactura);
      setFactura(facturaAux);
      setCargando(false);
      console.log(factura);
    }
    catch (err) {
      setCargando(false);
      if (typeof err === "object" && err !== null && "message" in err) {
        setTituloError("Error al ingresar el producto");
        setCuerpoError(String((err as any).message));
      } else {
        setTituloError("Error al ingresar el producto");
        setCuerpoError("Error desconocido");
      }
      setError(true);
    }
  }
  
  useEffect(() => {
    setCargando(true);
    seleccionarFactura();
  }, []);

  return(
    <div className="contenedorVerFactura">
      <div className="contenedorTituloBotonVolverVerFactura">
        <div className="contenedorBotonVolverVerFactura">
          <Button onClick={irSeleccionarInventario} className="botonVolver">Volver</Button>
        </div>
        <div className="contenedortituloVerFactura">
          <h1 className="tituloVerFactura">Información de la Factura</h1>
        </div>
        <div className="contenedorBotonVolverVerFactura" />
      </div>
      <div className="contenedorInformacionFactura">
        <Descriptions
          title="Detalles del Cliente"
          bordered
          column={{ xs: 1, sm: 1, md: 2 }}
          size="small"
        >
          <Descriptions.Item label="Nombre">{factura.NombreCliente}</Descriptions.Item>
          <Descriptions.Item label="Identificación">{factura.IdentificacionCliente}</Descriptions.Item>
          <Descriptions.Item label="Dirección">{factura.DireccionCliente}</Descriptions.Item>
          <Descriptions.Item label="Correo">{factura.CorreoElectronicoCliente}</Descriptions.Item>
          <Descriptions.Item label="Vendedor">{factura.Vendedor}</Descriptions.Item>
          <Descriptions.Item label="Fecha">{factura.Fecha}</Descriptions.Item>
        </Descriptions>
        <Table
          dataSource={factura.Lineas}
          columns={encabezados}
          rowKey="Consecutivo"
          pagination={false}
          bordered
          size="small"
          className="tablaInformacionFactura"
        />
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Subtotal (Sin impuestos)">{factura.SubTotal}</Descriptions.Item>
          <Descriptions.Item label="Descuento">{factura.Descuento}</Descriptions.Item>
          <Descriptions.Item label="Total">{factura.Total}</Descriptions.Item>
        </Descriptions>
      </div>
      <Modal
        title={tituloError}
        open={error}
        onOk={() => setError(false)}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <p>{cuerpoError}</p>
      </Modal>
      <Spin spinning={cargando} size="large" fullscreen />
    </div>
  );
}
;
export default VerFactura;