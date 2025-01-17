
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroC } from './registroC';
import { RegistroCService } from './registroC.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formRC',
  templateUrl: './formRC.component.html',
  styleUrl: './registroC.component.css'
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
        text: 'Por favor, complete todos los campos obligatorios.',
        showConfirmButton: true
      });
      return;
    }

    this.registroC.cedula_persona = this.cedulaPersona;
    const usuario = this.formRC.get('usuario')?.value;
    const contrasena = this.formRC.get('contrasena')?.value;

    this.registroC.usuario = usuario;
    this.registroC.contrasena = contrasena;
    this.registroC.cedula_persona = this.cedulaPersona;

    this.registroCService.registrarCliente(this.registroC).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: '¡Bienvenido a EzHotel!',
          showConfirmButton: false,
          timer: 2000
        });

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      (error) => {
        // console.error('Error al registrar sus datos:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al intentar registrar los datos. Por favor, verifique que todos los datos sean válidos y que todos los campos estén llenos.',
          showConfirmButton: true
        });
      }
    );
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

  imagenPreview(event: any): void {
    const file: File =
      event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imagenPreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

}
