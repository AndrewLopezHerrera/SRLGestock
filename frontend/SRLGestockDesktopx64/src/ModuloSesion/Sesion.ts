class InfoSesion {
  private static IdSesion : string;
  private static NombreUsuario : string;
  private static PrimerApellidoUsuario : string;
  private static RolUsuario: string;
  private static readonly IPBackend : string = "https://srlgestock.space:8080";

  public static IniciarSesion(idSesion : string, nombreUsuario : string,
    primerApellidoUsuario : string, rolUsuario: string) : void {
      InfoSesion.IdSesion = idSesion;
      InfoSesion.NombreUsuario = nombreUsuario;
      InfoSesion.PrimerApellidoUsuario = primerApellidoUsuario;
      InfoSesion.RolUsuario = rolUsuario;
  }

  public static CerrarSesion() : void {
    InfoSesion.IdSesion = "";
    InfoSesion.NombreUsuario = "";
    InfoSesion.PrimerApellidoUsuario = "";
  }

  public static ObtenerIdSesion() : string {
    return InfoSesion.IdSesion;
  }

  public static ObtenerNombreUsuario() : string {
    return InfoSesion.NombreUsuario;
  }
  public static ObtenerPrimerApellidoUsuario() : string {
    return InfoSesion.PrimerApellidoUsuario;
  }

  public static ObtenerIPBackend() : string {
    return InfoSesion.IPBackend;
  }

  public static ObtenerRolUsuario() : string {
    return InfoSesion.RolUsuario;
  }
}

export default InfoSesion;