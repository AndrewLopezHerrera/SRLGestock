import ClientePostgreSQL from "./ClientePostgreSQL.ts";
import FacturaLista from "../controlFacturacion/FacturaLista.ts";
import Factura from "../controlFacturacion/Factura.ts";
import LineaFactura from "../controlFacturacion/LineaFactura.ts";

class ConexionSQLFacturas extends ClientePostgreSQL{
  constructor(){
    super();
  }

  public async BuscarFacturas(idFactura: string) : Promise<FacturaLista[]> {
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<FacturaLista>(
      "SELECT * FROM BuscarFactura($1)",
      [idFactura]
    );
    const facturas : FacturaLista[] = resultado.rows;
    return facturas;
  }

  public async CrearFactura(factura: Factura, idUsuario: number) : Promise<string> {
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<{crearfactura: string}>(
      "SELECT * FROM CrearFactura($1,$2,$3,$4,$5,$6)",
      [
        idUsuario,
        factura.IdentificacionCliente,
        factura.CorreoElectronicoCliente,
        factura.NombreCliente,
        factura.DireccionCliente,
        JSON.stringify(factura.Lineas)
      ]
    );
    const retorno : {crearfactura: string} = resultado.rows[0];
    return retorno.crearfactura;
  }

  public async SeleccionarFactura(idFactura: string) : Promise<Factura> {
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<Factura>(
      "SELECT * FROM SeleccionarFactura($1)",
      [idFactura]
    );
    if(resultado.rows.length == 0)
      throw new Error("No existe la factura seleccionada");
    const facturas : Factura = resultado.rows[0];
    return facturas;
  }
}

export default ConexionSQLFacturas;