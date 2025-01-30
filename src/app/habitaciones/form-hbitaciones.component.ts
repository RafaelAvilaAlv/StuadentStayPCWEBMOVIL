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
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css'; // Estilos necesarios para OpenLayers

@Component({
  selector: 'app-form-hbitaciones',
  templateUrl: './form-hbitaciones.component.html',
  styleUrl: './form-hbitaciones.component.css'
})
export class FormHbitacionesComponent implements OnInit, AfterViewInit {
  map!: Map;
  previewImage: string | ArrayBuffer = '';
  public habitaciones: Habitaciones = new Habitaciones()
  public titulo: string = "Crear Habitacion"
  constructor(private habitacionService: HabitacionesService, private router1: Router, private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarhabitacion();

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
          this.previewImage='';
        }else{
          this.previewImage= this.habitaciones.foto;
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
        center: fromLonLat([-79.0046, -2.9006]), // Coordenadas de ejemplo, cámbialas si es necesario se las toma de google maps
        zoom: 14,
      }),
    });

    this.map.on('click', (event) => {
      // aqui es donde deben poner el metodo para guardar latitud y longitud en la base
      const [lon, lat] = this.map.getCoordinateFromPixel(event.pixel);
      alert(`Coordenadas seleccionadas: Latitud ${lat}, Longitud ${lon}`);
    });
  }
}
