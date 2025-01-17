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
  constructor(private habitacionesService: HabitacionesService) { }

  ngOnInit(): void {
    this.habitacionesService.getHabitaciones().subscribe(
      habitaciones => {
        const habitacionesDisponibles = habitaciones.filter(habitacion => habitacion.estado === 'Disponible');

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



  delete(habitaciones: Habitaciones): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar al la habitacion:  ${habitaciones.idCategoria}?`,
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
                Swal.fire('Habitacion eliminado', `Habitacion ${habitaciones.idHabitaciones} eliminado con éxito`, 'success');
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



}
