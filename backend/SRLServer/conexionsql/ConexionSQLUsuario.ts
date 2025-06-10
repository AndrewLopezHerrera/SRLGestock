import ClientePostgreSQL from "./ClientePostgreSQL.ts";
import RolUsuarioSQL from "./RolUsuarioSQLInterface.ts";
import UsuarioSQL from "./UsuarioSQLInterface.ts";

/**
 * Clase para gestionar operaciones de usuarios en la base de datos PostgreSQL.
 * Hereda de ClientePostgreSQL para reutilizar la conexión.
 */
export default class ConexionPostgreSQL extends ClientePostgreSQL {
  constructor() {
    super(); 
  }

  /**
   * Busca un usuario por su correo electrónico.
   * @param correoElectronico - Correo electrónico del usuario.
   * @returns Objeto UsuarioSQL con los datos encontrados.
   * @throws Error si no se encuentra el usuario.
   */
  public async BuscarUsuario(correoElectronico: string) : Promise<UsuarioSQL> {
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<UsuarioSQL>(
      "SELECT * FROM BuscarEmpleado($1)",
      [correoElectronico],
    );
    if(resultado.rows.length <= 0)
      throw new Error("No se ha encontrado el usuario.")
    return resultado.rows[0];
  }

  /**
   * Crea un nuevo usuario en la base de datos.
   * @param datos - Mapa con los datos del usuario.
   * @returns El ID del usuario creado.
   * @throws Error si el ID del rol no es válido.
   */
  public async CrearUsuario(datos: Map<string, string>): Promise<number> {
    const idRol : string | undefined = datos.get("idRol");
    if(!idRol)
      throw new Error("El ID del rol debe ser numérico");
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<{crearusuario: number}>(
      "SELECT * FROM CrearUsuario($1,$2,$3,$4,$5,$6)",
      [datos.get("correoElectronico"),
      datos.get("nombre"),
      datos.get("apellidoPaterno"),
      datos.get("apellidoMaterno"),
      datos.get("contrasenaActual"),
      parseInt(idRol)]
    );
    const numero : { crearusuario: number } = resultado.rows[0];
    return numero?.crearusuario;
  }

  /**
   * Cambia la contraseña de un usuario.
   * @param correoElectronico - Correo electrónico del usuario.
   * @param nuevaContrasena - Nueva contraseña cifrada.
   * @returns 1 si la contraseña fue cambiada correctamente.
   * @throws Error si no se pudo cambiar la contraseña.
   */
  public async CambiarContrasena(correoElectronico: string, nuevaContrasena: string): Promise<number> {
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<{cambiarcontrasena: number }>(
      "SELECT * FROM CambiarContrasena($1,$2)",
      [correoElectronico,
      nuevaContrasena],
    );
    if(resultado.rows.length <= 0)
      throw new Error("No se ha podido cambiar la contrasena.")
    const numero : { cambiarcontrasena: number } = resultado.rows[0];
    return numero?.cambiarcontrasena;
  }

  /**
   * Actualiza los datos generales de un usuario.
   * @param datos - Mapa con los datos actualizados del usuario.
   * @returns 1 si la actualización fue exitosa.
   * @throws Error si no se pudieron actualizar los datos.
   */
  public async ActualizarDatos(datos: Map<string, string>) : Promise<number> {
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<number>(
      "SELECT * FROM ActualizarDatos($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
      [datos.get("idUsuario"),
      datos.get("correoElectronico"),
      datos.get("nombre"),
      datos.get("apellidoPaterno"),
      datos.get("apellidoMaterno"),
      datos.get("telefono"),
      datos.get("provincia"),
      datos.get("canton"),
      datos.get("distrito"),
      datos.get("senas")]
    );
    if(resultado.rows.length <= 0)
      throw new Error("No se han podido actualizar los datos.")
    return resultado.rows[0];
  }

  /**
   * Recupera la lista de roles de usuario disponibles en el sistema.
   * @returns Un arreglo de roles de usuario.
   * @throws Error si no se pudieron recuperar los roles.
   */
  public async TraerRoles(): Promise<RolUsuarioSQL[]> {
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<RolUsuarioSQL>(
      "SELECT * FROM TraerRolesActuales()",
      [],
    );
    if(resultado.rows.length <= 0)
      throw new Error("No se han podido recuperar los roles.")
    return resultado.rows;
  }
}

