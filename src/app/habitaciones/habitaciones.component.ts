import { Component, ElementRef, OnInit } from '@angular/core';
import { Habitaciones } from './habitaciones';
import Swal from 'sweetalert2';
import { HabitacionesService } from './habitaciones.service';
import { categorias } from './categorias';
import { forkJoin, map } from 'rxjs';

// Importamos las clases necesarias de OpenLayers
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

  constructor(private habitacionesService: HabitacionesService, private elRef: ElementRef) { }

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
        
            // Agregar marcadores en el mapa para cada habitación
            this.habitaciones.forEach(habitacion => {
              // Crear un nuevo mapa para cada habitación
              const mapElement = this.elRef.nativeElement.querySelector(`#map-${habitacion.idHabitaciones}`);
              const map = new Map({
                target: mapElement,
                layers: [
                  new TileLayer({
                    source: new OSM()
                  })
                ],
                view: new View({
                  center: [parseFloat(habitacion.longitud), parseFloat(habitacion.latitud)], // Coordenadas de la habitación
                  zoom: 12
                })
              });
              // Llamar al método para agregar el marcador al mapa
              this.addMarkerToMap(map, habitacion);
            });
          },
          error => {
            // Manejo de error al obtener habitaciones con categorías
          }
        );
      },
      error => {
        //console.error('Error al cargar habitaciones disponibles:', error);
      }
    );

    // Llamar a `initMapForRoom` para cada habitación
    this.habitaciones.forEach(habitacion => {
      this.initMapForRoom(habitacion);
    });
  }
  // Inicializar el mapa para cada habitación
  initMapForRoom(habitacion: Habitaciones): void {
    const mapElement = this.elRef.nativeElement.querySelector(`#map-${habitacion.idHabitaciones}`);
    const map = new Map({
      target: mapElement,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: [parseFloat(habitacion.longitud), parseFloat(habitacion.latitud)], // Coordenadas de la habitación
        zoom: 12
      })
    });

    this.addMarkerToMap(map, habitacion);
  }
  // Método para agregar un marcador en el mapa
  addMarkerToMap(map: Map, habitacion: Habitaciones): void {
    const marker = new Feature({
      geometry: new Point([parseFloat(habitacion.longitud), parseFloat(habitacion.latitud)])
    });

    marker.setStyle(new Style({
      image: new Icon({
        src: 'https://openlayers.org/en/latest/examples/data/icon.png', // Icono personalizado
        scale: 0.1
      })
    }));

    const vectorSource = new VectorSource({
      features: [marker]
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    map.addLayer(vectorLayer);
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
