import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroC } from './registroC';
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com';

@Injectable({
  providedIn: 'root',
})
export class RegistroCService {
  private urlEndPoint: string = "https://localhost:8080/api";

  constructor(private http: HttpClient) {}

  // Método para registrar un cliente
  registrarCliente(registroC: RegistroC): Observable<RegistroC> {
    return this.http.post<RegistroC>(this.urlEndPoint, registroC);
  }

  // Método para enviar un correo de confirmación utilizando EmailJS
  enviarCorreoConfirmacion(usuario: string): void {
    console.log('Llamando a enviarCorreoConfirmacion con usuario:', usuario); // Para verificar si llega aquí

    // Parametros del correo, donde 'usuario' es el correo del destinatario
    const templateParams = {
      to_email: usuario, // Correo del usuario
      from_name: 'Student Stay  ', // Nombre del remitente
      subject: 'Bienvenido a nuestro sistema', // Asunto del correo
      message: 'Gracias por registrarte en nuestro sistema. Estamos encantados de tenerte.', // Mensaje del correo
    };

    console.log('Parámetros del correo:', templateParams); // Para verificar los datos antes de enviar

    // Enviar correo a través de EmailJS
    emailjs
      .send('service_8vsnl8h', 'template_gxr4rif', templateParams, 'WtWTKSBxRgI_VgD2W')
      .then((response) => {
        console.log('Correo enviado con éxito:', response);
        Swal.fire('Éxito', 'El correo de confirmación ha sido enviado.', 'success');
      })
      .catch((error) => {
        console.error('Error al enviar correo:', error);
        Swal.fire('Error', `Ocurrió un error al enviar el correo: ${error.text}`, 'error');
      });
  }
}
