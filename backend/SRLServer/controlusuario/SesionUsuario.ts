import Usuario from "./Usuario.ts";

/**
 * Clase que representa una sesión de usuario en el sistema.
 * Permite gestionar el ciclo de vida de la sesión, intentos de inicio y expiración automática.
 */
export default class SesionUsuario {
  /** Identificador único de la sesión */
  private IDSesion: string;
  /** Número de intentos fallidos de inicio de sesión */
  private IntentosInicioSesion: number;
  /** Usuario asociado a la sesión */
  private UsuarioEnLinea : Usuario;
  /** Mapa global de sesiones activas */
  private Sesiones : Map<string, SesionUsuario>;
  /** Minutos restantes para que la sesión siga activa */
  private MinSesionActiva : number;

  /**
   * Crea una nueva sesión de usuario.
   * @param usuario - Usuario que inicia la sesión.
   * @param sesiones - Mapa global de sesiones activas.
   */
  constructor(usuario : Usuario, sesiones : Map<string, SesionUsuario>) {
    // Genera un ID de sesión aleatorio de 32 bytes en hexadecimal
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    this.IDSesion = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    this.IntentosInicioSesion = 0;
    this.UsuarioEnLinea = usuario;
    this.MinSesionActiva = 60; // 60 minutos por defecto
    this.Sesiones = sesiones;
  }

  /**
   * Intenta iniciar sesión con la contraseña proporcionada.
   * Si hay 5 intentos fallidos, bloquea la cuenta por 15 minutos.
   * @param contrasena - Contraseña ingresada por el usuario.
   * @returns El ID de la sesión si el inicio es exitoso.
   * @throws Error si las credenciales son incorrectas o la cuenta está bloqueada.
   */
  public async IniciarSesion(contrasena: string): Promise<string> {
    if(this.IntentosInicioSesion == 5){
      throw new Error("Cuenta bloqueada intente dentro de 15 minutos")
    }
    if(!await this.UsuarioEnLinea.CompararContrasena(contrasena)){
      this.IntentosInicioSesion++;
      if(this.IntentosInicioSesion == 5)
        this.RestablecerIntentoInicioSesion();
      throw new Error("Credenciales incorrectas.");
    }
    this.ProgramarEliminacionSesion();
    return this.IDSesion;
  }

  /**
   * Obtiene el identificador único de la sesión.
   * @returns ID de la sesión.
   */
  public ObtenerIDSesion(): string {
    return this.IDSesion;
  }

  /**
   * Obtiene el usuario asociado a la sesión.
   * @returns Instancia de Usuario en línea.
   */
  public ObtenerUsuario(): Usuario {
    return this.UsuarioEnLinea;
  }

  /**
   * Programa la eliminación automática de la sesión tras el tiempo de inactividad.
   * Disminuye el contador de minutos y elimina la sesión cuando llega a cero.
   * El intervalo está configurado para ejecutarse cada 8 horas (28800000 ms).
   * Nota: El decremento de minutos puede no ser preciso según el intervalo.
   * Este método es privado.
   */
  private ProgramarEliminacionSesion(): void {
    const eliminacionSesion = setInterval(() => {
      if(this.MinSesionActiva == 0){
        this.Sesiones.delete(this.IDSesion);
        clearInterval(eliminacionSesion);
      }
      else
        this.MinSesionActiva--;
    }, 28800000);
  }

  /**
   * Restablece el contador de intentos de inicio de sesión después de 15 minutos.
   * Este método es privado.
   */
  private RestablecerIntentoInicioSesion(): void {
    setTimeout(() => {
      this.IntentosInicioSesion = 0;
    }, 900000);
  }
}