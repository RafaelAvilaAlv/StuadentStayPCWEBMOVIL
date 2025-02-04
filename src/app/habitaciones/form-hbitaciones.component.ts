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
  styleUrl: './form-hbitaciones.component.css'
})
export class FormHbitacionesComponent implements OnInit, AfterViewInit {
  map!: Map;
  previewImage: string | ArrayBuffer = '';
  public habitaciones: Habitaciones = new Habitaciones()
  public titulo: string = "Crear Habitación"
  categorias: categorias[] = [];


  previewImage1: string | ArrayBuffer = '';
  previewImage2: string | ArrayBuffer = '';
  previewImage3: string | ArrayBuffer = '';


  recepcionistas: Recepcionista[] = []; // Lista de recepcionistas
  recepcionistaSeleccionado: number | null = null; // ID del recepcionista seleccionado
  //recepcionistaSeleccionado?: number; // Cambiado null por

  constructor(
    private habitacionService: HabitacionesService, 
    private recepcionistaService: RecepcionistaService,//servicio
    private router1: Router, 
    private activateRoute: ActivatedRoute,
    private categoriasService: CategoriasService,) { }

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
      let id = params['id']
      if (id) {
        this.habitacionService.getHabitacionesid(id).subscribe(
          (habitacion) => 
            this.habitaciones = habitacion);
        if (this.habitaciones.foto == '') {
          this.previewImage = '';

        } else {
          this.previewImage = this.habitaciones.foto;
        }
      }
    })
  }


  public createHabitacion(): void {
    
    this.habitaciones.estado = 'Disponible';
    
    this.habitaciones.idRecepcionista = this.recepcionistaSeleccionado || 0;


    
    this.habitacionService.create(this.habitaciones).subscribe(
      habitacion => {
        this.router1.navigate(['/provedores'])
        Swal.fire('Habitacion guardado', `Habitacion ${habitacion.idHabitaciones} guardado con exito`, 'success')
      },
      error => {
        console.error('Error al guardar la habitación:', error);
        Swal.fire('Error', 'No se pudo guardar la habitación', 'error');
      }
    )
  }
  

  cargarCategorias(): void {
    this.categoriasService.getCategorias().subscribe(data => {
      this.categorias = data;
    });
  }

  // Cuando seleccionas una categoría
  onCategoriaSelect(idCategoria: number): void {
    // Aquí, `idCategoria` es el ID de la categoría seleccionada
    this.categoriasService.getCategoria(idCategoria).subscribe(categoria => {
      console.log('Categoría seleccionada:', categoria);
      this.habitaciones.idCategoria = categoria.idCategoria; // Guardamos el idCategoria en habitaciones
      // Aquí puedes hacer lo que necesites con la categoría seleccionada.
    });
  }


  onFileSelected(event: any, field: string) {
    const file = event.target.files[0];
    
    if (!file) return; // Si no hay archivo seleccionado, salir.

    const reader = new FileReader();
    reader.onload = () => {
        const base64String = reader.result as string;
        
        switch (field) {
            case 'foto':
                this.habitaciones.foto = base64String;
                this.previewImage1 = base64String;
                break;
            case 'foto1':
                this.habitaciones.foto1 = base64String;
                this.previewImage2 = base64String;
                break;
            case 'foto2':
                this.habitaciones.foto2 = base64String;
                this.previewImage3 = base64String;
                break;
        }
    };
    reader.readAsDataURL(file);
}



  convertToBase64(): void {
    if (this.previewImage) {
      const base64String = this.previewImage.toString();
      this.habitaciones.foto = base64String;
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
        zoom: 14,
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
