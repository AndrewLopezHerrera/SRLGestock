import Producto from "../controlproductos/Producto.ts";
import ClientePostgreSQL from "./ClientePostgreSQL.ts";
import ProductoLista from "../controlproductos/ProductoLista.ts";

class ConexionSQLInventario extends ClientePostgreSQL{
  constructor(){
    super();
  }

  public async AgregarProducto(producto: Producto) : Promise<number> {
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<{crearProducto: number}>(
      "SELECT * FROM CrearProducto($1,$2,$3,$4,$5,$6)",
      [producto.Consecutivo,
      producto.Nombre,
      producto.Descripcion,
      producto.Precio,
      producto.Impuesto,
      producto.Cantidad]
    );
    const numero : { crearProducto: number } = resultado.rows[0];
    return numero?.crearProducto;
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
    return resultado.rows[0];
  }

  public async EliminarProducto(consecutivo: number) : Promise<number>{
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<{eliminarProducto: number}>(
      "SELECT * FROM EliminarProducto($1)",
      [consecutivo]
    );
    const numero : { eliminarProducto: number } = resultado.rows[0];
    return numero?.eliminarProducto;
  }
}

export default ConexionSQLInventario;