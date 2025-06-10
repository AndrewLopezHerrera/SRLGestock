/**
 * Interfaz que representa la información resumida de una factura para listados.
 * Incluye el identificador, vendedor, cliente, fecha y total de la factura.
 */
interface FacturaLista{
    /** Identificador único de la factura */
    IdFactura: string;
    /** Nombre del vendedor que realizó la factura */
    Vendedor: string;
    /** Nombre del cliente */
    NombreCliente: string;
    /** Fecha de emisión de la factura */
    Fecha: string;
    /** Total final de la factura */
    Total: number;
}

export default FacturaLista;