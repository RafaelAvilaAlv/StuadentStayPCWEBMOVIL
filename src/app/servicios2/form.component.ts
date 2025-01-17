import { Component } from '@angular/core';
import { Servicio } from '../servicios/servicio';
import { Servicios2 } from './servicios2';
import { ServicioService } from '../servicios/servicio.service';
import { Servicio2Service } from './servicio2.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Habitaciones } from '../habitaciones/habitaciones';
import { HabitacionesService } from '../habitaciones/habitaciones.service';
import { Console } from 'node:console';

@Component({
  selector: 'app-from',
  templateUrl: './form.component.html',
})
export class FormComponentServi {
  public servicio: Servicio = new Servicio()
  public servicio2: Servicios2 = new Servicios2()
  public habitacion: Habitaciones = new Habitaciones()
  public habitaciones: Habitaciones[] = [];
  public titulo: String = "Crear Servicio"

  constructor(private habitacionesService: HabitacionesService, private servicioService: ServicioService, private servicio2Service: Servicio2Service, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarServicios()
    this.cargarHabitaciones()
  }

  cargarServicios(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.servicioService.getServicioid(id).subscribe((servicio) => {
          //console.log(servicio);
          this.servicio = servicio;
        })
      }
    })
  }

  cargarHabitaciones(): void {
    this.habitacionesService.getHabitaciones().subscribe((habitaciones) => {
      this.habitaciones = habitaciones;
    });
  }

  public create(): void {
    this.servicio2.idHabitaciones = this.habitacion.idHabitaciones;
    this.servicio2.estado = 'Pendiente';
    this.servicio2.idTipo_servicio = this.servicio.idTipo_servicio
    this.servicio2Service.create(this.servicio2)
      .subscribe(servicio2 => {
        this.router.navigate(['/servicios'])
        Swal.fire('Servicio Solictado con exito', `Servicio ${servicio2.descripcion}`, 'success')
      }
      )
  }

}
