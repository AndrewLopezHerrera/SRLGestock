import Producto from "./Producto.ts";
import ConexionSQLInventario from "../conexionsql/ConexionSQLInventario.ts";
import GestorSesionUsuario from "../controlusuario/GestorSesionUsuario.ts";
import ProductoLista from "./ProductoLista.ts";

class GestorProductos{
  private ConexionSQL : ConexionSQLInventario;

  constructor(){
    this.ConexionSQL = new ConexionSQLInventario();
  }

  public async AgregarProducto(producto : Producto, sesion: string) : Promise<boolean> {
    if(!GestorSesionUsuario.VerificarEstadoSesion(sesion))
      throw new Error("La sesión de usuario no existe");
    const respuesta : number = await this.ConexionSQL.AgregarProducto(producto);
    if(respuesta != 1)
      return false;
    return true;
  }

  public async VerProductos(consecutivo: string, nombre: string, sesion: string): Promise<ProductoLista[]> {
    if(!GestorSesionUsuario.VerificarEstadoSesion(sesion))
      throw new Error("La sesión de usuario no existe");
    const respuesta : ProductoLista[] = await this.ConexionSQL.VerProductos(consecutivo, nombre);
    return respuesta;
  }

  public async SeleccionarProducto(consecutivo: number, sesion: string): Promise<Producto>{
    if(!GestorSesionUsuario.VerificarEstadoSesion(sesion))
      throw new Error("La sesión de usuario no existe");
    const respuesta : Producto = await this.ConexionSQL.SeleccionarProducto(consecutivo);
    return respuesta;
  }
  
  public async ModificarProducto(producto: Producto, sesion: string): Promise<boolean> {
    if(!GestorSesionUsuario.VerificarEstadoSesion(sesion))
      throw new Error("La sesión de usuario no existe");
    const respuesta : number = await this.ConexionSQL.ActualizarProducto(producto);
    if(respuesta != 1)
      throw new Error("No se ha podido actualizar el producto");
    return true;
  }
  
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