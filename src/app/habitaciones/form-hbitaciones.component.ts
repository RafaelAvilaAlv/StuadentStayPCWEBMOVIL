import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Habitaciones } from './habitaciones';
import { HabitacionesService } from './habitaciones.service';

@Component({
  selector: 'app-form-hbitaciones',
  templateUrl: './form-hbitaciones.component.html',
  styleUrl: './form-hbitaciones.component.css'
})
export class FormHbitacionesComponent {

  previewImage: string | ArrayBuffer = '';
  public habitaciones: Habitaciones = new Habitaciones()
  public titulo: string = "Crear Habitacion"
  constructor(private habitacionService: HabitacionesService, private router1: Router, private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarhabitacion()
  }

  cargarhabitacion(): void {
    this.activateRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.habitacionService.getHabitacionesid(id).subscribe((habitacion) => this.habitaciones = habitacion);
        if (this.habitaciones.foto == '') {
          this.previewImage='';
        }else{
          this.previewImage= this.habitaciones.foto;
        }
      }
    })
  }

  public createHabitacion(): void {
    this.habitaciones.estado = 'Disponible';
    this.habitacionService.create(this.habitaciones).subscribe(
      habitacion => {
        this.router1.navigate(['/provedores'])
        Swal.fire('Habitacion guardado', `Habitacion ${habitacion.idHabitaciones} guardado con exito`, 'success')
      }
    )
  }



  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  convertToBase64(): void {
    if (this.previewImage) {
      const base64String = this.previewImage.toString();
      this.habitaciones.foto = base64String;
    }
  }



}
