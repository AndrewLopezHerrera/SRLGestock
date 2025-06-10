import Producto from "../controlproductos/Producto.ts";
import ClientePostgreSQL from "./ClientePostgreSQL.ts";
import ProductoLista from "../controlproductos/ProductoLista.ts";

/**
 * Clase para gestionar operaciones de inventario en la base de datos PostgreSQL.
 * Hereda de ClientePostgreSQL para reutilizar la conexión.
 */
class ConexionSQLInventario extends ClientePostgreSQL{
  constructor(){
    super();
  }

  /**
   * Agrega un nuevo producto al inventario en la base de datos.
   * @param producto - Objeto Producto con los datos a registrar.
   * @returns 1 si el producto fue agregado correctamente.
   */
  public async AgregarProducto(producto: Producto) : Promise<number> {
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<{crearproducto: number}>(
      "SELECT * FROM CrearProducto($1,$2,$3,$4,$5,$6)",
      [producto.Consecutivo,
      producto.Nombre,
      producto.Descripcion,
      producto.Precio,
      producto.Impuesto,
      producto.Cantidad]
    );
    const numero : { crearproducto: number } = resultado.rows[0];
    return numero?.crearproducto;
  }

  /**
   * Obtiene una lista de productos filtrados por consecutivo y nombre.
   * @param consecutivo - Consecutivo del producto (puede ser vacío).
   * @param nombre - Nombre del producto (puede ser vacío).
   * @returns Lista de productos encontrados.
   */
  public async VerProductos(consecutivo: string, nombre: string) : Promise<ProductoLista[]> {
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<ProductoLista>(
      "SELECT * FROM BuscarProducto($1,$2)",
      [consecutivo, nombre]
    );
    return resultado.rows;
  }

  /**
   * Selecciona un producto específico por su consecutivo.
   * @param consecutivo - Consecutivo único del producto.
   * @returns Objeto Producto con los datos encontrados.
   * @throws Error si no existe el producto.
   */
  public async SeleccionarProducto(consecutivo: number) : Promise<Producto>{
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<Producto>(
      "SELECT * FROM SeleccionarProducto($1)",
      [consecutivo]
    );
    if(resultado.rowCount == 0)
      throw new Error("No existe el producto");
    return resultado.rows[0];
  }

  /**
   * Actualiza los datos de un producto existente en la base de datos.
   * @param producto - Objeto Producto con los datos actualizados.
   * @returns 1 si la actualización fue exitosa.
   */
  public async ActualizarProducto(producto: Producto) : Promise<number>{
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<{editarproducto: number}>(
      "SELECT * FROM EditarProducto($1,$2,$3,$4,$5,$6)",
      [
        producto.Consecutivo,
        producto.Nombre,
        producto.Descripcion,
        producto.Precio,
        producto.Impuesto,
        producto.Cantidad
      ]
    );
    const numero : { editarproducto: number } = resultado.rows[0];
    return numero?.editarproducto;
  }

  /**
   * Elimina un producto del inventario en la base de datos.
   * @param consecutivo - Consecutivo único del producto a eliminar.
   * @returns 1 si el producto fue eliminado correctamente.
   */
  public async EliminarProducto(consecutivo: number) : Promise<number>{
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<{eliminarproducto: number}>(
      "SELECT * FROM EliminarProducto($1)",
      [consecutivo]
    );
    const numero : { eliminarproducto: number } = resultado.rows[0];
    return numero?.eliminarproducto;
  }
}

export default ConexionSQLInventario;