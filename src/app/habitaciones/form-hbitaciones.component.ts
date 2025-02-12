import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
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
import { Recepcionista } from '../recepcionista/recepcionista'; // Importa el modelo de recepcionista
import { RecepcionistaService } from '../recepcionista/recepcionista.service'; // Importa el servicio de recepcionista

@Component({
  selector: 'app-form-hbitaciones',
  templateUrl: './form-hbitaciones.component.html',
  styleUrls: ['./form-hbitaciones.component.css']
})
export class FormHbitacionesComponent implements OnInit, AfterViewInit {
  map!: Map;
  previewImage: string | ArrayBuffer = '';
  public habitaciones: Habitaciones = new Habitaciones();
  public titulo: string = "Crear Habitación";
  categorias: categorias[] = [];

  previewImage1: string | ArrayBuffer | null = null;
  previewImage2: string | ArrayBuffer | null = null;
  previewImage3: string | ArrayBuffer | null = null;
  

  recepcionistas: Recepcionista[] = []; // Lista de recepcionistas
  recepcionistaSeleccionado: number | null = null; // ID del recepcionista seleccionado

  constructor(
    private habitacionService: HabitacionesService, 
    private recepcionistaService: RecepcionistaService, // Servicio
    private router1: Router, 
    private activateRoute: ActivatedRoute,
    private categoriasService: CategoriasService
  ) { }

  ngOnInit(): void {
    this.cargarhabitacion();
    this.cargarCategorias();
    this.obtenerRecepcionistas();
  }

  obtenerRecepcionistas(): void {
    this.recepcionistaService.getRecepcionistas().subscribe(
      (dato) => {
        console.log('Recepcionistas obtenidos:', dato); // Verifica los datos en consola
        this.recepcionistas = dato;
      },
      (error) => {
        console.error('Error al obtener recepcionistas:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  cargarhabitacion(): void {
    this.activateRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.habitacionService.getHabitacionesid(id).subscribe(
          (habitacion) => this.habitaciones = habitacion
        );
        if (this.habitaciones.foto == '') {
          this.previewImage = '';
        } else {
          this.previewImage = this.habitaciones.foto;
        }
      }
    });
  }

  public createHabitacion(): void {
    this.habitaciones.estado = 'No Disponible';
    this.habitaciones.idRecepcionista = this.recepcionistaSeleccionado || 0;

    this.habitacionService.create(this.habitaciones).subscribe(
      habitacion => {
        this.router1.navigate(['/provedores']);
        Swal.fire('Habitacion guardada', `Habitacion ${habitacion.idHabitaciones} guardada con exito`, 'success');
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

  // Cuando seleccionas una categoría
  onCategoriaSelect(idCategoria: number): void {
    this.categoriasService.getCategoria(idCategoria).subscribe(categoria => {
      console.log('Categoría seleccionada:', categoria);
      this.habitaciones.idCategoria = categoria.idCategoria; // Guardamos el idCategoria en habitaciones
    });
  }

  // Función para redimensionar la imagen a 350x200 y convertirla a Base64
  resizeAndConvertImage(file: File, width: number, height: number): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event: any) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);
                const base64String = canvas.toDataURL(file.type); // Obtener la cadena base64
                resolve(base64String);
            };
            img.onerror = reject;
            img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file); // Leer el archivo como URL de datos
    });
}

  convertToBase64(): void {
    console.log('Converting images to base64...');

    // Verifica si las imágenes de vista previa están definidas
    if (this.previewImage1) {
      this.habitaciones.foto = this.previewImage1.toString();
    }

    if (this.previewImage2) {
      this.habitaciones.foto1 = this.previewImage2.toString();
    }

    if (this.previewImage3) {
      this.habitaciones.foto2 = this.previewImage3.toString();
    }

    console.log('Fotos convertidas a base64 y asignadas:', this.habitaciones);
  }

  // Maneja el evento de selección de archivo y redimensiona la imagen
  onFileSelected(event: any, field: string): void {
    const file = event.target.files[0];
    
    if (file) {
        // Llamada a la función de redimensionamiento y conversión a base64
        this.resizeAndConvertImage(file, 350, 200).then((base64String) => {
            switch (field) {
                case 'foto':
                    this.habitaciones.foto = base64String;
                    this.previewImage1 = base64String; // Asignamos la imagen al campo
                    break;
                case 'foto1':
                    this.habitaciones.foto1 = base64String;
                    this.previewImage2 = base64String; // Asignamos la imagen al campo
                    break;
                case 'foto2':
                    this.habitaciones.foto2 = base64String;
                    this.previewImage3 = base64String; // Asignamos la imagen al campo
                    break;
            }
        }).catch(error => {
            console.error('Error al redimensionar la imagen:', error);
        });
    }
}
  

  private initMap(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([-79.0046, -2.9006]),
        zoom: 17,
      }),
      controls: [
        new Zoom(),
      ],
    });
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    this.map.addLayer(vectorLayer);
    this.map.on('click', (event) => {
      vectorSource.clear();
      const [lat, lon] = toLonLat(event.coordinate);
      const marker = new Feature({
        geometry: new Point(event.coordinate),
      });
      marker.setStyle(
        new Style({
          image: new Icon({
            src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Icono personalizado
            scale: 0.07, // Ajustar el tamaño
          }),
        })
      );
      vectorSource.addFeature(marker);
      // Muestra las coordenadas en los campos de entrada
      this.habitaciones.latitud = lon;  // Redondeamos para mayor precisión
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
