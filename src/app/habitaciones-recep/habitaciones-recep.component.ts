import { Component, OnInit } from '@angular/core';
import { Habitaciones } from '../habitaciones/habitaciones'; // Ajusta la ruta según tu estructura
import { HabitacionesService } from '../habitaciones/habitaciones.service';
import Swal from 'sweetalert2'; // Importa SweetAlert2 si vas a usarlo

@Component({
  selector: 'app-habitaciones-recep',
  templateUrl: './habitaciones-recep.component.html',
  styleUrls: ['./habitaciones-recep.component.css'] // Corregido: se usa "styleUrls" en lugar de "styleUrl"
})
export class HabitacionesRecepComponent implements OnInit {

  habitaciones: Habitaciones[] = [];
  currentRecepcionistaId: number = 0;

  constructor(
    private habitacionService: HabitacionesService) { }

  ngOnInit(): void {
    // Suponiendo que el ID del recepcionista logueado se guarda en localStorage,
    // por ejemplo, al iniciar sesión se ejecuta: localStorage.setItem('recepcionistaId', id.toString());
    const id = localStorage.getItem('recepcionistaId');
    if (id) {
      this.currentRecepcionistaId = Number(id);
    } else {
      // En caso de no estar definido, se asigna un valor por defecto (ajusta según tus necesidades)
      this.currentRecepcionistaId = 1;
    }
    this.cargarHabitaciones();
  }

  cargarHabitaciones(): void {
    this.habitacionService.getHabitaciones().subscribe(data => {
      this.habitaciones = data.filter(hab => 
        hab.idRecepcionista === this.currentRecepcionistaId && hab.estado === 'Disponible'
      );
    });
  }
  

  aprobarHabitacion(habitacion: Habitaciones): void {
    habitacion.estado = 'Disponible';
    this.habitacionService.update(habitacion).subscribe(
      () => {
        Swal.fire('¡Aprobada!', 'La habitación ha sido aprobada.', 'success');
        this.cargarHabitaciones(); // Recargar habitaciones
      },
      (error) => {
        console.error('Error al aprobar la habitación', error);
        Swal.fire('Error', 'Hubo un problema al aprobar la habitación.', 'error');
      }
    );
  }
  
  rechazarHabitacion(habitacion: Habitaciones): void {
    habitacion.estado = 'Rechazado';
    this.habitacionService.update(habitacion).subscribe(
      () => {
        Swal.fire('¡Rechazada!', 'La habitación ha sido rechazada.', 'success');
        this.cargarHabitaciones(); // Recargar habitaciones
      },
      (error) => {
        console.error('Error al rechazar la habitación', error);
        Swal.fire('Error', 'Hubo un problema al rechazar la habitación.', 'error');
      }
    );
  }
  

  
}