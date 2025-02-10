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
  resultadosCombinados: any[] = []; // Declaración de la propiedad

  constructor(
    private reservaService: ReservaService,
    private clienteService: ClienteService,
    private personaService: PersonaService
  ) { }

  ngOnInit(): void {
    this.bucarReserva(); // Llamar al método para cargar las reservas al iniciar
  }

  // Método para obtener todas las reservas y combinarlas con información de cliente y persona
  bucarReserva() {
    this.reservaService.getReserva().subscribe(reservas => {
      const observables = reservas.map(reserva => {
        return this.clienteService.getCliente(reserva.idCliente).pipe(
          switchMap(cliente => {
            if (cliente) {
              return this.personaService.getPersona(cliente.cedula_persona).pipe(
                map(persona => {
                  if (persona) {
                    return {
                      reservaInfo: reserva,
                      clienteInfo: cliente,
                      personaInfo: persona
                    };
                  } else {
                    console.error(`No se encontró información para la persona ${cliente.cedula_persona}`);
                    return null;
                  }
                })
              );
            } else {
              console.error(`No se encontró cliente con ID ${reserva.idCliente}`);
              return of(null);
            }
          })
        );
      });

      forkJoin(observables).subscribe(results => {
        this.resultadosCombinados = results.filter(result => result !== null); // Filtrar los resultados nulos
      });
    });
  }
}
