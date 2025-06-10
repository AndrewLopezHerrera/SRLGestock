/**
 * Interfaz que representa la información general de una empresa.
 * Incluye datos de identificación, contacto y ubicación.
 */
interface Empresa{
  /** Identificador único de la empresa */
  IdEmpresa: number;
  /** Cédula jurídica o física de la empresa */
  Cedula: string;
  /** Nombre de la empresa */
  Nombre: string;
  /** Tipo de empresa (por ejemplo: S.A., S.R.L., etc.) */
  TipoEmpresa: string;
  /** Teléfono de contacto de la empresa */
  Telefono: string;
  /** Número de fax de la empresa */
  Fax: string;
  /** Correo electrónico de la empresa */
  Correo: string;
  /** Provincia donde se ubica la empresa */
  Provincia: string;
  /** Cantón donde se ubica la empresa */
  Canton: string;
  /** Distrito donde se ubica la empresa */
  Distrito: string;
  /** Señales o dirección exacta de la empresa */
  Senas: string;
}

export default Empresa;