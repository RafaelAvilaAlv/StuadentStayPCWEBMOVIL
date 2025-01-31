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

  constructor(private habitacionService: HabitacionesService, private router1: Router, private activateRoute: ActivatedRoute,private categoriasService: CategoriasService,) { }

  ngOnInit(): void {
    this.cargarhabitacion();
    this.cargarCategorias();
   
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  cargarhabitacion(): void {
    this.activateRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.habitacionService.getHabitacionesid(id).subscribe((habitacion) => this.habitaciones = habitacion);
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
    this.habitacionService.create(this.habitaciones).subscribe(
      habitacion => {
        this.router1.navigate(['/provedores'])
        Swal.fire('Habitacion guardado', `Habitacion ${habitacion.idHabitaciones} guardado con exito`, 'success')
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
