import LineaFactura from "./LineaFactura.ts";

/**
 * Interfaz que representa la información completa de una factura.
 * Incluye datos del cliente, vendedor, totales y las líneas de productos facturados.
 */
interface Factura{
  /** Identificador único de la factura */
  IdFactura: string;
  /** Nombre del cliente */
  NombreCliente: string;
  /** Dirección del cliente */
  DireccionCliente: string;
  /** Identificación del cliente */
  IdentificacionCliente: string;
  /** Correo electrónico del cliente */
  CorreoElectronicoCliente: string;
  /** Nombre del vendedor que realizó la factura */
  Vendedor: string;
  /** Fecha de emisión de la factura */
  Fecha: string;
  /** Subtotal de la factura antes de descuentos */
  SubTotal: number;
  /** Descuento aplicado a la factura */
  Descuento: number;
  /** Total final de la factura */
  Total: number;
  /** Lista de líneas de productos facturados */
  Lineas: LineaFactura[];
}

export default Factura;