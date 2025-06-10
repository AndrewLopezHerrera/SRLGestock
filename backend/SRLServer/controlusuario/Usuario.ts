import { compare } from "encriptadorContrasenas";

/**
 * Clase que representa a un usuario del sistema.
 * Permite gestionar la información y autenticación del usuario.
 */
export default class Usuario {
  /** Identificador único del usuario */
  private IDUsuario: string;
  /** Correo electrónico del usuario */
  private CorreoElectrónico: string;
  /** Nombre del usuario */
  private Nombre: string;
  /** Apellido paterno del usuario */
  private ApellidoPaterno: string;
  /** Apellido materno del usuario */
  private ApellidoMaterno: string;
  /** Contraseña cifrada del usuario */
  private Contrasena: string;
  /** Rol asignado al usuario */
  private Rol: string;

  /**
   * Crea una instancia de Usuario.
   * @param ID - Identificador único del usuario.
   * @param correoElectronico - Correo electrónico del usuario.
   * @param nombre - Nombre del usuario.
   * @param apellidoPaterno - Apellido paterno del usuario.
   * @param apellidoMaterno - Apellido materno del usuario.
   * @param contrasena - Contraseña cifrada del usuario.
   * @param rol - Rol asignado al usuario.
   */
  constructor(
    ID: string, 
    correoElectronico: string, 
    nombre: string, 
    apellidoPaterno: string, 
    apellidoMaterno: string, 
    contrasena: string,
    rol: string
  ) 
  {
    this.IDUsuario = ID;
    this.CorreoElectrónico = correoElectronico;
    this.Nombre = nombre;
    this.ApellidoPaterno = apellidoPaterno;
    this.ApellidoMaterno = apellidoMaterno;
    this.Contrasena = contrasena;
    this.Rol = rol;
  }

  /**
   * Compara una contraseña ingresada con la contraseña almacenada.
   * @param contrasenaIngresada - Contraseña a comparar.
   * @returns True si la contraseña es correcta, false en caso contrario.
   */
  public async CompararContrasena(contrasenaIngresada: string) : Promise<boolean> {
    const esCorrecto = await compare(contrasenaIngresada, this.Contrasena);
    return esCorrecto;
  }

  /**
   * Recupera la información general del usuario en un Map.
   * @returns Map con los datos generales del usuario.
   */
  public RecuperarInformaciónGeneral() : Map<string, string> {
    const informacionGeneral : Map<string, string> = new Map<string, string>();
    informacionGeneral.set("idUsuario", this.IDUsuario);
    informacionGeneral.set("correoElectronico", this.CorreoElectrónico);
    informacionGeneral.set("nombre", this.Nombre);
    informacionGeneral.set("apellidoPaterno", this.ApellidoPaterno);
    informacionGeneral.set("apellidoMaterno", this.ApellidoMaterno);
    informacionGeneral.set("nombreRol", this.Rol);
    return informacionGeneral;
  }

  /**
   * Actualiza la información general del usuario.
   * @param correoElectronico - Nuevo correo electrónico.
   * @param nombre - Nuevo nombre.
   * @param apellidoPaterno - Nuevo apellido paterno.
   * @param apellidoMaterno - Nuevo apellido materno.
   * @param rol - Nuevo rol.
   */
  public ActualizarInformación(correoElectronico: string, nombre: string, apellidoPaterno: string,
    apellidoMaterno: string, rol: string) : void
  {
    this.CorreoElectrónico = correoElectronico;
    this.Nombre = nombre;
    this.ApellidoPaterno = apellidoPaterno;
    this.ApellidoMaterno = apellidoMaterno;
    this.Rol = rol;
  }

  /**
   * Obtiene el correo electrónico del usuario.
   * @returns Correo electrónico del usuario.
   */
  public ObtenerCorreoElectronico(){
    return this.CorreoElectrónico;
  }
}