import Usuario from "./Usuario.ts";
import ConexionPostgreSQL from "../conexionsql/ConexionSQLUsuario.ts";
import SesionUsuario from "./SesionUsuario.ts";
import UsuarioSQL from "../conexionsql/UsuarioSQLInterface.ts";
import { hash , genSalt} from "encriptadorContrasenas";
import RolUsuarioSQL from "../conexionsql/RolUsuarioSQLInterface.ts";
import CorreoElectronico from "../gestorcorreoselectronicos/CorreoElectronico.ts";

export default class GestorSesionUsuario {
  private ConexionSQL : ConexionPostgreSQL;
  private static SesionesDeUsuario : Map<string, SesionUsuario>;
  private IniciosDeSesion: Map<string, SesionUsuario>;

  constructor(){
    this.ConexionSQL = new ConexionPostgreSQL();
    GestorSesionUsuario.SesionesDeUsuario = new Map();
    this.IniciosDeSesion = new Map();
  }

  public async IniciarSesion(correoElectronico: string, contrasena: string) : Promise<string> {
    let idSesion : string = "";
    if(!this.IniciosDeSesion.has(correoElectronico))
      await this.CrearSesionUsuario(correoElectronico);
    const sesion = this.IniciosDeSesion.get(correoElectronico);
    if(!sesion)
      throw Error("No existe la sesión de usuario");
    idSesion = await sesion?.IniciarSesion(contrasena);
    this.IniciosDeSesion.delete(correoElectronico);
    GestorSesionUsuario.SesionesDeUsuario.set(idSesion, sesion);
    return idSesion;
  };

  private async CrearSesionUsuario(correoElectronico : string) : Promise<void> {
      const usuario : UsuarioSQL = await this.ConexionSQL.BuscarUsuario(correoElectronico);
      const usuarioSesion : Usuario = new Usuario(String(usuario.idUsuario), usuario.correoElectronico,
        usuario.nombre, usuario.apellidoPaterno, usuario.apellidoMaterno, usuario.contrasenaActual,
        usuario.nombreRol);
      const sesion : SesionUsuario = new SesionUsuario(usuarioSesion, GestorSesionUsuario.SesionesDeUsuario);
      this.IniciosDeSesion.set(correoElectronico, sesion);
  }

  public async CrearUsuario(datos: Map<string, string>) : Promise<string>{
    const usuarioCreador = GestorSesionUsuario.SesionesDeUsuario.get(String(datos.get("idSesion")));
    if(!usuarioCreador)
      throw new Error("La sesión de usuario no existe o ha expirado.")
    if(!(usuarioCreador.ObtenerUsuario().RecuperarInformaciónGeneral().get("nombreRol") == "Administrador"))
      throw new Error("Usted no es un administrador, no puede crear usuarios");
    datos.set("contrasenaActual", "jksdjflsdlf")
    const idUsuario = String(await this.ConexionSQL.CrearUsuario(datos));
    await this.RecuperarContrasena(String(datos.get("correoElectronico")));
    return idUsuario;
  }

  public CerrarSesion(idSesion: string): boolean {
    if(!GestorSesionUsuario.SesionesDeUsuario.delete(idSesion))
      throw new Error("No se puede cerrar sesión, ya que no existe la sesión.");
    return true;
  }
  
  public static VerificarEstadoSesion(idSesion: string): boolean {
    return this.SesionesDeUsuario.has(idSesion);
  }

  public async RecuperarContrasena(correoElectronico: string): Promise<void> {
    const usuario : UsuarioSQL = await this.ConexionSQL.BuscarUsuario(correoElectronico);
    const bytes = new Uint8Array(6);
    crypto.getRandomValues(bytes);
    const nuevaContrasena = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    const sal = await genSalt(15);
    const nuevaContrasenaCifrada = await hash(nuevaContrasena, sal);
    if(await this.ConexionSQL.CambiarContrasena(usuario.correoElectronico, nuevaContrasenaCifrada) !== 1)
      throw new Error("No se pudo cambiar la nueva contraseña.");
    GestorSesionUsuario.SesionesDeUsuario.delete(correoElectronico);
    CorreoElectronico.EnviarCorreoElectronico(correoElectronico, "Cambio contraseña",
      "Esta es la nueva contraseña: " + nuevaContrasena, "Recuperación Contraseña");
  }
  
  public RecuperarInformaciónGeneral(idSesion: string): Map<string, string> {
    const sesion : SesionUsuario | undefined = GestorSesionUsuario.SesionesDeUsuario.get(idSesion);
    if(!sesion)
      throw new Error("No existe la sesión de usuario.");
    const usuario : Usuario = sesion.ObtenerUsuario();
    return usuario.RecuperarInformaciónGeneral();
  }

  public async TraerUsuariosRoles() : Promise<RolUsuarioSQL[]> {
    return await this.ConexionSQL.TraerRoles();
  }

  public async CambiarContrasena(idSesion: string, contrasenaActual: string, contrasenaNueva: string): Promise<boolean> {
    const sesion : SesionUsuario | undefined = GestorSesionUsuario.SesionesDeUsuario.get(idSesion);
    if(!sesion)
      throw new Error("No existe la sesión de usuario.");
    const usuario : Usuario = sesion.ObtenerUsuario();
    if(!await usuario.CompararContrasena(contrasenaActual))
      throw new Error("Credenciales incorrectas")
    const sal = await genSalt(15);
    const nuevaContrasenaCifrada = await hash(contrasenaNueva, sal);
    const correoElectronico = usuario.ObtenerCorreoElectronico();
    if(await this.ConexionSQL.CambiarContrasena(correoElectronico, nuevaContrasenaCifrada) !== 1)
      throw new Error("No se ha podido cambiar la contrasena.");
    return true;
  }

}