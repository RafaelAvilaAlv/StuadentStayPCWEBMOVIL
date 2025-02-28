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
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css']
})
export class HabitacionesComponent implements OnInit {
  habitaciones: Habitaciones[] = [];
  Categoria: categorias = new categorias();
  nomCat: any[] = [];
  estadisticas = {
    disponible: 0,
    noDisponible: 0,
    porcentajeDisponible: 0,
    porcentajeNoDisponible: 0
  };

  constructor(
    private habitacionesService: HabitacionesService,
    private elRef: ElementRef,
    private router: Router
  ) { }
  cargarMisHabitaciones(): void {
    this.router.navigate(['/habitaciones/habitacionesrece']);
}



  ngOnInit(): void {
   
    this.habitacionesService.getHabitaciones().subscribe(
      habitaciones => {
        const habitacionesDisponibles = habitaciones.filter(h => h.estado === 'Disponible');
        const habitacionesNoDisponibles = habitaciones.filter(h => h.estado !== 'Disponible');



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

            // Inicializar mapas
            setTimeout(() => {
              this.habitaciones.forEach(habitacion => {
                this.initMapForRoom(habitacion);
              });
            }, 0);
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

 



  // Inicializar mapa
  initMapForRoom(habitacion: Habitaciones): void {
    const mapElement = this.elRef.nativeElement.querySelector(`#map-${habitacion.idHabitaciones}`);
    if (!mapElement || habitacion.longitud == null || habitacion.latitud == null) {
      return;
    }

    const coordinates = fromLonLat([habitacion.longitud, habitacion.latitud]);

    const map = new Map({
      target: mapElement,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: coordinates,
        zoom: 18
      })
    });

    this.addMarkerToMap(map, habitacion);
  }

  addMarkerToMap(map: Map, habitacion: Habitaciones): void {
    if (habitacion.longitud == null || habitacion.latitud == null) {
      return;
    }

    const coordinates = fromLonLat([habitacion.longitud, habitacion.latitud]);

    const marker = new Feature({
      geometry: new Point(coordinates)
    });

    marker.setStyle(
      new Style({
        image: new Icon({
          src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          scale: 0.06,
        })
      })
    );

    const vectorSource = new VectorSource({
      features: [marker]
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    map.addLayer(vectorLayer);
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
  ///////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////
}
