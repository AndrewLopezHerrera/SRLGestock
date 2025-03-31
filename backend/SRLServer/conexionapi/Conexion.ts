import {
  Application,
  Router,
} from "https://deno.land/x/oak@v12.4.0/mod.ts";
import ConexionUsuario from "./ConexionUsuario.ts";

class Conexion {
  private App : Application;
  private Enrutador : Router;
  private ConexionActualUsuario : ConexionUsuario;
  constructor() {
    this.App = new Application();
    this.Enrutador = new Router();
    this.ConexionActualUsuario = new ConexionUsuario(this.Enrutador);
  }

  public IniciarServidor() : void{
    this.App.use(this.Enrutador.routes());
    this.App.use(this.Enrutador.allowedMethods());
    this.App.listen({port : 8080});
    console.log("Servidor escuchando en el puerto 8080");
  }
}