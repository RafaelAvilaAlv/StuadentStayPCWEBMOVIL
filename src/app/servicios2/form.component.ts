import { Component, OnInit } from '@angular/core';
import { Servicio } from '../servicios/servicio';
import { Servicios2 } from './servicios2';
import { ServicioService } from '../servicios/servicio.service';
import { Servicio2Service } from './servicio2.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Reserva } from '../reservas/reserva';
import { ReservaService } from '../reservas/reserva.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponentServi implements OnInit {
  public servicio: Servicio = new Servicio();
  public servicio2: Servicios2 = new Servicios2();
  public reserva: Reserva = new Reserva(); // Objeto para la reserva seleccionada
  public reservas: Reserva[] = []; // Lista de reservas
  public titulo: string = "Crear Servicio";

  constructor(
    private reservasService: ReservaService, // ✅ Nombre correcto
    private servicioService: ServicioService,
    private servicio2Service: Servicio2Service,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  

  ngOnInit(): void {
    this.cargarServicios();
    this.cargarReservas(); // Cargar las reservas en el dropdown
  }

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

  cargarReservas(): void {
    this.reservasService.getReserva().subscribe({
      next: (reservas) => {
        this.reservas = reservas;
        console.log('Reservas cargadas:', this.reservas);
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
      }
    });
  }
  

  public create(): void {
    this.servicio2.idHabitaciones = this.reserva.idReserva; // Asigna el ID de la reserva seleccionada
    this.servicio2.estado = 'Pendiente';
    this.servicio2.idTipo_servicio = this.servicio.idTipo_servicio;

    this.servicio2Service.create(this.servicio2).subscribe(servicio2 => {
      this.router.navigate(['/servicios']);
      Swal.fire('Servicio Solicitado con éxito', `Servicio ${servicio2.descripcion}`, 'success');
    });
  }
}
