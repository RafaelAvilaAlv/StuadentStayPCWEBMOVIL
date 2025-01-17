import { Component, OnInit } from '@angular/core';
import { PersonaService } from '../persona/persona.service';
import { ReservaService } from './reserva.service';
import { EncabezadoFacturaService } from './encabezado-factura.service';
import { ClienteService } from '../clientes/cliente.service';
import { HabitacionesService } from '../habitaciones/habitaciones.service';
import { AuthService } from '../auth.service';
import { Habitaciones } from '../habitaciones/habitaciones';
import { Reserva } from './reserva';
import { Persona } from '../persona/persona';
import { forkJoin, map, of, switchMap } from 'rxjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formhistorial',
  templateUrl: './formhistorial.component.html',
  styleUrl: './formhistorial.component.css'
})

export class FormhistorialComponent implements OnInit {
  resultadosCombinados: any[] = [];
  idCliente: number = this.inicio.idUsuario;
  habitacion: Habitaciones = new Habitaciones();
  reservas: Reserva = new Reserva();
  persona: Persona = new Persona();
  constructor(private inicio: AuthService,private sevicePersona: PersonaService, private serviceReserva: ReservaService, private seviceEncabezado: EncabezadoFacturaService,
    private serviceClietne: ClienteService, private serviceHabitacion: HabitacionesService,private router: Router){}

  ngOnInit(): void{
    this.buscarReservas()
  }

  buscarReservas() {
    this.serviceReserva.getReserva().subscribe(
      reservas => {
        const observables = reservas
          .filter(reserva => reserva.idCliente === this.idCliente)
          .map(reserva => this.obtenerInformacionReserva(reserva));
  
        forkJoin(observables).subscribe(
          resultados => {
            console.log(resultados); // Verifica si los resultados están llegando aquí
            this.resultadosCombinados = resultados.filter(result => result !== null);
          },
          error => {
            console.error('Error al cargar información de reservas:', error);
          }
        );
      },
      error => {
        console.error('Error al obtener reservas:', error);
      }
    );
  }
  
  obtenerInformacionReserva(reserva: Reserva) {
    return this.serviceClietne.getCliente(reserva.idCliente).pipe(
      switchMap(cliente => {
        if (!cliente) {
          console.error(`No se encontró información de cliente para el ID de cliente ${reserva.idCliente}`);
          return of(null);
        }
        return this.sevicePersona.getPersona(cliente.cedula_persona).pipe(
          switchMap(persona => {
            if (!persona) {
              console.error(`No se encontró información de persona para la cédula ${cliente.cedula_persona}`);
              return of(null);
            }
            return this.serviceHabitacion.getHabitacionesid(reserva.idHabitaciones).pipe(
              switchMap(habitacion => {
                if (!habitacion) {
                  console.error(`No se encontró información de habitación para el ID de habitación ${reserva.idHabitaciones}`);
                  return of(null);
                }
                return this.seviceEncabezado.getreserva(reserva.idReserva).pipe(
                  map(encabezado => ({
                    reserva: reserva,
                    cliente: cliente,
                    persona: persona,
                    habitacion: habitacion,
                    encabezado: encabezado
                  }))
                );
              })
            );
          })
        );
      })
    );
  }

  descargarPDF(combinedData: any) {
    this.router.navigate(['/reservas/form-factura-historial', { datos: JSON.stringify(combinedData) }]);
  }

  
}
