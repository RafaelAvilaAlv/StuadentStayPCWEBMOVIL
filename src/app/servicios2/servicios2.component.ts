import { Component, OnInit } from '@angular/core';
import { Servicio2Service } from './servicio2.service';
import { Servicios2 } from './servicios2';
import { ServicioService } from '../servicios/servicio.service';
import { Servicio } from '../servicios/servicio';
import { Habitaciones } from '../habitaciones/habitaciones';
import { HabitacionesService } from '../habitaciones/habitaciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-servicios2',
  templateUrl: './servicios2.component.html',
  styleUrl: './servicios2.component.css'
})
export class Servicios2Component implements OnInit {

  public servicios2: Servicios2[] = [];
  public tipoServicios: Servicio[] = [];
  public habitaciones: Habitaciones[] = [];

  constructor(
    private servicio2service: Servicio2Service,
    private tipoServicioService: ServicioService,
    private habitacionesService: HabitacionesService
  ) { }

  ngOnInit(): void {
    this.cargarServicios2();
    this.cargarTipoServicios();
    this.cargarHabitaciones();
  }

  cargarServicios2(): void {
    this.servicio2service.getServicios2().subscribe(
      (servicios2) => {
        this.servicios2 = servicios2;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  cargarTipoServicios(): void {
    this.tipoServicioService.getServicios().subscribe(
      (tipoServicios) => {
        this.tipoServicios = tipoServicios;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  cargarHabitaciones(): void {
    this.habitacionesService.getHabitaciones().subscribe(
      (habitaciones) => {
        this.habitaciones = habitaciones;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  obtenerTipoServicio(idTipoServicio: number): string {
    const tipoServicio = this.tipoServicios.find(tipo => tipo.idTipo_servicio === idTipoServicio);
    return tipoServicio ? tipoServicio.titulo : '';
  }

  obtenerNumeroHabitacion(idHabitacion: number): number {
    const habitacion = this.habitaciones.find(h => h.idHabitaciones === idHabitacion);
    return habitacion ? habitacion.nHabitacion : 0;
  }

  cambiarEstado(servicio: Servicios2): void {
    if (servicio.estado === 'Pendiente') {
      Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres actualizar el Estado del Servicio?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {

          servicio.estado = 'Realizado';
          this.servicio2service.actualizarEstado(servicio.idServicio, 'Realizado').subscribe(
            () => {
              Swal.fire('Servicio Finalizado', `Servicio ${servicio.idServicio} finalizado con exito`, 'success');
            },
            (error) => {
              Swal.fire('Error al Actualizar', `Servicio ${servicio.idServicio} finalizado con exito`, 'success');
            }
          );


        }
      });
    }
  }
}
