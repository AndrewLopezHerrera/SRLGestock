import ClientePostgreSQL from "./ClientePostgreSQL.ts";
import RolUsuarioSQL from "./RolUsuarioSQLInterface.ts";
import UsuarioSQL from "./UsuarioSQLInterface.ts";

export default class ConexionPostgreSQL extends ClientePostgreSQL {
  constructor() {
    super(); 
  }

  public async BuscarUsuario(correoElectronico: string) : Promise<UsuarioSQL> {
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<UsuarioSQL>(
      "SELECT * FROM BuscarEmpleado($1)",
      [correoElectronico],
    );
    if(resultado.rows.length <= 0)
      throw new Error("No se ha encontrado el usuario.")
    return resultado.rows[0];
  }

  public async CrearUsuario(datos: Map<string, string>): Promise<number> {
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<number>(
      "SELECT * FROM CrearUsuario($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
      [datos.get("correoElectronico"),
      datos.get("nombre"),
      datos.get("apellidoPaterno"),
      datos.get("apellidoMaterno"),
      datos.get("telefono"),
      datos.get("contrasenaActual"),
      parseInt(String(datos.get("idRol"))),
      datos.get("provincia"),
      datos.get("canton"),
      datos.get("distrito"),
      datos.get("senas")]
    );
    return resultado.rows[0];
  }

  public async CambiarContrasena(correoElectronico: string, nuevaContrasena: string): Promise<number> {
    const resultado = await ClientePostgreSQL.ObtenerClienteSQL().queryObject<number>(
      "SELECT * FROM CambiarContrasena($1,$2)",
      [correoElectronico,
      nuevaContrasena],
    );
    if(resultado.rows.length <= 0)
      throw new Error("No se ha podido cambiar la contrasena.")
    return resultado.rows[0];
  }

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

