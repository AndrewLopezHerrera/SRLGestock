import Empresa from "../controlempresa/Empresa.ts";
import ClientePostgreSQL from "./ClientePostgreSQL.ts";

/**
 * Clase que maneja las operaciones de base de datos relacionadas con la entidad Empresa.
 * Hereda de ClientePostgreSQL para utilizar las funcionalidades de conexión a la base de datos.
 */
class ConexionSQLEmpresa extends ClientePostgreSQL{
  constructor(){
    super();
  }

  /**
   * Seleciona una empresa que existe en la base de datos.
   * @param idEmpresa - Identificador único de la empresa a seleccionar.
   * @returns {Promise<Empresa>} - Promesa que resuelve con los datos de la empresa seleccionada.
   */
  public async SeleccionarEmpresa(idEmpresa: string) : Promise<Empresa> {
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<Empresa>(
      "SELECT * FROM SeleccionarEmpresa($1)",
      [idEmpresa]
    );
    const empresa : Empresa = resultado.rows[0];
    return empresa;
  }

  /**
   * Actualiza los datos de una empresa existente en la base de datos.
   * @param {Empresa} empresa - Objeto que contiene los datos actualizados de la empresa.
   * @returns {Promise<void>} - Promesa que se resuelve cuando la actualización se completa.
   */
  public async ActualizarEmpresa(empresa: Empresa) : Promise<void> {
    await ClientePostgreSQL.ObtenerClienteSQL().queryObject<Empresa>(
      "SELECT * FROM ActualizarEmpresa($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
      [ empresa.IdEmpresa,
        empresa.Cedula,
        empresa.Nombre,
        empresa.TipoEmpresa,
        empresa.Telefono,
        empresa.Fax,
        empresa.Correo,
        empresa.Provincia,
        empresa.Canton,
        empresa.Distrito,
        empresa.Senas
      ]
    );
  }
}

export default ConexionSQLEmpresa;