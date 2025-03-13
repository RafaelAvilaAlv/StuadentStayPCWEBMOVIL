import { Component, OnInit } from '@angular/core';
import { HabitacionesService } from '../habitaciones/habitaciones.service';
import { Habitaciones } from '../habitaciones/habitaciones';
import { ClienteService } from '../clientes/cliente.service';
import { PersonaService } from '../persona/persona.service';
import { ReservaService } from '../reservas/reserva.service';
import { RecepcionistaService } from '../recepcionista/recepcionista.service';
import { UserService } from '../login/UserService';
import { Reserva } from '../reservas/reserva';
import { Cliente } from '../clientes/cliente';
import { Persona } from '../persona/persona';
import { forkJoin, of, switchMap, map } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-panel-control',
  templateUrl: './form-panel-control.component.html',
  styleUrl: './form-panel-control.component.css'
})
export class FormPanelControlComponent implements OnInit {
  buscar: string = '';
  resultadosCombinados: any[] = [];
  habitaciones: Habitaciones = new Habitaciones();
  reservas: Reserva[] = [];
  recepcionistaId: number | null = null;

  constructor(
    private habitacionesService: HabitacionesService,
    private clienteService: ClienteService,
    private personaService: PersonaService,
    private reservaService: ReservaService,
    private recepcionistaService: RecepcionistaService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    
    this.obtenerReservasRecepcionista();
  }

  obtenerReservasRecepcionista() {
    const usuario = this.userService.getUsuario();
  
    // Si no hay usuario, mejor definimos uno "por defecto" o hacemos otra acción
    if (!usuario) {
      console.log('No hay usuario almacenado. Mostrando reservas sin filtrar.');
      this.reservaService.getReserva().subscribe(reservas => {
        this.reservas = reservas;
        this.buscarDetallesReservas();
      });
      return;
    }
  
    // Si sí hay usuario, seguimos con el flujo normal
    this.recepcionistaService.buscarPorUsuario(usuario).subscribe(recepcionista => {
      if (recepcionista) {
        this.recepcionistaId = recepcionista.idRecepcionista;
        this.reservaService.getReserva().subscribe(reservas => {
          this.reservas = reservas.filter(reserva => reserva.idRecepcionista === this.recepcionistaId);
          this.buscarDetallesReservas();
        });
      } else {
        console.log('No se encontró un recepcionista con ese usuario.');
      }
    });
  }
  
  buscarDetallesReservas() {
    const observables = this.reservas.map(reservaInfo => {
      return this.clienteService.getCliente(reservaInfo.idCliente).pipe(
        switchMap(clienteInf => {
          if (clienteInf) {
            return this.personaService.getPersona(clienteInf.cedula_persona).pipe(
              map(personaInf => ({
                reservaInfo,
                clienteInfo: clienteInf,
                personaInfor: personaInf
              }))
            );
          } else {
            return of(null);
          }
        })
      );
    });

    forkJoin(observables).subscribe(results => {
      this.resultadosCombinados = results.filter(result => result !== null);
    });
  }

  cambiarEstado(idReserva: number, nuevoEstado: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres cambiar el estado de la reserva a ${nuevoEstado}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const reserva = this.reservas.find(r => r.idReserva === idReserva);
        if (reserva) {
          reserva.estado = nuevoEstado;

          this.reservaService.update(reserva).subscribe(
            (response) => {
              if (nuevoEstado === 'Finalizado' && response && response.idHabitaciones) {
                this.actualizarHabitacion(response.idHabitaciones);
              } else {
                Swal.fire('Estado actualizado', `Reserva ${idReserva} marcada como ${nuevoEstado}`, 'success');
                this.obtenerReservasRecepcionista();
              }
            },
            (error) => {
              console.error('Error al cambiar estado de la reserva:', error);
              Swal.fire('Error', 'No se pudo cambiar el estado de la reserva.', 'error');
            }
          );
        }
      }
    });
  }

  private actualizarHabitacion(idHabitaciones: number) {
    this.habitacionesService.getHabitacionesid(idHabitaciones).subscribe(habitacion => {
      this.habitaciones = { ...habitacion, estado: 'Disponible' };
      
      this.habitacionesService.update(this.habitaciones).subscribe(
        () => {
          Swal.fire('Reserva Finalizada', `La habitación ${habitacion.nHabitacion} ahora está disponible`, 'success');
          this.obtenerReservasRecepcionista();
        },
        (error) => {
          console.error('Error al actualizar la habitación:', error);
        }
      );
    });
  }
}
