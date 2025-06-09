import { Client } from 'postgres';

export default class ClientePostgreSQL {
  private static ConexionPostgreSQL : Client;
  
  protected static ObtenerClienteSQL() : Client {
    return this.ConexionPostgreSQL;
  };

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

