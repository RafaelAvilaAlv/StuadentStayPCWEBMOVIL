import { Component, OnInit } from '@angular/core';
import { Servicio } from './servicio';
import { ServicioService } from './servicio.service';
import { HabitacionesService } from '../habitaciones/habitaciones.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public servicio: Servicio = new Servicio();
  public titulo: string = "CREAR SERVICIO";
  public habitaciones: any[] = [];  // Array para almacenar las habitaciones disponibles

  constructor(
    private servicioService: ServicioService,
    private habitacionesService: HabitacionesService, // Inyectamos el servicio de habitaciones
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarServicios();
    this.cargarHabitaciones();  // Cargamos las habitaciones al inicializar el componente
    console.log('Inicializando', this.servicio.nmHabitacion);
  }

  // Método para cargar los servicios existentes si se proporciona un ID
  cargarServicios(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.servicioService.getServicioid(id).subscribe((servicio) => {
          this.servicio = servicio;
        });
      }
    });
  }

  // Método para cargar las habitaciones disponibles
  cargarHabitaciones(): void {
    this.habitacionesService.getHabitaciones().subscribe(
      (habitaciones) => {
        this.habitaciones = habitaciones;  // Asigna las habitaciones obtenidas al array
        console.log(this.habitaciones);  // Puedes usar esto para verificar en la consola si las habitaciones se cargan correctamente
      },
      (error) => {
        console.error('Error al cargar las habitaciones', error);
      }
    );
  }

  // Método para manejar la selección de la habitación
  onHabitacionSeleccionada(event: any): void {
    const habitacionSeleccionada = this.habitaciones.find(
      h => h.idHabitaciones === +event.target.value
    );

    if (habitacionSeleccionada) {
      this.servicio.nmHabitacion = habitacionSeleccionada.nHabitacion;
     
      console.log('Habitación seleccionada:', this.servicio.nmHabitacion);
    }
  }

  // Método para crear un servicio
  public create(): void {
    if (this.servicio.nmHabitacion) {  // Verificamos que se haya seleccionado una habitación
      this.servicioService.create(this.servicio).subscribe(
        (servicio) => { 
          this.router.navigate(['/']);
          Swal.fire('Servicio guardado', `Servicio ${servicio.titulo} Guardado con éxito`, 'success');
        },
        (error) => {
          console.error('Error al guardar el servicio', error);
          Swal.fire('Error', 'Hubo un error al guardar el servicio', 'error');
        }
      );
    } else {
      Swal.fire('Seleccionar habitación', 'Por favor, selecciona una habitación', 'warning');
    }
  }

  // Función para manejar la imagen seleccionada
  imagenSeleccionada: any;

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      // Crear un elemento de imagen
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        // Crear un canvas para redimensionar la imagen
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Establecer las dimensiones del canvas (400x400)
        const width = 350;
        const height = 200;
        canvas.width = width;
        canvas.height = height;

        // Dibujar la imagen redimensionada en el canvas
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir el canvas a una cadena base64
        const base64Image = canvas.toDataURL('image/jpeg');

        // Establecer la vista previa de la imagen
        this.previewImage = base64Image;

        // Asignar la imagen redimensionada al objeto de servicio
        this.servicio.foto = base64Image;
      };
    };

    reader.readAsDataURL(file);
  }

  previewImage: string | ArrayBuffer = '';

  convertfoto(): void {
    if (this.previewImage) {
      const base64String = this.previewImage.toString();
      this.servicio.foto = base64String;
    }
  }
}
