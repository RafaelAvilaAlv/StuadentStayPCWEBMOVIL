import { Component, OnInit } from '@angular/core';
import { Habitaciones } from './habitaciones';
import Swal from 'sweetalert2';
import { HabitacionesService } from './habitaciones.service';
import { categorias } from './categorias';
import { Observable, forkJoin, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-habitaciones',
  templateUrl: './habitaciones.component.html',
  styleUrl: './habitaciones.component.css'
})
export class HabitacionesComponent implements OnInit {
  habitaciones: Habitaciones[] = [];
  Categoria: categorias = new categorias();
  nomCat: any[] = [];

  // Propiedad para las estadísticas
  estadisticas = {
    disponible: 0,
    noDisponible: 0,
    porcentajeDisponible: 0,
    porcentajeNoDisponible: 0
  };

  constructor(private habitacionesService: HabitacionesService) { }

  ngOnInit(): void {
    this.habitacionesService.getHabitaciones().subscribe(
      habitaciones => {
        // Filtramos las habitaciones disponibles
        const habitacionesDisponibles = habitaciones.filter(habitacion => habitacion.estado === 'Disponible');
        const habitacionesNoDisponibles = habitaciones.filter(habitacion => habitacion.estado !== 'Disponible');

        // Calculamos los porcentajes
        const totalHabitaciones = habitaciones.length;
        this.estadisticas.disponible = habitacionesDisponibles.length;
        this.estadisticas.noDisponible = habitacionesNoDisponibles.length;

        this.estadisticas.porcentajeDisponible = (this.estadisticas.disponible / totalHabitaciones) * 100;
        this.estadisticas.porcentajeNoDisponible = (this.estadisticas.noDisponible / totalHabitaciones) * 100;

        // Fetching categorias
        const observables = habitacionesDisponibles.map(habitacion => {
          return this.habitacionesService.getCategoria(habitacion.idCategoria).pipe(
            map(categoria => ({
              habitacion: habitacion,
              nombreCategoria: categoria.nombre
            }))
          );
        });

        forkJoin(observables).subscribe(
          resultados => {
            this.habitaciones = resultados.map(resultado => resultado.habitacion);
            this.nomCat = resultados.map(resultado => resultado.nombreCategoria);
          },
          error => {
            //console.error('Error al cargar habitaciones con categorías:', error);
          }
        );
      },
      error => {
        //console.error('Error al cargar habitaciones disponibles:', error);
      }
    );
  }

  // Método para eliminar habitaciones
  delete(habitaciones: Habitaciones): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar la habitación:  ${habitaciones.idCategoria}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.habitacionesService.delete(habitaciones.idHabitaciones).subscribe(
          () => {
            this.habitacionesService.getHabitaciones().subscribe(
              (habitacion) => {
                this.habitaciones = habitacion;
                Swal.fire('Habitación eliminada', `Habitación ${habitaciones.idHabitaciones} eliminada con éxito`, 'success');
              },
            );
          },
        );
      }
    });
  }

  buscarcategorias(id: any) {
    this.habitacionesService.getCategoria(id).subscribe(
      (categorias) => this.Categoria = categorias
    );
  }
  getCircleStyle(porcentajeDisponible: number, porcentajeNoDisponible: number): string {
    // Validamos que los porcentajes estén definidos y sean números
    const total = porcentajeDisponible + porcentajeNoDisponible;
    if (isNaN(porcentajeDisponible) || isNaN(porcentajeNoDisponible) || total === 0) {
      return 'linear-gradient(to right, #ddd 50%, #ddd 50%)'; // Fondo gris si no hay datos
    }
    // De lo contrario, generamos el gradiente con los valores
    return `linear-gradient(to right, green ${porcentajeDisponible}%, red ${porcentajeNoDisponible}%)`;
  }
  
}
