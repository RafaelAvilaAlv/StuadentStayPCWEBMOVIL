import { Component, OnInit } from '@angular/core';
import { HabitacionesService } from '../habitaciones/habitaciones.service';
import { Habitaciones } from '../habitaciones/habitaciones';
import { ClienteService } from '../clientes/cliente.service';
import { PersonaService } from '../persona/persona.service';
import { ReservaService } from '../reservas/reserva.service';
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
  reservas: Reserva = new Reserva();

  constructor(
    private habitacionesService: HabitacionesService, 
    private clienteService: ClienteService, 
    private personaService: PersonaService,
    private reservaService: ReservaService
  ) {}

  ngOnInit(): void {
    this.buscarReservas();
  }

  buscarReservas() {
    this.reservaService.getReserva().subscribe(
      reservaInd => {
        const observables = reservaInd.map(reservaInfo => {
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
    );
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
        this.reservas.estado = nuevoEstado;
        this.reservas.idReserva = idReserva;

        this.reservaService.update(this.reservas).subscribe(
          (response) => {
            if (nuevoEstado === 'Finalizado' && response && response.idHabitaciones) {
              this.actualizarHabitacion(response.idHabitaciones);
            } else {
              Swal.fire('Estado actualizado', `Reserva ${idReserva} marcada como ${nuevoEstado}`, 'success');
              this.buscarReservas();
            }
          },
          (error) => {
            console.error('Error al cambiar estado de la reserva:', error);
            Swal.fire('Error', 'No se pudo cambiar el estado de la reserva.', 'error');
          }
        );
      }
    });
  }

  private actualizarHabitacion(idHabitaciones: number) {
    this.habitacionesService.getHabitacionesid(idHabitaciones).subscribe(habitacion => {
      this.habitaciones = { ...habitacion, estado: 'Disponible' };
      
      this.habitacionesService.update(this.habitaciones).subscribe(
        () => {
          Swal.fire('Reserva Finalizada', `La habitación ${habitacion.nHabitacion} ahora está disponible`, 'success');
          this.buscarReservas();
        },
        (error) => {
          console.error('Error al actualizar la habitación:', error);
        }
      );
    });
  }
}


