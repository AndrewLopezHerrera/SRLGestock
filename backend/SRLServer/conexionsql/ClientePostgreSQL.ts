import { Client } from 'postgres';

/**
 * Esta clase es responsable de manejar la conexión a la base de datos PostgreSQL.
 */
export default class ClientePostgreSQL {
  /**
   * Instancia del cliente de conexión a PostgreSQL.
   * @type {Client}
   */
  private static ConexionPostgreSQL : Client;
  
  /**
   * Obtiene la instancia del cliente de conexión a PostgreSQL.
   * @returns {Client} - Instancia del cliente de conexión.
   */
  protected static ObtenerClienteSQL() : Client {
    return this.ConexionPostgreSQL;
  };

  /**
   * Establece la conexión a la base de datos PostgreSQL.
   * Configura los parámetros de conexión y conecta al servidor.
   */
  public static Conectar() : void {
    this.ConexionPostgreSQL = new Client({
      user: "backend",
      password: "askjfnsodpme",
      database: "SRLDataBase",
      hostname: "127.0.0.1",
      port: 5432
    });
    this.ConexionPostgreSQL.connect();
    console.log("Base de datos conectadas.");
  }
};

