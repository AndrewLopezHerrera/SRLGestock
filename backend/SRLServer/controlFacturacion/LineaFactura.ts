/**
 * Interfaz que representa una línea de producto dentro de una factura.
 * Incluye información sobre el producto, cantidades y totales.
 */
interface LineaFactura{
  /** Consecutivo único del producto */
  Consecutivo: number;
  /** Nombre del producto */
  Nombre: number;
  /** Cantidad disponible del producto */
  Cantidad: number;
  /** Cantidad seleccionada para la factura */
  CantidadSeleccionada: number;
  /** Precio unitario del producto */
  Precio: number;
  /** Total de la línea (precio * cantidad seleccionada) */
  Total: number;
}

export default LineaFactura;