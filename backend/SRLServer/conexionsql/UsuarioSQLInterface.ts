/**
 * Interfaz que representa la información de un usuario obtenida desde la base de datos.
 * Incluye identificador, correo, nombre, apellidos, contraseña cifrada y rol.
 */
export default interface UsuarioSQL{
  /** Identificador único del usuario */
  idUsuario: number,
  /** Correo electrónico del usuario */
  correoElectronico: string,
  /** Nombre del usuario */
  nombre : string,
  /** Apellido paterno del usuario */
  apellidoPaterno : string,
  /** Apellido materno del usuario */
  apellidoMaterno : string,
  /** Contraseña cifrada actual del usuario */
  contrasenaActual : string,
  /** Nombre del rol asignado al usuario */
  nombreRol : string
}