import Usuario from "./Usuario.ts";
import ConexionPostgreSQL from "../conexionsql/ConexionSQLUsuario.ts";
import SesionUsuario from "./SesionUsuario.ts";
import UsuarioSQL from "../conexionsql/UsuarioSQLInterface.ts";
import { hash , genSalt} from "encriptadorContrasenas";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

export default class GestorSesionUsuario {
  private ConexionSQL : ConexionPostgreSQL;
  private SesionesDeUsuario : Map<string, SesionUsuario>;
  private IniciosDeSesion: Map<string, SesionUsuario>;

  constructor(){
    this.ConexionSQL = new ConexionPostgreSQL();
    this.SesionesDeUsuario = new Map();
    this.IniciosDeSesion = new Map();
  }

  public IniciarSesion(correoElectronico: string, contrasena: string) : string {
    let idSesion : string = "";
    if(this.IniciosDeSesion.has(correoElectronico)){
      const sesionUsuario = this.IniciosDeSesion.get(correoElectronico);
      if(sesionUsuario?.IniciarSesion(contrasena)){
        idSesion = sesionUsuario.ObtenerIDSesion();
      }
      else
        throw new Error("Credenciales incorrectas");
    }
    return idSesion;
  };

  public CrearUsuario(datos: Map<string, string>) : string{
    let idUsuario : string = "";
    this.ConexionSQL.CrearUsuario(datos).then((idUsuarioNuevo : number) => {
      idUsuario = String(idUsuarioNuevo);
    })
    return idUsuario;
  }

  public CerrarSesion(idSesion: string): boolean {
    if(!this.SesionesDeUsuario.delete(idSesion))
      throw new Error("No se puede cerrar sesión, ya que no existe la sesión.");
    return true;
  }
  
  public VerificarEstadoSesion(idSesion: string): boolean {
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
    this.EnviarCorreoElectronico(usuario.correoElectronico, nuevaContrasena);
  }
  
  public RecuperarInformaciónGeneral(idSesion: string): Map<string, string> {
    const sesion : SesionUsuario | undefined = this.SesionesDeUsuario.get(idSesion);
    if(!sesion)
      throw new Error("No existe la sesión de usuario.");
    const usuario : Usuario = sesion.ObtenerUsuario();
    return usuario.RecuperarInformaciónGeneral();
  }

  public async CambiarContrasena(idSesion: string, contrasenaActual: string, contrasenaNueva: string): Promise<boolean> {
    const sesion : SesionUsuario | undefined = this.SesionesDeUsuario.get(idSesion);
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

  private async EnviarCorreoElectronico(correoDestino: string, contraseñaAleatoria: string): Promise<void> {
    const client = new SmtpClient();
    await client.connect({
      hostname: "sandbox.smtp.mailtrap.io",
      port: 587,
      username: "11a7a990a23c30",
      password: "2722419826f3f3",
    });

    await client.send({
      from: "recuperacion@srltechnology.com",
      to: correoDestino,
      subject: "Recuperación de contraseña SRL Technology",
      content: "Hola. Su nueva contraseña es " + contraseñaAleatoria,
    });

    await client.close();
  }
}