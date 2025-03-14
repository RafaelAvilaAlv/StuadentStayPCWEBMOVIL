import { Component, ElementRef, OnInit } from '@angular/core';
import { Habitaciones } from './habitaciones';
import Swal from 'sweetalert2';
import { HabitacionesService } from './habitaciones.service';
import { categorias } from './categorias';
import { forkJoin, map } from 'rxjs';
import 'ol/ol.css';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { Map, View } from 'ol';
import { Icon } from 'ol/style';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { Router } from '@angular/router';

@Component({
  selector: 'app-habitaciones',
  templateUrl: './habitacionesrece.html',
  styleUrls: ['./habitaciones.component.css']
})
export class habitacionesrece implements OnInit {
  habitaciones: Habitaciones[] = [];
  Categoria: categorias = new categorias();
  nomCat: any[] = [];
  estadisticas = {
    disponible: 0,
    noDisponible: 0,
    porcentajeDisponible: 0,
    porcentajeNoDisponible: 0

  };
  mostrarFotos: boolean = false;
  formVisible = false; // Controla la visibilidad del formulario de revisión

  constructor(
    private habitacionesService: HabitacionesService,
    private elRef: ElementRef,
    private router: Router
  ) { }



  aprobarHabitacion(habitacion: Habitaciones): void {
    habitacion.estado = 'Disponible';  // Cambia el estado de la habitación a 'Disponible'

    // Llama al servicio para actualizar el estado en la base de datos
    this.habitacionesService.update(habitacion).subscribe(
      () => {
        Swal.fire('¡Aprobada!', 'La habitación ha sido aprobada y ahora está disponible.', 'success');
      },
      (error) => {
        console.error('Error al aprobar la habitación', error);
        Swal.fire('Error', 'Hubo un problema al aprobar la habitación.', 'error');
      }
    );
  }

  ngOnInit(): void {
    const idRecepcionista = this.obtenerIdRecepcionista(); // Método para obtener el ID del recepcionista actual
    this.habitacionesService.getHabitaciones().subscribe(
      habitaciones => {
        const habitacionesDisponibles = habitaciones.filter(h => h.estado === 'No Disponible');
        const habitacionesNoDisponibles = habitaciones.filter(h => h.estado !== 'No Disponible');

        // Filtrar habitaciones del recepcionista
        this.habitaciones = habitaciones.filter(h => h.idRecepcionista === idRecepcionista);

        // Estadísticas
        const totalHabitaciones = habitaciones.length;
        this.estadisticas.disponible = habitacionesDisponibles.length;
        this.estadisticas.noDisponible = habitacionesNoDisponibles.length;
        this.estadisticas.porcentajeDisponible = (this.estadisticas.disponible / totalHabitaciones) * 100;
        this.estadisticas.porcentajeNoDisponible = (this.estadisticas.noDisponible / totalHabitaciones) * 100;

        // Fetching categorías
        const observables = habitaciones.map(h => {
          return this.habitacionesService.getCategoria(h.idCategoria).pipe(
            map(categoria => ({
              habitacion: h,
              nombreCategoria: categoria.nombre
            }))
          );
        });

        forkJoin(observables).subscribe(
          resultados => {
            this.habitaciones = resultados.map(r => r.habitacion);
            this.nomCat = resultados.map(r => r.nombreCategoria);

        
          },
          error => {
            console.error('Error al cargar categorías:', error);
          }
        );
      },
      error => {
        console.error('Error al cargar habitaciones:', error);
      }
    );
  }

  // Método para obtener el ID del recepcionista desde el localStorage o sesión
  obtenerIdRecepcionista(): number {
    return Number(localStorage.getItem('usuario')); // Ajusta según cómo almacenes el usuario
  }

  rechazarHabitacion(habitacion: Habitaciones): void {
    habitacion.estado = 'Rechazado';  // Cambia el estado de la habitación a 'Rechazado'

    // Llama al servicio para actualizar el estado en la base de datos
    this.habitacionesService.update(habitacion).subscribe(
      () => {
        Swal.fire('¡Rechazada!', 'La habitación ha sido rechazada.', 'success');
      },
      (error) => {
        console.error('Error al rechazar la habitación', error);
        Swal.fire('Error', 'Hubo un problema al rechazar la habitación.', 'error');
      }
    );
  }

  
  delete(habitacion: Habitaciones): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar la habitación: ${habitacion.idCategoria}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.habitacionesService.delete(habitacion.idHabitaciones).subscribe(() => {
          this.habitaciones = this.habitaciones.filter(h => h.idHabitaciones !== habitacion.idHabitaciones);
          Swal.fire('Eliminado', `La habitación ${habitacion.idHabitaciones} ha sido eliminada con éxito`, 'success');
        });
      }
    });
  }

  buscarcategorias(id: any): void {
    this.habitacionesService.getCategoria(id).subscribe(
      categorias => (this.Categoria = categorias)
    );
  }

  getCircleStyle(porcentajeDisponible: number, porcentajeNoDisponible: number): string {
    const total = porcentajeDisponible + porcentajeNoDisponible;
    if (isNaN(porcentajeDisponible) || isNaN(porcentajeNoDisponible) || total === 0) {
      return 'linear-gradient(to right, #ddd 50%, #ddd 50%)';
    }
    return `linear-gradient(to right, green ${porcentajeDisponible}%, red ${porcentajeNoDisponible}%)`;
  }
}
