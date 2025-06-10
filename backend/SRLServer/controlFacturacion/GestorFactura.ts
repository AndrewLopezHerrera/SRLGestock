import ConexionSQLFacturas from "../conexionsql/ConexionSQLFacturas.ts";
import GestorSesionUsuario from "../controlusuario/GestorSesionUsuario.ts";
import Factura from "./Factura.ts";
import FacturaLista from "./FacturaLista.ts";

/**
 * Clase encargada de gestionar las operaciones de facturación.
 * Permite seleccionar, crear y buscar facturas, validando la sesión del usuario.
 */
class GestorFactura{
  /** Conexión a la base de datos de facturación */
  private ConexionSQL : ConexionSQLFacturas;

  /**
   * Inicializa el gestor de facturas y la conexión SQL.
   */
  constructor(){
    this.ConexionSQL = new ConexionSQLFacturas();
  }

  /**
   * Selecciona una factura específica por su ID.
   * @param IdFactura - Identificador único de la factura.
   * @param idSesion - ID de la sesión del usuario.
   * @returns Objeto Factura con los datos encontrados.
   * @throws Error si la sesión no existe.
   */
  public async SeleccionarFactura(IdFactura: string, idSesion:string): Promise<Factura>{
    if(!GestorSesionUsuario.VerificarEstadoSesion(idSesion))
      throw new Error("No existe la sesión de usuario");
    const factura : Factura = await this.ConexionSQL.SeleccionarFactura(IdFactura);
    return factura;
  }
  
  /**
   * Crea una nueva factura en el sistema.
   * @param detalles - Objeto Factura con los datos a registrar.
   * @param idSesion - ID de la sesión del usuario.
   * @returns El ID de la factura creada.
   * @throws Error si la sesión no existe o la creación falla.
   */
  public async CrearFactura(detalles: Factura, idSesion:string): Promise<string>{
    if(!GestorSesionUsuario.VerificarEstadoSesion(idSesion))
      throw new Error("No existe la sesión de usuario");
    const usuario : Map<string, string> = GestorSesionUsuario.RecuperarInformaciónGeneral(idSesion);
    const resultado : string = await this.ConexionSQL.CrearFactura(detalles, parseInt(String(usuario.get("idUsuario"))));
    if(!resultado)
      throw new Error("No se pudo crear la factura");
    return resultado;
  }

  /**
   * Busca facturas por su ID.
   * @param IdFactura - Identificador de la factura a buscar.
   * @param idSesion - ID de la sesión del usuario.
   * @returns Lista de facturas encontradas.
   * @throws Error si la sesión no existe.
   */
  public async BuscarFacturas(IdFactura: string, idSesion:string): Promise<FacturaLista[]>{
    if(!GestorSesionUsuario.VerificarEstadoSesion(idSesion))
      throw new Error("No existe la sesión de usuario");
    const facturas : FacturaLista[] = await this.ConexionSQL.BuscarFacturas(IdFactura);
    return facturas;
  }
}

export default GestorFactura;