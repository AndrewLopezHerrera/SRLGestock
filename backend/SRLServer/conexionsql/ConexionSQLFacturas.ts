import ClientePostgreSQL from "./ClientePostgreSQL.ts";
import FacturaLista from "../controlFacturacion/FacturaLista.ts";
import Factura from "../controlFacturacion/Factura.ts";

/**
 * Clase para gestionar operaciones de facturación en la base de datos PostgreSQL.
 * Hereda de ClientePostgreSQL para reutilizar la conexión.
 */
class ConexionSQLFacturas extends ClientePostgreSQL{
  constructor(){
    super();
  }

  /**
   * Busca facturas según el ID proporcionado.
   * @param idFactura - Identificador de la factura a buscar.
   * @returns Lista de facturas encontradas.
   */
  public async BuscarFacturas(idFactura: string) : Promise<FacturaLista[]> {
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<FacturaLista>(
      "SELECT * FROM BuscarFactura($1)",
      [idFactura]
    );
    const facturas : FacturaLista[] = resultado.rows;
    return facturas;
  }

  /**
   * Crea una nueva factura en la base de datos.
   * @param factura - Objeto Factura con los datos a registrar.
   * @param idUsuario - ID del usuario que crea la factura.
   * @returns El ID de la factura creada.
   */
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

  /**
   * Selecciona una factura específica por su ID.
   * @param idFactura - Identificador de la factura.
   * @throws Error si no existe la factura seleccionada.
   * @returns Objeto Factura con los datos encontrados.
   */
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