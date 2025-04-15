import Usuario from "./Usuario.ts";

export default class SesionUsuario {
  private IDSesion: string;
  private IntentosInicioSesion: number;
  private UsuarioEnLinea : Usuario;
  private Sesiones : Map<string, SesionUsuario>;
  private MinSesionActiva : number;

  constructor(usuario : Usuario, sesiones : Map<string, SesionUsuario>) {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    this.IDSesion = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    this.IntentosInicioSesion = 0;
    this.UsuarioEnLinea = usuario;
    this.MinSesionActiva = 60;
    this.Sesiones = sesiones;
  }

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

  public ObtenerIDSesion(): string {
    return this.IDSesion;
  }

  public ObtenerUsuario(): Usuario {
    return this.UsuarioEnLinea;
  }

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

  private RestablecerIntentoInicioSesion(): void {
    setTimeout(() => {
      this.IntentosInicioSesion = 0;
    }, 900000);
  }
}