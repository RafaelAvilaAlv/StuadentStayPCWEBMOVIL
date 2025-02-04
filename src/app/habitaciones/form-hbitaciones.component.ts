import { AfterViewInit, Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Habitaciones } from './habitaciones';
import { HabitacionesService } from './habitaciones.service';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Icon } from 'ol/style';
import { defaults as defaultControls, Zoom } from 'ol/control';
import { categorias } from './categorias';
import { CategoriasService } from '../categorias.service';
import { Recepcionista } from '../recepcionista/recepcionista';
import { RecepcionistaService } from '../recepcionista/recepcionista.service';

@Component({
  selector: 'app-form-hbitaciones',
  templateUrl: './form-hbitaciones.component.html',
  styleUrl: './form-hbitaciones.component.css'
})
export class FormHbitacionesComponent implements OnInit, AfterViewInit {
  map!: Map;
  previewImage: string | ArrayBuffer = '';
  public habitaciones: Habitaciones = new Habitaciones();
  public titulo: string = "Crear Habitación";
  categorias: categorias[] = [];
  recepcionistas: Recepcionista[] = [];
  recepcionistaSeleccionado: number | null = null;

  constructor(
    private habitacionService: HabitacionesService, 
    private recepcionistaService: RecepcionistaService,
    private router1: Router, 
    private activateRoute: ActivatedRoute,
    private categoriasService: CategoriasService,
    @Inject(PLATFORM_ID) private platformId: Object // Para detectar si estamos en el navegador
  ) {}

  ngOnInit(): void {
    this.cargarHabitacion();
    this.cargarCategorias();
    this.obtenerRecepcionistas();
  }

  obtenerRecepcionistas(): void {
    this.recepcionistaService.getRecepcionistas().subscribe(
      (dato) => {
        console.log('Recepcionistas obtenidos:', JSON.stringify(dato, null, 2));
        this.recepcionistas = dato;
      },
      (error) => {
        console.error('Error al obtener recepcionistas:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initMap();
    }
  }

  cargarHabitacion(): void {
    this.activateRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.habitacionService.getHabitacionesid(id).subscribe(
          (habitacion) => {
            this.habitaciones = habitacion;
            this.previewImage = this.habitaciones.foto || '';
          }
        );
      }
    });
  }

  public createHabitacion(): void {
    this.habitaciones.estado = 'Disponible';
    this.habitaciones.idRecepcionista = this.recepcionistaSeleccionado ?? 0;

    this.habitacionService.create(this.habitaciones).subscribe(
      habitacion => {
        this.router1.navigate(['/provedores']);
        Swal.fire('Habitación guardada', `Habitación ${habitacion.idHabitaciones} guardada con éxito`, 'success');
      },
      error => {
        console.error('Error al guardar la habitación:', error);
        Swal.fire('Error', 'No se pudo guardar la habitación', 'error');
      }
    );
  }

  cargarCategorias(): void {
    this.categoriasService.getCategorias().subscribe(data => {
      this.categorias = data;
    });
  }

  onCategoriaSelect(idCategoria: number): void {
    this.categoriasService.getCategoria(idCategoria).subscribe(categoria => {
      console.log('Categoría seleccionada:', categoria);
      this.habitaciones.idCategoria = categoria.idCategoria;
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  convertToBase64(): void {
    if (this.previewImage) {
      this.habitaciones.foto = this.previewImage.toString();
    }
  }

  private initMap(): void {
    if (!isPlatformBrowser(this.platformId)) return; // Evita la ejecución en el servidor

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([-79.0046, -2.9006]),
        zoom: 14,
      }),
      controls: [new Zoom()],
    });

    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({ source: vectorSource });

    this.map.addLayer(vectorLayer);
    this.map.on('click', (event) => {
      vectorSource.clear();
      const [lat, lon] = toLonLat(event.coordinate);
      const marker = new Feature({ geometry: new Point(event.coordinate) });

      marker.setStyle(
        new Style({
          image: new Icon({
            src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
            scale: 0.07,
          }),
        })
      );

      vectorSource.addFeature(marker);
      this.habitaciones.latitud = lon;
      this.habitaciones.longitud = lat;

      Swal.fire({
        title: 'Ubicación seleccionada',
        text: `Latitud: ${this.habitaciones.latitud}, Longitud: ${this.habitaciones.longitud}`,
        icon: 'info',
        confirmButtonText: 'Aceptar',
      });
    });
  }
}

