import { Component } from '@angular/core';
import { Servicio } from './servicio';
import { ServicioService } from './servicio.service';
import { Router, ActivatedRoute } from '@angular/router';
import { response } from 'express';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl:'form.component.css'
})
export class FormComponent {

  public servicio: Servicio = new Servicio()
  public titulo: String = "CREAR SERVICIO"

  constructor(private servicioService: ServicioService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarServicios()
  }

  cargarServicios(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.servicioService.getServicioid(id).subscribe((servicio) => {
          // console.log(servicio);
          this.servicio = servicio;
        })
      }
    })
  }

  public create(): void {
    this.servicioService.create(this.servicio)
      .subscribe(servicio => {
        this.router.navigate(['/'])
        Swal.fire('Servicio guardado', `Servicio ${servicio.titulo} Guardado con exito`, 'success')
      }
      )
  }

  imagenSeleccionada: any;

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.previewImage = e.target.result;
    };

    reader.readAsDataURL(file);
  }
  previewImage: string | ArrayBuffer = '';
  convertfoto(): void {
    if (this.previewImage) {
      const base64String = this.previewImage.toString();
      //console.log(base64String);
      this.servicio.foto = base64String;
    }
  }
}