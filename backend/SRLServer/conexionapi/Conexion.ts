import {
  Application,
  Router,
} from "https://deno.land/x/oak@v12.4.0/mod.ts";
import ConexionUsuario from "./ConexionUsuario.ts";
import ClientePostgreSQL from "../conexionsql/ClientePostgreSQL.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import ConexionProducto from "./ConexionProducto.ts";

class Conexion {
  private App : Application;
  private Enrutador : Router;
  private ConexionActualUsuario : ConexionUsuario;
  private ConexionActualProducto : ConexionProducto;
  constructor() {
    this.App = new Application();
    this.Enrutador = new Router();
    this.ConexionActualUsuario = new ConexionUsuario(this.Enrutador);
    this.ConexionActualUsuario = new ConexionProducto(this.Enrutador);
    ClientePostgreSQL.Conectar();
  }

  public IniciarServidor() : void{
    this.App.use(oakCors());
    this.App.use(this.Enrutador.routes());
    this.App.use(this.Enrutador.allowedMethods());
    this.App.listen({port : 8080});
    console.log("Servidor escuchando en el puerto 8080");
  }
}

export default Conexion;