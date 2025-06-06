import Producto from "../controlproductos/Producto.ts";
import ClientePostgreSQL from "./ClientePostgreSQL.ts";
import ProductoLista from "../controlproductos/ProductoLista.ts";

class ConexionSQLInventario extends ClientePostgreSQL{
  constructor(){
    super();
  }

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

  public async VerProductos(consecutivo: string, nombre: string) : Promise<ProductoLista[]> {
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<ProductoLista>(
      "SELECT * FROM BuscarProducto($1,$2)",
      [consecutivo, nombre]
    );
    return resultado.rows;
  }

  public async SeleccionarProducto(consecutivo: number) : Promise<Producto>{
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<Producto>(
      "SELECT * FROM SeleccionarProducto($1)",
      [consecutivo]
    );
    if(resultado.rowCount == 0)
      throw new Error("No existe el producto");
    return resultado.rows[0];
  }

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