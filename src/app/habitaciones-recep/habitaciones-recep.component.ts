import { Component, OnInit } from '@angular/core';
import { Habitaciones } from '../habitaciones/habitaciones'; // Ajusta la ruta según tu estructura
import { HabitacionesService } from '../habitaciones/habitaciones.service';

@Component({
  selector: 'app-habitaciones-recep',
  templateUrl: './habitaciones-recep.component.html',
  styleUrls: ['./habitaciones-recep.component.css'] // Corregido: se usa "styleUrls" en lugar de "styleUrl"
})
export class HabitacionesRecepComponent implements OnInit {

  habitaciones: Habitaciones[] = [];
  currentRecepcionistaId: number = 0;

  constructor(private habitacionService: HabitacionesService) { }

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
    // Si tu servicio tiene un método para filtrar por recepcionista, úsalo:
    /*
    this.habitacionService.getHabitacionesByRecepcionista(this.currentRecepcionistaId)
      .subscribe(data => {
        this.habitaciones = data;
      });
    */

    // En caso contrario, se obtienen todas las habitaciones y se filtran en el cliente:
    this.habitacionService.getHabitaciones().subscribe(data => {
      this.habitaciones = data.filter(hab => hab.idRecepcionista === this.currentRecepcionistaId);
    });
  }
}