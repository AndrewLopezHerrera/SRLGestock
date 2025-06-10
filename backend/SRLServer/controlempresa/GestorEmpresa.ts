import ConexionSQLEmpresa from "../conexionsql/ConexionSQLEmpresa.ts";
import GestorSesionUsuario from "../controlusuario/GestorSesionUsuario.ts";
import Empresa from "./Empresa.ts";

/**
 * Clase GestorEmpresa
 * Esta clase se encarga de gestionar las operaciones relacionadas con las empresas,
 * como seleccionar y actualizar los datos de una empresa en la base de datos.
 */
class GestorEmpresa {
  /**
   * Instancia de la conexión a la base de datos para gestionar empresas.
   * @type {ConexionSQLEmpresa}
   */
  ConexionSQL: ConexionSQLEmpresa;
  /**
   * Crea una instancia del gestor de empresa.
   * Inicializa la conexión a la base de datos para gestionar empresas.
   */
  constructor() {
    this.ConexionSQL = new ConexionSQLEmpresa();
  }

  /**
   * Selecciona los datos de una empresa existente en la base de datos.
   * @param {Empresa} idEmpresa - ID de la empresa a selccionar.
   * @param {string} idSesion - Identificador de la sesión del usuario.
   * @returns {Promise<Empresa>} - Promesa que se resuelve cuando la actualización se completa.
   */
  public async SeleccionarEmpresa(idEmpresa: string, idSesion: string): Promise<Empresa> {
    if(!GestorSesionUsuario.VerificarEstadoSesion(idSesion)) {
      throw new Error("La sesión no existe o no es válida.");
    }
    const empresa = await this.ConexionSQL.SeleccionarEmpresa(idEmpresa);
    return empresa;
  }

  /**
   * Actualiza los datos de una empresa existente en la base de datos.
   * @param {Empresa} empresa - Objeto que contiene los datos actualizados de la empresa.
   * @param {string} idSesion - Identificador de la sesión del usuario.
   * @returns {Promise<void>} - Promesa que se resuelve cuando la actualización se completa.
   */
  public async ActualizarEmpresa(empresa: Empresa, idSesion: string): Promise<void> {
    if(!GestorSesionUsuario.VerificarEstadoSesion(idSesion)) {
      throw new Error("La sesión no existe o no es válida.");
    }
    await this.ConexionSQL.ActualizarEmpresa(empresa);
  }
};

export default GestorEmpresa;