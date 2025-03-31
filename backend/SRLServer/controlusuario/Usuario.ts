import { compare } from "encriptadorContrasenas";


export default class Usuario {
  private IDUsuario: string;
  private CorreoElectrónico: string;
  private Nombre: string;
  private ApellidoPaterno: string;
  private ApellidoMaterno: string;
  private Contrasena: string;
  private Telefono: string;
  private Rol: string;
  private Provincia : string;
  private Canton : string;
  private Distrito : string;
  private Senas : string;

  constructor(
    ID: string, 
    correoElectronico: string, 
    nombre: string, 
    apellidoPaterno: string, 
    apellidoMaterno: string, 
    contrasena: string, 
    telefono: string, 
    rol: string,
    provincia : string,
    canton : string,
    distrito : string,
    senas : string) 
  {
    this.IDUsuario = ID;
    this.CorreoElectrónico = correoElectronico;
    this.Nombre = nombre;
    this.ApellidoPaterno = apellidoPaterno;
    this.ApellidoMaterno = apellidoMaterno;
    this.Contrasena = contrasena;
    this.Telefono = telefono;
    this.Rol = rol;
    this.Provincia = provincia;
    this.Canton = canton;
    this.Distrito = distrito;
    this.Senas = senas;
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
    informacionGeneral.set("telefono", this.Telefono);
    informacionGeneral.set("contrasenaActual", this.Contrasena);
    informacionGeneral.set("nombreRol", this.Rol);
    informacionGeneral.set("provincia", this.Provincia);
    informacionGeneral.set("canton", this.Canton);
    informacionGeneral.set("distrito", this.Distrito);
    informacionGeneral.set("senas", this.Senas);
    return informacionGeneral;
  }

  public ActualizarInformación(correoElectronico: string, nombre: string, apellidoPaterno: string,
    apellidoMaterno: string, telefono: string, rol: string, provincia : string, canton : string,
    distrito : string, senas : string) : void
  {
    this.CorreoElectrónico = correoElectronico;
    this.Nombre = nombre;
    this.ApellidoPaterno = apellidoPaterno;
    this.ApellidoMaterno = apellidoMaterno;
    this.Telefono = telefono;
    this.Rol = rol;
    this.Provincia = provincia;
    this.Canton = canton;
    this.Distrito = distrito;
    this.Senas = senas;
  }

  public ObtenerCorreoElectronico(){
    return this.CorreoElectrónico;
  }
}