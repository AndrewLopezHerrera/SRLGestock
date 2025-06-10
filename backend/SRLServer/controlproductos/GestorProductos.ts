import Producto from "./Producto.ts";
import ConexionSQLInventario from "../conexionsql/ConexionSQLInventario.ts";
import GestorSesionUsuario from "../controlusuario/GestorSesionUsuario.ts";
import ProductoLista from "./ProductoLista.ts";

/**
 * Clase encargada de gestionar las operaciones sobre productos.
 * Permite agregar, ver, seleccionar, modificar y eliminar productos,
 * validando siempre que la sesión del usuario sea válida.
 */
class GestorProductos{
  /** Conexión a la base de datos de inventario */
  private ConexionSQL : ConexionSQLInventario;

  /**
   * Inicializa el gestor de productos y la conexión SQL.
   */
  constructor(){
    this.ConexionSQL = new ConexionSQLInventario();
  }

  /**
   * Agrega un nuevo producto al inventario.
   * @param producto - Objeto Producto con los datos a registrar.
   * @param sesion - ID de la sesión del usuario.
   * @returns True si el producto fue agregado correctamente.
   * @throws Error si la sesión no existe o la operación falla.
   */
  public async AgregarProducto(producto : Producto, sesion: string) : Promise<boolean> {
    if(!GestorSesionUsuario.VerificarEstadoSesion(sesion))
      throw new Error("La sesión de usuario no existe");
    const respuesta : number = await this.ConexionSQL.AgregarProducto(producto);
    if(respuesta != 1)
      return false;
    return true;
  }

  /**
   * Obtiene una lista de productos filtrados por consecutivo y nombre.
   * @param consecutivo - Consecutivo del producto (puede ser vacío).
   * @param nombre - Nombre del producto (puede ser vacío).
   * @param sesion - ID de la sesión del usuario.
   * @returns Lista de productos encontrados.
   * @throws Error si la sesión no existe.
   */
  public async VerProductos(consecutivo: string, nombre: string, sesion: string): Promise<ProductoLista[]> {
    if(!GestorSesionUsuario.VerificarEstadoSesion(sesion))
      throw new Error("La sesión de usuario no existe");
    const respuesta : ProductoLista[] = await this.ConexionSQL.VerProductos(consecutivo, nombre);
    return respuesta;
  }

  /**
   * Selecciona un producto específico por su consecutivo.
   * @param consecutivo - Consecutivo único del producto.
   * @param sesion - ID de la sesión del usuario.
   * @returns Objeto Producto con los datos encontrados.
   * @throws Error si la sesión no existe.
   */
  public async SeleccionarProducto(consecutivo: number, sesion: string): Promise<Producto>{
    if(!GestorSesionUsuario.VerificarEstadoSesion(sesion))
      throw new Error("La sesión de usuario no existe");
    const respuesta : Producto = await this.ConexionSQL.SeleccionarProducto(consecutivo);
    return respuesta;
  }
  
  /**
   * Modifica los datos de un producto existente.
   * @param producto - Objeto Producto con los datos actualizados.
   * @param sesion - ID de la sesión del usuario.
   * @returns True si la actualización fue exitosa.
   * @throws Error si la sesión no existe o la actualización falla.
   */
  public async ModificarProducto(producto: Producto, sesion: string): Promise<boolean> {
    if(!GestorSesionUsuario.VerificarEstadoSesion(sesion))
      throw new Error("La sesión de usuario no existe");
    const respuesta : number = await this.ConexionSQL.ActualizarProducto(producto);
    if(respuesta != 1)
      throw new Error("No se ha podido actualizar el producto");
    return true;
  }
  
  /**
   * Elimina un producto del inventario.
   * @param consecutivoProducto - Consecutivo único del producto a eliminar.
   * @param sesion - ID de la sesión del usuario.
   * @returns True si el producto fue eliminado correctamente.
   * @throws Error si la sesión no existe o la eliminación falla.
   */
  public async EliminarProducto(consecutivoProducto: number, sesion: string): Promise<boolean> {
    if(!GestorSesionUsuario.VerificarEstadoSesion(sesion))
      throw new Error("La sesión de usuario no existe");
    const resultado : number = await this.ConexionSQL.EliminarProducto(consecutivoProducto);
    if(resultado != 1)
      throw new Error("No se ha podido eliminar el producto");
    return true;
  }
}

export default GestorProductos;