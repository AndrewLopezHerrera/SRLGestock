import ConexionSQLFacturas from "../conexionsql/ConexionSQLFacturas.ts";
import GestorSesionUsuario from "../controlusuario/GestorSesionUsuario.ts";
import Factura from "./Factura.ts";
import FacturaLista from "./FacturaLista.ts";

class GestorFactura{
  private ConexionSQL : ConexionSQLFacturas;

  constructor(){
    this.ConexionSQL = new ConexionSQLFacturas();
  }

  public async SeleccionarFactura(IdFactura: string, idSesion:string): Promise<Factura>{
    if(!GestorSesionUsuario.VerificarEstadoSesion(idSesion))
      throw new Error("No existe la sesión de usuario");
    const factura : Factura = await this.ConexionSQL.SeleccionarFactura(IdFactura);
    return factura;
  }
  
  public async CrearFactura(detalles: Factura, idSesion:string): Promise<string>{
    if(!GestorSesionUsuario.VerificarEstadoSesion(idSesion))
      throw new Error("No existe la sesión de usuario");
    const usuario : Map<string, string> = GestorSesionUsuario.RecuperarInformaciónGeneral(idSesion);
    const resultado : string = await this.ConexionSQL.CrearFactura(detalles, parseInt(String(usuario.get("idUsuario"))));
    if(!resultado)
      throw new Error("No se pudo crear la factura");
    return resultado;
  }

  public async BuscarFacturas(IdFactura: string, idSesion:string): Promise<FacturaLista[]>{
    if(!GestorSesionUsuario.VerificarEstadoSesion(idSesion))
      throw new Error("No existe la sesión de usuario");
    const facturas : FacturaLista[] = await this.ConexionSQL.BuscarFacturas(IdFactura);
    return facturas;
  }
}

export default GestorFactura;