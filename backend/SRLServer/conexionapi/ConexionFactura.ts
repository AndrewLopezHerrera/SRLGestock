import {
  Context,
  Router,
} from "https://deno.land/x/oak@v12.4.0/mod.ts";
import Factura from "../controlFacturacion/Factura.ts";
import GestorFactura from "../controlFacturacion/GestorFactura.ts";
import FacturaLista from "../controlFacturacion/FacturaLista.ts";
import LineaFactura from "../controlFacturacion/LineaFactura.ts";

/**
 * Clase encargada de definir y gestionar las rutas de la API relacionadas con facturación.
 * Permite seleccionar, crear y buscar facturas, validando la sesión del usuario y los datos recibidos.
 */
export default class ConexionFactura {
  /** Enrutador de Oak para definir las rutas */
  private Enrutador : Router;
  /** Gestor de operaciones sobre facturación */
  private Gestor : GestorFactura;

  /**
   * Inicializa la clase y registra todas las rutas de facturación.
   * @param enrutador - Instancia del enrutador de Oak.
   */
  public constructor(enrutador: Router){
    this.Enrutador = enrutador;
    this.Gestor = new GestorFactura();
    this.SeleccionarFactura();
    this.CrearFactura();
    this.BuscarFacturas();
  }

  /**
   * Ruta POST /SeleccionarFactura
   * Selecciona una factura específica por su ID.
   */
  private SeleccionarFactura() : void {
    this.Enrutador.post("/SeleccionarFactura", async (contexto : Context) => {
      try {
        const { idFactura , idSesion } = await contexto.request.body({ type: "json" }).value as {
          idFactura: string;
          idSesion: string;
        };
        if(typeof idSesion !== "string" || !idSesion)
          throw new Error("Error en los datos ingresados.");
        const factura : Factura = await this.Gestor.SeleccionarFactura(idFactura, idSesion);
        contexto.response.status = 200;
        contexto.response.body = {factura};
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

  /**
   * Ruta POST /CrearFactura
   * Crea una nueva factura en el sistema.
   */
  private CrearFactura() : void {
    this.Enrutador.post("/CrearFactura", async (contexto : Context) => {
      try {
        const { factura , idSesion } = await contexto.request.body({ type: "json" }).value as {
          factura: Factura;
          idSesion: string;
        };
        if(!factura.CorreoElectronicoCliente
          || !factura.DireccionCliente
          || !factura.Fecha
          || !factura.IdentificacionCliente
          || !factura.Lineas
          || !factura.NombreCliente
          || !idSesion)
          throw new Error("Error en los datos ingresados.");
        factura.Lineas = this.parseLineasFactura(factura.Lineas);
        const idFactura : string = await this.Gestor.CrearFactura(factura, idSesion);
        contexto.response.status = 200;
        contexto.response.body = {idFactura};
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

  /**
   * Parsea un arreglo de líneas de factura para asegurar el tipo de datos correcto.
   * @param data - Arreglo de líneas de factura.
   * @returns Arreglo de líneas de factura con los tipos correctos.
   */
  private parseLineasFactura(data: LineaFactura[]): LineaFactura[] {
    return data.map(this.parseLineaFactura);
  }
  
  /**
   * Parsea una línea de factura para asegurar el tipo de datos correcto.
   * @param linea - Línea de factura a procesar.
   * @returns Línea de factura con los tipos correctos.
   */
  private parseLineaFactura(linea: LineaFactura): LineaFactura {
    return {
      Consecutivo: Number(linea.Consecutivo),
      Nombre: Number(linea.Nombre),
      Cantidad: Number(linea.Cantidad),
      CantidadSeleccionada: Number(linea.CantidadSeleccionada),
      Precio: Number(linea.Precio),
      Total: Number(linea.Total),
    };
  }

  /**
   * Ruta POST /BuscarFactura
   * Busca facturas por su ID.
   */
  private BuscarFacturas() : void {
    this.Enrutador.post("/BuscarFactura", async (contexto : Context) => {
      try {
        const { idFactura , idSesion } = await contexto.request.body({ type: "json" }).value as {
          idFactura: string;
          idSesion: string;
        };
        if(typeof idFactura !== "string" || !idSesion)
          throw new Error("Error en los datos ingresados.");
        const factura : FacturaLista[] = await this.Gestor.BuscarFacturas(idFactura, idSesion);
        contexto.response.status = 200;
        contexto.response.body = {factura};
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