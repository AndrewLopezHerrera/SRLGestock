import LineaFactura from "./LineaFactura.ts";

interface Factura{
  IdFactura: string;
  NombreCliente: string;
  DireccionCliente: string;
  IdentificacionCliente: string;
  CorreoElectronicoCliente: string;
  Vendedor: string;
  Fecha: string;
  SubTotal: number;
  Descuento: number;
  Total: number;
  Lineas: LineaFactura[];
}

export default Factura;