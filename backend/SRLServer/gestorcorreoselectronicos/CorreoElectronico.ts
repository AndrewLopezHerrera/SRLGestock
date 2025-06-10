/**
 * Clase utilitaria para el envío de correos electrónicos desde el sistema.
 * Utiliza un servicio externo (Mailtrap) para enviar mensajes.
 */
class CorreoElectronico {

  /**
   * Envía un correo electrónico al destinatario especificado.
   * Si ocurre un error, lo registra en consola.
   * @param destino - Correo electrónico del destinatario.
   * @param asunto - Asunto del correo.
   * @param contenido - Contenido del mensaje.
   * @param categoria - Categoría del correo.
   */
  public static async EnviarCorreoElectronico(destino: string, asunto: string, contenido: string, categoria: string) : Promise<void> {
    try {
      await this.EnviarCorreoElectronicoAux(destino, asunto, contenido, categoria);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Error desconocido: Enviar contraseña de recuperación");
      }
    }
  }

  /**
   * Método auxiliar privado que realiza la petición HTTP para enviar el correo.
   * @param destino - Correo electrónico del destinatario.
   * @param asunto - Asunto del correo.
   * @param contenido - Contenido del mensaje.
   * @param categoria - Categoría del correo.
   */
  private static async EnviarCorreoElectronicoAux(destino: string, asunto: string, contenido: string, categoria: string) : Promise<void> {
    const datos : string = JSON.stringify({
      from: {
        email: "soporte@srltechnology.com",
        name: "Soporte SRL Techonology"
      },
      to: [
        {
          email: destino
        }
      ],
      subject: asunto,
      text: contenido,
      category: categoria
    });
    await fetch("https://sandbox.api.mailtrap.io/api/send/3571855", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 86a88fa4e8d6d6a22f70dd75876284f3",
        "Content-Type": "application/json",
      },
      body: datos,
    });
  }
}

export default CorreoElectronico;