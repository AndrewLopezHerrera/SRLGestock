/**
 * Interfaz que representa la información básica de un producto en una lista.
 * Incluye el consecutivo, nombre y cantidad de ventas del producto.
 */
interface ProductoLista{
  /** Consecutivo único del producto (puede ser número o string) */
  Consecutivo: number | string,
  /** Nombre del producto */
  Nombre: string,
  /** Cantidad de ventas del producto */
  Ventas: number,
}

export default ProductoLista;