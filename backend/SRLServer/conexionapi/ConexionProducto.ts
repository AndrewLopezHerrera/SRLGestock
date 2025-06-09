import {
  Context,
  Router,
} from "https://deno.land/x/oak@v12.4.0/mod.ts";
import GestorProductos from "../controlproductos/GestorProductos.ts";
import Producto from "../controlproductos/Producto.ts";
import ProductoLista from "../controlproductos/ProductoLista.ts";


export default class ConexionProducto {
  private Enrutador : Router;
  private Gestor : GestorProductos;
  public constructor(enrutador: Router){
    this.Enrutador = enrutador;
    this.Gestor = new GestorProductos();
    this.CrearProducto();
    this.VerProductos();
    this.SeleccionarProducto();
    this.ActualizarProducto();
    this.EliminarProducto();
  }

  private CrearProducto() : void {
    this.Enrutador.post("/CrearProducto", async (contexto : Context) => {
      try {
        const { producto , idSesion } = await contexto.request.body({ type: "json" }).value as {
          producto: Producto;
          idSesion: string;
        };
        const { Consecutivo, Nombre, Descripcion, Precio, Impuesto, Cantidad } = producto;
        if(!Consecutivo
            || !Nombre
            || !Descripcion
            || !Precio
            || !Impuesto 
            || !Cantidad
            || !idSesion)
          throw new Error("Datos incompletos");
        const regex = /^\d{1,15}$/
        if(!regex.test(String(producto.Consecutivo))
          || !regex.test(String(producto.Precio))
          || !regex.test(String(producto.Cantidad)))
          throw new Error("Los números no deben tener más de 15 dígitos");
        if(producto.Impuesto > 100 || producto.Impuesto < 0)
          throw new Error("El impuesto debe estar entre 0 y 100");
        const resultado : boolean = await this.Gestor.AgregarProducto(producto, idSesion);
        if(!resultado)
          throw new Error("Sucedió un error al crear el producto");
        contexto.response.status = 200;
        contexto.response.body = {resultado};
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

  private VerProductos() : void {
    this.Enrutador.post("/VerProducto", async (contexto : Context) => {
      try {
        const { consecutivo, nombre, idSesion } = await contexto.request.body({ type: "json" }).value as {
          consecutivo: string;
          nombre: string;
          idSesion: string;
        };
        if(consecutivo == null
            || nombre == null
            || !idSesion)
          throw new Error("Datos incompletos o incorrectos");
        const resultado : ProductoLista[] = await this.Gestor.VerProductos(consecutivo, nombre, idSesion);
        if(!resultado)
          throw new Error("Sucedió un error al recuperar los producto");
        contexto.response.status = 200;
        contexto.response.body = {resultado};
      } catch (error) {
        contexto.response.status = 400;
        if (error instanceof Error) {
          contexto.response.body = { error : error.message };
          console.log(error.message);
        } else {
          contexto.response.body = { error : "Error desconocido en el servidor. Si el problema persiste comuniquese con el administrador" };
          console.log("Error desconocido: Ver producto");
        }
      }
    });
  };

  private SeleccionarProducto() : void {
    this.Enrutador.post("/SeleccionarProducto", async (contexto : Context) => {
      try {
        const { consecutivo, idSesion } = await contexto.request.body({ type: "json" }).value as {
          consecutivo: number;
          idSesion: string;
        };
        if(!consecutivo
            || !idSesion)
          throw new Error("Datos incompletos o incorrectos");
        const resultado : Producto = await this.Gestor.SeleccionarProducto(consecutivo, idSesion);
        if(!resultado)
          throw new Error("Sucedió un error al recuperar los producto");
        contexto.response.status = 200;
        contexto.response.body = {resultado};
      } catch (error) {
        contexto.response.status = 400;
        if (error instanceof Error) {
          contexto.response.body = { error : error.message };
          console.log(error.message);
        } else {
          contexto.response.body = { error : "Error desconocido en el servidor. Si el problema persiste comuniquese con el administrador" };
          console.log("Error desconocido: Seleccionar producto");
        }
      }
    });
  };

  private ActualizarProducto(): void {
    this.Enrutador.post("/ActualizarProducto", async (contexto : Context) => {
      try {
        const { producto, idSesion } = await contexto.request.body({ type: "json" }).value as {
          producto: Producto;
          idSesion: string;
        };
        const { Consecutivo, Nombre, Descripcion, Precio, Impuesto, Cantidad } = producto;
        if(!Consecutivo
            || !Nombre
            || !Descripcion
            || Precio < 0
            || Impuesto < 0
            || Cantidad < 0
            || !idSesion)
          throw new Error("Datos incompletos");
        const resultado : boolean = await this.Gestor.ModificarProducto(producto, idSesion);
        if(!resultado)
          throw new Error("Sucedió un error al recuperar los producto");
        contexto.response.status = 200;
        contexto.response.body = {resultado};
      } catch (error) {
        contexto.response.status = 400;
        if (error instanceof Error) {
          contexto.response.body = { error : error.message };
          console.log(error.message);
        } else {
          contexto.response.body = { error : "Error desconocido en el servidor. Si el problema persiste comuniquese con el administrador" };
          console.log("Error desconocido: Seleccionar producto");
        }
      }
    });
  }

  private EliminarProducto() : void {
    this.Enrutador.post("/EliminarProducto", async (contexto : Context) => {
      try {
        const { consecutivo, idSesion } = await contexto.request.body({ type: "json" }).value as {
          consecutivo: number;
          idSesion: string;
        };
        if(!consecutivo
            || !idSesion)
          throw new Error("Datos incompletos o incorrectos");
        const resultado : boolean = await this.Gestor.EliminarProducto(consecutivo, idSesion);
        if(!resultado)
          throw new Error("Sucedió un error al recuperar los producto");
        contexto.response.status = 200;
        contexto.response.body = {resultado};
      } catch (error) {
        contexto.response.status = 400;
        if (error instanceof Error) {
          contexto.response.body = { error : error.message };
          console.log(error.message);
        } else {
          contexto.response.body = { error : "Error desconocido en el servidor. Si el problema persiste comuniquese con el administrador" };
          console.log("Error desconocido: Seleccionar producto");
        }
      }
    });
  };
}