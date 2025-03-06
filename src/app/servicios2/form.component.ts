import { Component, OnInit } from '@angular/core';
import { Servicio } from '../servicios/servicio';
import { Servicios2 } from './servicios2';
import { ServicioService } from '../servicios/servicio.service';
import { Servicio2Service } from './servicio2.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Reserva } from '../reservas/reserva';
import { ReservaService } from '../reservas/reserva.service';
import { UserService } from '../login/UserService';
import { ClienteService } from '../clientes/cliente.service';

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
  public usuarioLogueado: string = ''; // Aquí se almacenará el usuario logueado
  public clienteId: number | null = null; // Aquí se almacenará el ID del cliente

  constructor(
    private reservasService: ReservaService, // ✅ Nombre correcto
    private servicioService: ServicioService,
    private servicio2Service: Servicio2Service,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService, // Inyectamos el UserService
    private clienteService: ClienteService // Inyectamos el ClienteService
  ) {}

  ngOnInit(): void {
    this.obtenerUsuario();
    this.cargarServicios();
  }

  obtenerUsuario(): void {
    this.usuarioLogueado = this.userService.getUsuario() || '';  // Obtener el usuario logueado
    if (this.usuarioLogueado) {
      this.buscarCliente();
    }
  }

  buscarCliente(): void {
    this.clienteService.getAllClientes().subscribe(clientes => {
      const clienteEncontrado = clientes.find(cliente => cliente.usuario === this.usuarioLogueado);
      if (clienteEncontrado) {
        this.clienteId = clienteEncontrado.idCliente;  // Guardamos el ID del cliente
        this.cargarReservas(); // Cargar las reservas del cliente
      }
    }, error => {
      console.error('Error obteniendo cliente:', error);
    });
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
    if (this.clienteId !== null) {
      this.reservasService.getReserva().subscribe({
        next: (reservas) => {
          this.reservas = reservas.filter(reserva => reserva.idCliente === this.clienteId);  // Filtramos las reservas por el cliente logueado
          console.log('Reservas cargadas:', this.reservas);
        },
        error: (error) => {
          console.error('Error al cargar reservas:', error);
        }
      });
    }
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
