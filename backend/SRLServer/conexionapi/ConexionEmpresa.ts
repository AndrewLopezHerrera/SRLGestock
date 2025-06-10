import {
  Context,
  Router,
} from "https://deno.land/x/oak@v12.4.0/mod.ts";
import GestorEmpresa from "../controlempresa/GestorEmpresa.ts";
import Empresa from "../controlempresa/Empresa.ts";

/**
 * Clase encargada de definir y gestionar las rutas de la API relacionadas con la empresa.
 * Permite seleccionar y actualizar los datos de una empresa, validando la sesión del usuario y los datos recibidos.
 */
export default class ConexionFactura {
  /** Enrutador de Oak para definir las rutas */
  private Enrutador : Router;
  /** Gestor de operaciones sobre la empresa */
  private Gestor : GestorEmpresa;

  /**
   * Inicializa la clase y registra todas las rutas de la empresa.
   * @param enrutador - Instancia del enrutador de Oak.
   */
  public constructor(enrutador: Router){
    this.Enrutador = enrutador;
    this.Gestor = new GestorEmpresa();
    this.SeleccionarEmpresa();
    this.ActualizarEmpresa();
  }

  /**
   * Registra la ruta para recuperar la empresa seleccionada.
   * Ruta POST /SeleccionarEmpresa
   * @returns {void}
   */
  private SeleccionarEmpresa() : void {
    this.Enrutador.post("/SeleccionarEmpresa", async (contexto : Context) => {
      try {
        const { idEmpresa , idSesion } = await contexto.request.body({ type: "json" }).value as {
          idEmpresa: string;
          idSesion: string;
        };
        if(typeof idSesion !== "string" || !idEmpresa || !idSesion)
          throw new Error("Error en los datos ingresados.");
        const empresa : Empresa = await this.Gestor.SeleccionarEmpresa(idEmpresa, idSesion);
        contexto.response.status = 200;
        contexto.response.body = {empresa};
      } catch (error) {
        contexto.response.status = 400;
        if (error instanceof Error) {
          contexto.response.body = { error : error.message };
          console.log(error.message);
        } else {
          contexto.response.body = { error : "Error desconocido en el servidor. Si el problema persiste comuniquese con el administrador" };
          console.log("Error desconocido: Seleccionar empresa");
        }
      }
    });
  };

  /**
   * Registra la ruta para actualizar los datos de una empresa.
   * Ruta POST /ActualizarEmpresa
   * @returns {void}
   */
  private ActualizarEmpresa() : void {
    this.Enrutador.post("/SeleccionarEmpresa", async (contexto : Context) => {
      try {
        const { empresa , idSesion } = await contexto.request.body({ type: "json" }).value as {
          empresa: Empresa;
          idSesion: string;
        };
        if(typeof idSesion !== "string" || !empresa || !idSesion)
          throw new Error("Error en los datos ingresados.");
        const { IdEmpresa, Cedula, Nombre, TipoEmpresa, Telefono, Fax, Correo, Provincia, Canton, Distrito, Senas } = empresa;
        if(!IdEmpresa || !Cedula || !Nombre || !TipoEmpresa || !Telefono || !Fax || !Correo || !Provincia || !Canton || !Distrito || !Senas)
          throw new Error("Error en los datos ingresados.");
        await this.Gestor.ActualizarEmpresa(empresa, idSesion);
        contexto.response.status = 200;
      } catch (error) {
        contexto.response.status = 400;
        if (error instanceof Error) {
          contexto.response.body = { error : error.message };
          console.log(error.message);
        } else {
          contexto.response.body = { error : "Error desconocido en el servidor. Si el problema persiste comuniquese con el administrador" };
          console.log("Error desconocido: Crear producto");
        }
      }
    });
  };

}