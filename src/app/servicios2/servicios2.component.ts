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
  styleUrls: ['./servicios2.component.css']
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

  // Cargar los servicios2 desde el servicio
  cargarServicios2(): void {
    this.servicio2service.getServicios2().subscribe(
      (servicios2) => {
        this.servicios2 = servicios2;
      },
      (error) => {
        console.error('Error al cargar los servicios:', error);
      }
    );
  }

  // Cargar los tipos de servicios
  cargarTipoServicios(): void {
    this.tipoServicioService.getServicios().subscribe(
      (tipoServicios) => {
        this.tipoServicios = tipoServicios;
      },
      (error) => {
        console.error('Error al cargar los tipos de servicios:', error);
      }
    );
  }
  rechazarServicio(servicio: Servicios2): void {
    // Verificar si el estado del servicio es diferente de 'Rechazado'
    if (servicio.estado !== 'Rechazado') {
      Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Quieres rechazar el Servicio?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, rechazar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Cambiar el estado a 'Rechazado'
          servicio.estado = 'Rechazado';
  
          // Crear los datos a enviar con el estado actualizado
          const servicioData = {
            idServicio: servicio.idServicio,
            estado: servicio.estado,
            idTipo_servicio: servicio.idTipo_servicio, // ID del tipo de servicio
            descripcion: servicio.descripcion          // Descripción del servicio
          };
  
          // Llamar al servicio para actualizar el estado y guardar los cambios en el backend
          this.servicio2service.actualizarEstado(
            servicioData.idServicio,
            servicioData.estado,
            servicioData.idTipo_servicio,
            servicioData.descripcion
          ).subscribe(
            () => {
              // Notificar al usuario sobre la actualización exitosa
              Swal.fire('Servicio Rechazado', `Servicio ${servicio.idServicio} rechazado con éxito`, 'success');
            },
            (error) => {
              // Manejar el error si no se pudo actualizar el estado
              Swal.fire('Error al Rechazar', `No se pudo rechazar el servicio ${servicio.idServicio}`, 'error');
            }
          );
        }
      });
    } else {
      // Si el servicio ya está rechazado, mostrar un mensaje informando al usuario
      Swal.fire('Ya Rechazado', `El servicio ${servicio.idServicio} ya fue rechazado anteriormente.`, 'info');
    }
  }
  
  // Cargar las habitaciones
  cargarHabitaciones(): void {
    this.habitacionesService.getHabitaciones().subscribe(
      (habitaciones) => {
        this.habitaciones = habitaciones;
      },
      (error) => {
        console.error('Error al cargar las habitaciones:', error);
      }
    );
  }

  // Obtener el tipo de servicio por ID
  obtenerTipoServicio(idTipoServicio: number): string {
    const tipoServicio = this.tipoServicios.find(tipo => tipo.idTipo_servicio === idTipoServicio);
    return tipoServicio ? tipoServicio.titulo : '';
  }

  // Obtener el número de habitación por ID
  obtenerNumeroHabitacion(idHabitacion: number): number {
    const habitacion = this.habitaciones.find(h => h.idHabitaciones === idHabitacion);
    return habitacion ? habitacion.nHabitacion : 0;
  }

  // Cambiar el estado de un servicio y guardar idTipo_servicio y descripcion
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
          // Cambiar el estado a 'Realizado'
          servicio.estado = 'Realizado';
  
          // Guardar los datos de idTipo_servicio y descripcion junto con el estado
          const servicioData = {
            idServicio: servicio.idServicio,
            estado: servicio.estado,
            idTipo_servicio: servicio.idTipo_servicio,  // Pasar el idTipo_servicio
            descripcion: servicio.descripcion           // Pasar la descripcion
          };
  
          // Llamar al servicio para actualizar el estado y guardar la descripción y el tipo de servicio en el backend
          this.servicio2service.actualizarEstado(
            servicioData.idServicio,
            servicioData.estado,
            servicioData.idTipo_servicio,
            servicioData.descripcion
          ).subscribe(
            () => {
              // Notificar al usuario sobre la actualización exitosa
              Swal.fire('Servicio Finalizado', `Servicio ${servicio.idServicio} finalizado con éxito`, 'success');
            },
            (error) => {
              // Manejar el error si no se pudo actualizar el estado
              Swal.fire('Error al Actualizar', `No se pudo actualizar el servicio ${servicio.idServicio}`, 'error');
            }
          );
        }
      });
    }
  }
  
}
