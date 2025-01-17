 // panel-recepcion.component.ts

import { Component, OnInit } from '@angular/core';
import { ServicioComunicacionService } from '../servicio-comunicacion.service';
import { ServicioRecepcion } from './servicio-recepcion.service';
import Swal from 'sweetalert2';
import { Recepcionista } from '../recepcionista/recepcionista';
import { RecepcionistaService } from '../recepcionista/recepcionista.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel-recepcion',
  templateUrl: './panel-recepcion.component.html',
  styleUrls: ['./panel-recepcion.component.css']
})
export class PanelRecepcionComponent implements OnInit {

  habitaciones: any[] = [];
  public recepcionistas: Recepcionista[] = [];
  opcionSeleccionada: string = '';
  idABuscar: number = 0;
  mostrarTabla: boolean = false;
  entidadSeleccionada: string = 'habitaciones';
  
  public loading: boolean = false;
  mostrarTablaHabitaciones: boolean = false;
  mostrarTablaRecepcionistas: boolean = false;

  constructor(
    private servicioComunicacion: ServicioComunicacionService,
    private servicioRecepcion: ServicioRecepcion,
    
    private recepcionistaService: RecepcionistaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.servicioComunicacion.actualizarPanel$.subscribe(() => {
      console.log('Se recibió una notificación de actualización en Panel Recepción');
      this.mostrarHabitaciones();
      this.cargarRecepcionistas();
      this.cargarDatosSegunRuta();
      this.cargarInformacion();
    });
  }

  eliminarRecepcionista(idRecepcionista: number): void {
    if (idRecepcionista === undefined || idRecepcionista === null) {
      console.error('ID del recepcionista no definido');
      return;
    }
  
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
  
    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro?',
      text: 'No se puede revertir',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonAriaLabel: 'Sí, borrar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.recepcionistaService.eliminarRecepcionista(idRecepcionista).subscribe(
          () => {
            console.log('Recepcionista eliminado con éxito');
            swalWithBootstrapButtons.fire({
              title: 'Borrado',
              text: 'El recepcionista fue borrado con éxito',
              icon: 'success',
            });
            this.cargarRecepcionistas();
          },
          (error) => {
            console.error('Error al eliminar el recepcionista', error);
            swalWithBootstrapButtons.fire({
              title: 'Error',
              text: 'Ha ocurrido un error al eliminar el recepcionista',
              icon: 'error',
            });
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: 'Cancelado',
          text: 'Has cancelado la operación',
          icon: 'error',
        });
      }
    });
  }
  

 
  editarRecepcionista(recepcionista: any): void {
    // Aquí puedes implementar la lógica para la edición del recepcionista
    console.log('Editar recepcionista:', recepcionista);
    // Puedes redirigir a la página de edición o mostrar un modal, según tus necesidades.
    // Por ejemplo, podrías navegar a la página de edición con el ID del recepcionista
    this.router.navigate(['/recepcionistas/editar', recepcionista.id_recepcionista]);
  }

  cargarRecepcionistas(): void {
    this.recepcionistaService.getRecepcionistas().subscribe(
      recepcionistas1 => {
        console.log('Datos de recepcionistas:', recepcionistas1);
        this.recepcionistas = recepcionistas1;
        this.mostrarTablaRecepcionistas = true;
      },
      error => {
        console.error('Error al obtener recepcionistas:', error);
        // Agrega aquí el manejo de errores (mensaje al usuario, registro, etc.).
      }
    );
  }

  cargarDatosSegunRuta() {
    const rutaActual = this.route.snapshot.routeConfig?.path;
  
    if (rutaActual === 'panel-recepcion') {
      this.mostrarTablaHabitaciones = false;
      this.mostrarTablaRecepcionistas = true;
      ////this.mostrarCreacionRecepcionista = false; // Asegúrate de ocultar la sección de creación
    } else if (rutaActual === 'panel-recepcion/recepcionistas') {
      this.mostrarTablaHabitaciones = false;
      this.mostrarTablaRecepcionistas = true;
      ///this.mostrarCreacionRecepcionista = false; // Asegúrate de ocultar la sección de creación
    }
  }

  mostrarHabitaciones(): void {
    this.servicioRecepcion.getHabitaciones().subscribe(
      habitaciones => {
        console.log('Datos de habitaciones:', habitaciones);
        this.habitaciones = habitaciones;
        this.opcionSeleccionada = 'Habitaciones';
        this.mostrarTablaHabitaciones = true;
      },
      error => {
        console.error('Error al obtener habitaciones:', error);
      }
    );
  }

  eliminarHabitacion(id: number): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro?',
      text: 'No se puede revertir',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonAriaLabel: 'Sí, borrar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioRecepcion.eliminarHabitacion(id).subscribe(
          () => {
            console.log('Habitación eliminada con éxito');
            swalWithBootstrapButtons.fire({
              title: 'Borrado',
              text: 'La habitación fue borrada con éxito',
              icon: 'success',
            });
            this.cargarInformacion();
          },
          (error) => {
            console.error('Error al eliminar la habitación', error);
            swalWithBootstrapButtons.fire({
              title: 'Error',
              text: 'Ha ocurrido un error al eliminar la habitación',
              icon: 'error',
            });
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: 'Cancelado',
          text: 'Has cancelado la operación',
          icon: 'error',
        });
      }
    });
  }

  cargarInformacion(): void {
    // Iniciar la carga
    this.loading = true;

    // Mostrar la animación durante 3 segundos
    setTimeout(() => {
      // Simula la carga de datos
      this.servicioRecepcion.getHabitaciones().subscribe(
        habitaciones => {
          console.log('Datos de habitaciones:', habitaciones);
          this.habitaciones = habitaciones;
          this.opcionSeleccionada = 'Habitaciones';
          this.mostrarTabla = true;
        },
        error => {
          console.error('Error al obtener habitaciones:', error);
        }
      ).add(() => {
        // Finalizar la carga, ya sea que haya tenido éxito o haya ocurrido un error
        this.loading = false;
      });
    }, 1000); // 3000 milisegundos = 3 segundos
  }

  buscarPorId(): void {
    if (this.idABuscar) {
      this.servicioRecepcion.getHabitacionById(this.idABuscar).subscribe(
        (habitacion) => {
          if (habitacion) {
            this.habitaciones = [habitacion];
            console.log('Habitación encontrada por ID:', habitacion);
          } else {
            console.log('No se encontró ninguna habitación con ese ID.');
            this.habitaciones = [];
          }
        },
        (error) => {
          console.error('Error al buscar habitación por ID:', error);
        }
      );
    } else {
      console.warn('Ingrese un ID antes de buscar.');
    }
  }

  buscarEnTiempoReal(): void {
    if (this.idABuscar) {
      if (this.entidadSeleccionada === 'habitaciones') {
        // Lógica de búsqueda para habitaciones
        this.servicioRecepcion.getHabitacionById(this.idABuscar).subscribe(
          (habitacion) => {
            if (habitacion) {
              this.habitaciones = [habitacion];
              console.log('Habitación encontrada por ID:', habitacion);
            } else {
              console.log('No se encontró ninguna habitación con ese ID.');
              this.habitaciones = [];
            }
          },
          (error) => {
            console.error('Error al buscar habitación por ID:', error);
          }
        );
      } else if (this.entidadSeleccionada === 'recepcionistas') {
        // Lógica de búsqueda para recepcionistas
        // Invoca tu servicio correspondiente para buscar recepcionistas
      }
    } else {
      console.warn('Ingrese un ID antes de buscar.');
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Backspace' && this.idABuscar.toString().length === 1) {
      this.idABuscar = 0;
      this.cargarInformacion();
    }
  }

  verificarOcupacionGeneral(): void {
    Swal.fire({
      title: 'Verificando Ocupación General',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(() => {
      Swal.close();

      const ocupacion = Math.floor(Math.random() * 101);
      Swal.fire({
        title: 'Ocupación General',
        text: `La ocupación general es del ${ocupacion}%.`,
        icon: 'info',
      });
    }, 2000);
  }
}


