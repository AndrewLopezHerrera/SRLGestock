import { Button, Input, Card, List, Modal } from "antd";
import "./BuscarFactura.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FacturaLista from "./FacturaLista";
import { buscarFacturasAux } from "./FuncionesAuxiliaresCrearFactura";

function BuscarFactura(){
  const navegador = useNavigate();
  const [Facturas, setFacturas] = useState<FacturaLista[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [tituloError, setTituloError] = useState<string>("");
  const [cuerpoError, setCuerpoError] = useState<string>("");
  const [busqueda, setBusqueda] = useState<string>("");

  const buscarFactura = async () => {
    try {
      const resultado : FacturaLista[] = await buscarFacturasAux(busqueda);
      setFacturas(resultado);
    }
    catch (err) {
      if (typeof err === "object" && err !== null && "message" in err) {
        setTituloError("Error al mostrar las facturas");
        setCuerpoError(String((err as any).message));
      } else {
        setTituloError("Error al mostrar las facturas");
        setCuerpoError("Error desconocido");
      }
      setError(true);
    }
  }

  useEffect(() => {buscarFactura()}, []);

  useEffect(() => {buscarFactura()}, [busqueda]);

  const verFactura = (consecutivo : string) => {
    navegador("/verFactura/" + consecutivo + "/buscarFactura");
  }

  const irMenuFacturacion = () => {
    navegador("/menuFacturacion");
  }

  return(
    <div className="contenedorSeleccionarFactura">
      <div className="contenedorTituloBotonVolverSeleccionarFactura">
        <div className="contenedorBotonVolverSeleccionarFactura">
          <Button onClick={irMenuFacturacion} className="botonVolver">Volver</Button>
        </div>
        <div className="contenedorTituloSeleccionarFactura">
          <h1 className="tituloSeleccionarFactura">Seleccionar Factura</h1>
        </div>
        <div className="contenedorBotonVolverSeleccionarFactura" />
      </div>
      <div className="contenedorListaSeleccionarFactura">
        <div className="seccionFormularioSeleccionarFactura">
          <Input
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
            }}
            placeholder="Escriba el ID de la factura"
            className="entradaSeleccionarFactura" />
        </div>
        <div className="contenedorFacturas">
          <List
            grid={{ gutter: 16, column: 2 }}
            style={{width: '100%'}}
            dataSource={Facturas}
            locale={{ emptyText: 'Sin facturas' }}
            renderItem={(factura) => (
              <List.Item>
                <Card
                  title={factura.IdFactura}
                  extra={<Button type="primary" onClick={() => verFactura(factura.IdFactura)}>Ver</Button>}
                >
                  <p><strong>Cliente:</strong> {factura.NombreCliente}</p>
                  <p><strong>Vendedor:</strong> {factura.Vendedor}</p>
                  <p><strong>Fecha:</strong> {factura.Fecha}</p>
                  <p><strong>Monto total:</strong> {factura.Total}</p>
                </Card>
              </List.Item>
            )}
          />
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
      </div>
    </div>
  );
}
;
export default BuscarFactura;