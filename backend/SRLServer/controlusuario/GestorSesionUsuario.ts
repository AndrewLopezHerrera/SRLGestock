import Usuario from "./Usuario.ts";
import ConexionPostgreSQL from "../conexionsql/ConexionSQLUsuario.ts";
import SesionUsuario from "./SesionUsuario.ts";
import UsuarioSQL from "../conexionsql/UsuarioSQLInterface.ts";
import { hash , genSalt} from "encriptadorContrasenas";
import RolUsuarioSQL from "../conexionsql/RolUsuarioSQLInterface.ts";
import CorreoElectronico from "../gestorcorreoselectronicos/CorreoElectronico.ts";

/**
 * Clase encargada de gestionar las sesiones de usuario y operaciones relacionadas.
 * Permite iniciar/cerrar sesión, crear usuarios, recuperar y cambiar contraseñas, y consultar roles.
 */
export default class GestorSesionUsuario {
  /** Conexión a la base de datos PostgreSQL para usuarios */
  private ConexionSQL : ConexionPostgreSQL;
  /** Mapa estático de sesiones activas por ID de sesión */
  private static SesionesDeUsuario : Map<string, SesionUsuario>;
  /** Mapa de inicios de sesión temporales por correo electrónico */
  private IniciosDeSesion: Map<string, SesionUsuario>;

  /**
   * Inicializa el gestor de sesiones y la conexión SQL.
   */
  constructor(){
    this.ConexionSQL = new ConexionPostgreSQL();
    GestorSesionUsuario.SesionesDeUsuario = new Map();
    this.IniciosDeSesion = new Map();
  }

  /**
   * Inicia sesión para un usuario dado su correo y contraseña.
   * @param correoElectronico - Correo electrónico del usuario.
   * @param contrasena - Contraseña del usuario.
   * @returns El ID de la sesión creada.
   * @throws Error si no existe la sesión de usuario.
   */
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

  /**
   * Crea una nueva sesión de usuario y la almacena temporalmente.
   * @param correoElectronico - Correo electrónico del usuario.
   */
  private async CrearSesionUsuario(correoElectronico : string) : Promise<void> {
      const usuario : UsuarioSQL = await this.ConexionSQL.BuscarUsuario(correoElectronico);
      const usuarioSesion : Usuario = new Usuario(String(usuario.idUsuario), usuario.correoElectronico,
        usuario.nombre, usuario.apellidoPaterno, usuario.apellidoMaterno, usuario.contrasenaActual,
        usuario.nombreRol);
      const sesion : SesionUsuario = new SesionUsuario(usuarioSesion, GestorSesionUsuario.SesionesDeUsuario);
      this.IniciosDeSesion.set(correoElectronico, sesion);
  }

  /**
   * Crea un nuevo usuario en el sistema.
   * Solo un usuario con rol "Administrador" puede crear usuarios.
   * @param datos - Mapa con los datos del nuevo usuario.
   * @returns El ID del usuario creado.
   * @throws Error si la sesión no existe o el usuario no es administrador.
   */
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

  /**
   * Cierra la sesión de usuario correspondiente al ID de sesión.
   * @param idSesion - ID de la sesión a cerrar.
   * @returns True si la sesión se cerró correctamente.
   * @throws Error si la sesión no existe.
   */
  public CerrarSesion(idSesion: string): boolean {
    if(!GestorSesionUsuario.SesionesDeUsuario.delete(idSesion))
      throw new Error("No se puede cerrar sesión, ya que no existe la sesión.");
    return true;
  }
  
  /**
   * Verifica si una sesión está activa.
   * @param idSesion - ID de la sesión.
   * @returns True si la sesión está activa, false en caso contrario.
   */
  public static VerificarEstadoSesion(idSesion: string): boolean {
    return this.SesionesDeUsuario.has(idSesion);
  }

  /**
   * Recupera la contraseña de un usuario y la envía por correo electrónico.
   * Genera una nueva contraseña aleatoria, la cifra y la actualiza en la base de datos.
   * @param correoElectronico - Correo electrónico del usuario.
   * @throws Error si no se pudo cambiar la contraseña.
   */
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
  
  /**
   * Recupera la información general del usuario asociado a una sesión.
   * @param idSesion - ID de la sesión.
   * @returns Mapa con la información general del usuario.
   * @throws Error si la sesión no existe.
   */
  public static RecuperarInformaciónGeneral(idSesion: string): Map<string, string> {
    const sesion : SesionUsuario | undefined = GestorSesionUsuario.SesionesDeUsuario.get(idSesion);
    if(!sesion)
      throw new Error("No existe la sesión de usuario.");
    const usuario : Usuario = sesion.ObtenerUsuario();
    return usuario.RecuperarInformaciónGeneral();
  }

  /**
   * Trae la lista de roles de usuario disponibles en el sistema.
   * @returns Un arreglo de roles de usuario.
   */
  public async TraerUsuariosRoles() : Promise<RolUsuarioSQL[]> {
    return await this.ConexionSQL.TraerRoles();
  }

  /**
   * Cambia la contraseña de un usuario autenticado.
   * @param idSesion - ID de la sesión del usuario.
   * @param contrasenaActual - Contraseña actual del usuario.
   * @param contrasenaNueva - Nueva contraseña a establecer.
   * @returns True si la contraseña fue cambiada exitosamente.
   * @throws Error si la sesión no existe, las credenciales son incorrectas o la actualización falla.
   */
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