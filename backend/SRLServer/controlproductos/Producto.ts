/**
 * Interfaz que representa la información completa de un producto.
 * Incluye datos como consecutivo, nombre, descripción, precio, impuesto, cantidad en inventario y cantidad de ventas.
 */
interface Producto {
  /** Consecutivo único del producto */
  Consecutivo: number;
  /** Nombre del producto */
  Nombre: string,
  /** Descripción del producto */
  Descripcion: string,
  /** Precio unitario del producto */
  Precio: number,
  /** Porcentaje de impuesto aplicado al producto */
  Impuesto: number,
  /** Cantidad disponible en inventario */
  Cantidad: number,
  /** Cantidad total de ventas realizadas del producto */
  CantidadVentas: number,
}

export default Producto;