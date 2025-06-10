import Conexion from "./conexionapi/Conexion.ts";

/**
 * Punto de entrada principal de la aplicación.
 * Inicializa la conexión y arranca el servidor HTTP.
 */
const conexion = new Conexion();
conexion.IniciarServidor();