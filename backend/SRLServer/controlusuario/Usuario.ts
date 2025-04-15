import { compare } from "encriptadorContrasenas";


export default class Usuario {
  private IDUsuario: string;
  private CorreoElectrónico: string;
  private Nombre: string;
  private ApellidoPaterno: string;
  private ApellidoMaterno: string;
  private Contrasena: string;
  private Rol: string;

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

  public async CompararContrasena(contrasenaIngresada: string) : Promise<boolean> {
    const esCorrecto = await compare(contrasenaIngresada, this.Contrasena);
    return esCorrecto;
  }

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

  public ActualizarInformación(correoElectronico: string, nombre: string, apellidoPaterno: string,
    apellidoMaterno: string, rol: string) : void
  {
    this.CorreoElectrónico = correoElectronico;
    this.Nombre = nombre;
    this.ApellidoPaterno = apellidoPaterno;
    this.ApellidoMaterno = apellidoMaterno;
    this.Rol = rol;
  }

  public ObtenerCorreoElectronico(){
    return this.CorreoElectrónico;
  }
}