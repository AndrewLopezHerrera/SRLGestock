import {
  Context,
  helpers,
  Router,
} from "https://deno.land/x/oak@v12.4.0/mod.ts";
import GestorSesionUsuario from "../controlusuario/GestorSesionUsuario.ts";

const { getQuery } = helpers;

export default class ConexionUsuario {
  private Enrutador : Router;
  private GestorSesionesUsuario : GestorSesionUsuario;
  public constructor(enrutador: Router){
    this.Enrutador = enrutador;
    this.GestorSesionesUsuario = new GestorSesionUsuario();
    this.IniciarSesion();
    this.CrearUsuario();
  }

  private IniciarSesion() : void {
    this.Enrutador.post("/IniciarSesion", async (contexto : Context) => {
      try {
        const { correoElectronico , contrasena } = getQuery(contexto, { mergeParams: true });
        const idSesion : string = this.GestorSesionesUsuario.IniciarSesion(correoElectronico, contrasena);
        contexto.response.status = 200;
        contexto.response.body = {idSesion};
      } catch (error) {
        contexto.response.status = 400;
        if (error instanceof Error) {
          contexto.response.body = { error : error.message };
        } else {
          contexto.response.body = { error : "Error desconocido en el servidor. Si el problema persiste comuniquese con el administrador" };
        }
      }
    });
  };

  private CrearUsuario() : void {
    this.Enrutador.post("/CrearUsuario", async (contexto : Context) => {
      try{
        const { 
          correoElectronico,
          nombre,
          apellidoPaterno,
          apellidoMaterno,
          telefono,
          contrasenaActual,
          idRol,
          provincia,
          canton,
          distrito,
          senas
          } = getQuery(contexto, { mergeParams: true });
        const datos : Map<string, string> = new Map();
        datos.set("correoElectronico", correoElectronico);
        datos.set("nombre", nombre);
        datos.set("apellidoPaterno", apellidoPaterno);
        datos.set("apellidoMaterno", apellidoMaterno);
        datos.set("telefono", telefono);
        datos.set("contrasenaActual", contrasenaActual);
        datos.set("idRol", idRol);
        datos.set("provincia", provincia);
        datos.set("canton", canton);
        datos.set("distrito", distrito);
        datos.set("senas", senas);
        const idUsuario : string = this.GestorSesionesUsuario.CrearUsuario(datos);
        contexto.response.status = 200;
        contexto.response.body = { idUsuario };
      } catch (error) {
        contexto.response.status = 400;
        if (error instanceof Error) {
          contexto.response.body = { error : error.message };
        } else {
          contexto.response.body = { error : "Error desconocido en el servidor. Si el problema persiste comuniquese con el administrador" };
        }
      }
    });
  }

  private CerrarSesion() : void {
    this.Enrutador.post("/CerrarSesion", async (contexto : Context) => {
      try {
        const { idSesion } = getQuery(contexto, { mergeParams: true });
        this.GestorSesionesUsuario.CerrarSesion(idSesion);
        contexto.response.status = 200;
        contexto.response.body = {message : "Se ha cerrado la sesión"};
      } catch (error) {
        contexto.response.status = 400;
        if (error instanceof Error) {
          contexto.response.body = { error : error.message };
        } else {
          contexto.response.body = { error : "Error desconocido en el servidor. Si el problema persiste comuniquese con el administrador" };
        }
      }
    });
  }

  private RecuperarContrasena() : void {
    this.Enrutador.post("/RecuperarContrasena", async (contexto : Context) => {
      try {
        const { correoElectronico } = getQuery(contexto, { mergeParams: true });
        this.GestorSesionesUsuario.RecuperarContrasena(correoElectronico);
        contexto.response.status = 200;
        contexto.response.body = {message : "Se ha cerrado la sesión"};
      } catch (error) {
        contexto.response.status = 400;
        if (error instanceof Error) {
          contexto.response.body = { error : error.message };
        } else {
          contexto.response.body = { error : "Error desconocido en el servidor. Si el problema persiste comuniquese con el administrador" };
        }
      }
    });
  }

  private RecuperarInformacionGeneral() : void {
    this.Enrutador.post("/RecuperarInformacionGeneralUsuario", async (contexto : Context) => {
      try {
        const { idSesion } = getQuery(contexto, { mergeParams: true });
        const informacion : Map<string, string> = this.GestorSesionesUsuario.RecuperarInformaciónGeneral(idSesion);
        const informacionObject = Object.fromEntries(informacion);
        contexto.response.status = 200;
        contexto.response.body = informacionObject;
      } catch (error) {
        contexto.response.status = 400;
        if (error instanceof Error) {
          contexto.response.body = { error : error.message };
        } else {
          contexto.response.body = { error : "Error desconocido en el servidor. Si el problema persiste comuniquese con el administrador" };
        }
      }
    });
  }

  private CambiarContrasena() : void {
    this.Enrutador.post("/RecuperarInformacionGeneralUsuario", async (contexto : Context) => {
      try {
        const { idSesion } = getQuery(contexto, { mergeParams: true });
        const informacion : Map<string, string> = this.GestorSesionesUsuario.RecuperarInformaciónGeneral(idSesion);
        const informacionObject = Object.fromEntries(informacion);
        contexto.response.status = 200;
        contexto.response.body = informacionObject;
      } catch (error) {
        contexto.response.status = 400;
        if (error instanceof Error) {
          contexto.response.body = { error : error.message };
        } else {
          contexto.response.body = { error : "Error desconocido en el servidor. Si el problema persiste comuniquese con el administrador" };
        }
      }
    });
  }

}