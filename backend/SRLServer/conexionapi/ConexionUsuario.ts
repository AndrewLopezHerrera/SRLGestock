import {
  Context,
  Router,
} from "https://deno.land/x/oak@v12.4.0/mod.ts";
import GestorSesionUsuario from "../controlusuario/GestorSesionUsuario.ts";
import RolUsuarioSQL from "../conexionsql/RolUsuarioSQLInterface.ts";

export default class ConexionUsuario {
  private Enrutador : Router;
  private GestorSesionesUsuario : GestorSesionUsuario;
  public constructor(enrutador: Router){
    this.Enrutador = enrutador;
    this.GestorSesionesUsuario = new GestorSesionUsuario();
    this.IniciarSesion();
    this.CrearUsuario();
    this.CerrarSesion();
    this.RecuperarContrasena();
    this.RecuperarInformacionGeneral();
    this.CambiarContrasena();
    this.TraerRoles();
  }

  private IniciarSesion() : void {
    this.Enrutador.post("/IniciarSesion", async (contexto : Context) => {
      try {
        const { correoElectronico , contrasena } = await contexto.request.body({ type: "json" }).value;
        if(!correoElectronico || !contrasena)
          throw new Error("Datos incompletos");
        const idSesion : string = await this.GestorSesionesUsuario.IniciarSesion(correoElectronico, contrasena);

        contexto.response.status = 200;
        contexto.response.body = {idSesion};
      } catch (error) {
        contexto.response.status = 400;
        if (error instanceof Error) {
          contexto.response.body = { error : error.message };
          console.log(error.message);
        } else {
          contexto.response.body = { error : "Error desconocido en el servidor. Si el problema persiste comuniquese con el administrador" };
          console.log("Error desconocido: Iniciar Sesion");
        }
      }
    });
  };

  private CrearUsuario() : void {
    this.Enrutador.post("/CrearUsuario", async (contexto : Context) => {
      try{
        const {
          idSesion,
          correoElectronico,
          nombre,
          apellidoPaterno,
          apellidoMaterno,
          idRol,
          } = await contexto.request.body({ type: "json" }).value;
        if(!correoElectronico || !nombre || !apellidoPaterno || !apellidoMaterno || !idRol
          || !idSesion
        )
          throw new Error("Los datos no están completos");
        const datos : Map<string, string> = new Map();
        datos.set("idSesion", idSesion);
        datos.set("correoElectronico", correoElectronico);
        datos.set("nombre", nombre);
        datos.set("apellidoPaterno", apellidoPaterno);
        datos.set("apellidoMaterno", apellidoMaterno);
        datos.set("idRol", idRol);
        const idUsuario : string = await this.GestorSesionesUsuario.CrearUsuario(datos);
        contexto.response.status = 200;
        contexto.response.body = { idUsuario };
      } catch (error) {
        contexto.response.status = 400;
        if (error instanceof Error) {
          contexto.response.body = { error : error.message };
          console.log(error.message);
        } else {
          contexto.response.body = { error : "Error desconocido en el servidor. Si el problema persiste comuniquese con el administrador" };
          console.log("Error desconocido: Crear Usuario");
        }
      }
    });
  }

  private CerrarSesion() : void {
    this.Enrutador.post("/CerrarSesion", async (contexto : Context) => {
      try {
        const { idSesion } = await contexto.request.body({ type: "json" }).value;
        if(!idSesion)
          throw new Error("El id de sesión es inválido.");
        this.GestorSesionesUsuario.CerrarSesion(idSesion);
        contexto.response.status = 200;
        contexto.response.body = {message : "Se ha cerrado la sesión"};
      } catch (error) {
        contexto.response.status = 400;
        if (error instanceof Error) {
          contexto.response.body = { error : error.message };
          console.log(error.message);
        } else {
          contexto.response.body = { error : "Error desconocido en el servidor. Si el problema persiste comuniquese con el administrador" };
          console.log("Error desconocido: Cerrar Sesion");
        }
      }
    });
  }

  private RecuperarContrasena() : void {
    this.Enrutador.post("/RecuperarContrasena", async (contexto : Context) => {
      try {
        const { correoElectronico } = await contexto.request.body({ type: "json" }).value;
        if(!correoElectronico)
          throw new Error("El correo electrónico es inválido.");
        await this.GestorSesionesUsuario.RecuperarContrasena(correoElectronico);
        contexto.response.status = 200;
        contexto.response.body = {message : "Se ha enviado el correo electrónica con la nueva contraseña"};
      } catch (error) {
        contexto.response.status = 400;
        if (error instanceof Error) {
          contexto.response.body = { error : error.message };
          console.log(error.message);
        } else {
          contexto.response.body = { error : "Error desconocido en el servidor. Si el problema persiste comuniquese con el administrador" };
          console.log("Error desconocido: Recuperar contraseña");
        }
      }
    });
  }

  private RecuperarInformacionGeneral() : void {
    this.Enrutador.post("/RecuperarInformacionGeneralUsuario", async (contexto : Context) => {
      try {
        const { idSesion } = await contexto.request.body({ type: "json" }).value;
        if(!idSesion)
          throw new Error("El id de sesión es inválido.");
        const informacion : Map<string, string> = GestorSesionUsuario.RecuperarInformaciónGeneral(idSesion);
        const informacionObject = Object.fromEntries(informacion);
        contexto.response.status = 200;
        contexto.response.body = informacionObject;
      } catch (error) {
        contexto.response.status = 400;
        if (error instanceof Error) {
          contexto.response.body = { error : error.message };
          console.log(error.message);
        } else {
          contexto.response.body = { error : "Error desconocido en el servidor. Si el problema persiste comuniquese con el administrador" };
          console.log("Error desconocido: Recuperar Información General");
        }
      }
    });
  }

  private CambiarContrasena() : void {
    this.Enrutador.post("/CambiarContrasena", async (contexto : Context) => {
      try {
        const { idSesion , contrasenaActual, contrasenaNueva } = await contexto.request.body({ type: "json" }).value;
        if(!idSesion || !contrasenaActual || !contrasenaNueva)
          throw new Error("Los datos están incompletos o el id de sesión es inválido");
        const informacion : boolean = await this.GestorSesionesUsuario.CambiarContrasena(
          idSesion, contrasenaActual, contrasenaNueva);
        contexto.response.status = 200;
        contexto.response.body = {informacion};
      } catch (error) {
        contexto.response.status = 400;
        if (error instanceof Error) {
          contexto.response.body = { error : error.message };
          console.log(error.message);
        } else {
          contexto.response.body = { error : "Error desconocido en el servidor. Si el problema persiste comuniquese con el administrador" };
          console.log("Error desconocido: Cambiar Contraseña");
        }
      }
    });
  }

  private TraerRoles() : void {
    this.Enrutador.post("/TraerRoles", async (contexto : Context) => {
      try {
        const roles : RolUsuarioSQL[] = await this.GestorSesionesUsuario.TraerUsuariosRoles();
        const informacionObject = Object.fromEntries(
          roles.map(rol => [rol.IdRol, rol.NomberRol])
        );
        contexto.response.status = 200;
        contexto.response.body = informacionObject;
      } catch (error) {
        contexto.response.status = 400;
        if (error instanceof Error) {
          contexto.response.body = { error : error.message };
          console.log(error.message);
        } else {
          contexto.response.body = { error : "Error desconocido en el servidor. Si el problema persiste comuniquese con el administrador" };
          console.log("Error desconocido: Traer Roles");
        }
      }
    });
  }

}