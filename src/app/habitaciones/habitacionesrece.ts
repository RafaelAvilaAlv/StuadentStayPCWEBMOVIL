import { Component, OnInit } from '@angular/core';
import { HabitacionesService } from './habitaciones.service';

import { Habitaciones } from './habitaciones';


@Component({
  selector: 'app-habitacionesrece',
  templateUrl: './habitacionesrece.html',
  styleUrls: ['./habitacionesrece.css']
})
export class HabitacionesReceComponent implements OnInit {
  habitaciones: Habitaciones[] = [];

  constructor(private habitacionesService: HabitacionesService) {}

  ngOnInit(): void {
    const idRecepcionista = this.obtenerIdRecepcionista(); // Método para obtener ID
    console.log("ID Recepcionista:", idRecepcionista); // Verifica si obtiene el ID correctamente
    this.habitacionesService.getHabitaciones().subscribe(habitaciones => {
    console.log("Habitaciones antes de filtrar:", habitaciones);
    this.habitaciones = habitaciones;
});

  }

  obtenerIdRecepcionista(): number {
    return Number(localStorage.getItem('idRecepcionista')); // Ajusta según tu autenticación
  }
}
