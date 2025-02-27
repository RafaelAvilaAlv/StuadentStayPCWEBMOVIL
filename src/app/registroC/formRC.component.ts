import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroC } from './registroC';
import { RegistroCService } from './registroC.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formRC',
  templateUrl: './formRC.component.html',
  styleUrls: ['./registroC.component.css']
})
export class FormRCComponent implements OnInit {
  @Input() formRC!: FormGroup;
  public cedulaPersona: string = '';
  public registroC: RegistroC = new RegistroC();
  previewImage: string | ArrayBuffer = '';

  constructor(
    private fb: FormBuilder,
    private registroCService: RegistroCService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.route.params.subscribe(params => {
      this.cedulaPersona = params['cedula_persona'];
    });
  }

  buildForm(): void {
    this.formRC = this.fb.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required],
      foto: ['', Validators.required],
    });
  }

  registrarCliente(): void {
    if (this.formRC.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Campos requeridos',
        text: 'Por favor, complete todos los campos obligatorios antes de continuar.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    Swal.fire({
      title: 'Términos y Condiciones de Uso',
      html: `
        <div style="text-align: justify; max-height: 400px; overflow-y: auto; font-size: 14px; padding: 15px;">
          <p><strong>Estimado usuario,</strong></p>
          <p>Antes de continuar con su registro en <strong>Room4U</strong>, es imprescindible que lea y acepte los siguientes términos y condiciones. Su aceptación es obligatoria para el uso de nuestra plataforma.</p>

          <h3 style="font-size: 16px; font-weight: bold;">1. Objeto del Servicio</h3>
          <p>Room4U es una plataforma digital que facilita la gestión y reserva de hospedajes para estudiantes. El uso de la plataforma implica la aceptación de las normativas establecidas en este documento.</p>

          <h3 style="font-size: 16px; font-weight: bold;">2. Responsabilidad del Usuario</h3>
          <p>El usuario se compromete a proporcionar información veraz y actualizada, así como a utilizar la plataforma de manera responsable, respetando los derechos y condiciones establecidas.</p>

          <h3 style="font-size: 16px; font-weight: bold;">3. Política de Pagos y Reservas</h3>
          <p>Las reservas y pagos deben efectuarse exclusivamente a través de los medios habilitados en Room4U. No nos responsabilizamos por transacciones realizadas fuera de la plataforma.</p>

          <h3 style="font-size: 16px; font-weight: bold;">4. Protección de Datos</h3>
          <p>La información proporcionada por el usuario será tratada conforme a nuestra Política de Privacidad, garantizando su confidencialidad.</p>

          <h3 style="font-size: 16px; font-weight: bold;">5. Normas de Convivencia</h3>
          <p>El usuario acepta cumplir con las normas establecidas por los anfitriones. El incumplimiento de estas normas puede derivar en la restricción del acceso a la plataforma.</p>

          <p style="font-weight: bold; text-align: center; color: #d9534f;">Al seleccionar "Aceptar y Registrarme", usted confirma haber leído y aceptado los términos y condiciones expuestos.</p>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Aceptar y Registrarme',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0056b3',
      cancelButtonColor: '#6c757d',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        popup: 'custom-swal-width'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.registroC.cedula_persona = this.cedulaPersona;
        const usuario = this.formRC.get('usuario')?.value;
        const contrasena = this.formRC.get('contrasena')?.value;

        this.registroC.usuario = usuario;
        this.registroC.contrasena = contrasena;

        this.registroCService.registrarCliente(this.registroC).subscribe(
          () => {
            Swal.fire({
              icon: 'success',
              title: 'Registro exitoso',
              text: 'Su registro ha sido completado con éxito.',
              confirmButtonText: 'Aceptar',
              timer: 2000
            });

            this.registroCService.enviarCorreoConfirmacion(usuario);

            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000);
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error en el registro',
              text: 'Ha ocurrido un error al procesar su solicitud. Por favor, verifique los datos ingresados e intente nuevamente.',
              confirmButtonText: 'Aceptar'
            });
          }
        );
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Registro Cancelado',
          text: 'Debe aceptar los términos y condiciones para completar su registro.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
}



  selectFile(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.previewImage = e.target.result;
      this.registroC.foto = this.previewImage as string;
    };

    reader.readAsDataURL(file);
  }
}
