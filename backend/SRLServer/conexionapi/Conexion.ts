import {
  Application,
  Router,
} from "https://deno.land/x/oak@v12.4.0/mod.ts";
import ConexionUsuario from "./ConexionUsuario.ts";
import ClientePostgreSQL from "../conexionsql/ClientePostgreSQL.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import ConexionProducto from "./ConexionProducto.ts";
import ConexionFactura from "./ConexionFactura.ts";

/**
 * Clase principal encargada de inicializar y configurar el servidor de la API.
 * Registra los módulos de usuario, producto y facturación, y gestiona la conexión a la base de datos.
 */
class Conexion {
  /** Instancia de la aplicación Oak */
  private App : Application;
  /** Enrutador principal de la aplicación */
  private Enrutador : Router;
  /** Módulo de rutas y lógica de usuario */
  private ConexionActualUsuario : ConexionUsuario;
  /** Módulo de rutas y lógica de productos */
  private ConexionActualProducto : ConexionProducto;
  /** Módulo de rutas y lógica de facturación */
  private ConexionActualFactura : ConexionFactura;

  /**
   * Inicializa la aplicación, el enrutador y los módulos de usuario, producto y factura.
   * También establece la conexión con la base de datos PostgreSQL.
   */
  constructor() {
    this.App = new Application();
    this.Enrutador = new Router();
    this.ConexionActualUsuario = new ConexionUsuario(this.Enrutador);
    this.ConexionActualProducto = new ConexionProducto(this.Enrutador);
    this.ConexionActualFactura = new ConexionFactura(this.Enrutador);
    ClientePostgreSQL.Conectar();
  }

  /**
   * Inicia el servidor HTTP en el puerto 8080 y configura los middlewares necesarios.
   */
  public IniciarServidor() : void{
    this.App.use(oakCors());
    this.App.use(this.Enrutador.routes());
    this.App.use(this.Enrutador.allowedMethods());
    this.App.listen({port : 8080});
    console.log("Servidor escuchando en el puerto 8080");
  }
}

export default Conexion;