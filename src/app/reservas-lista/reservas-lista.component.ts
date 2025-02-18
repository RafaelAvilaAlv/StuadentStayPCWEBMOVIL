import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../reservas/reserva.service';
import { ClienteService } from '../clientes/cliente.service';
import { PersonaService } from '../persona/persona.service';
import { forkJoin, switchMap, map, of } from 'rxjs';

@Component({
  selector: 'app-reservas-lista',
  templateUrl: './reservas-lista.component.html',
  styleUrls: ['./reservas-lista.component.css']
})
export class ReservasListaComponent implements OnInit {

 // buscar: string = '';
 buscar: string = '';
  resultadosCombinados: any[] = []; // Declaración de la propiedad

  constructor(
    private reservaService: ReservaService,
    private clienteService: ClienteService,
    private personaService: PersonaService
  ) { }

  ngOnInit(): void {
    this.bucarReserva(); // Llamar al método para cargar las reservas al iniciar
  }

  bucarReserva() {
    this.reservaService.getReserva().subscribe(
      reservaInd => {
        const observables = reservaInd.map(reservaInfo => {
          return this.clienteService.getCliente(reservaInfo.idCliente).pipe(
            switchMap(clienteInf => {
              const clienteInfo = clienteInf;
              if (clienteInfo) {
                return this.personaService.getPersona(clienteInfo.cedula_persona).pipe(
                  map(personaInf => {
                    const personaInfor = personaInf;
                    if (personaInfor) {
                      return {
                        reservaInfo: reservaInfo,
                        clienteInfo: clienteInfo,
                        personaInfor: personaInfor
                      };
                    } else {
                      console.error(`No se encontró información de persona para la cédula ${clienteInfo.cedula_persona}`);
                      return null;
                    }
                  })
                );
              } else {
                console.error(`No se encontró información de cliente para el ID de cliente ${reservaInfo.idCliente}`);
                return of(null);
              }
            })
          );
        });

        forkJoin(observables).subscribe(results => {
          console.log(results); // Verifica si los resultados están llegando aquí
          this.resultadosCombinados = results.filter(result => result !== null);
        });
      }
    );
  }

  

  // Getter para filtrar los resultados según la cédula
  get resultadosFiltrados() {
    return this.resultadosCombinados.filter(result => 
      result?.clienteInfo?.cedula_persona.includes(this.buscar)
    );
  }
}