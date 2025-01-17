import { OperatorFunction, Subscription } from "rxjs";

export class Reserva {
  pipe(arg0: OperatorFunction<unknown, Subscription>) {
    throw new Error('Method not implemented.');
  }
  map(arg0: (habitacion: any) => void) {
    throw new Error('Method not implemented.');
  }
  idReserva: number = 0;
  idPago: number = 0;
  fechaSalida: String = '';
  fechaEntrada: String = '';
  total: number = 0;
  idHabitaciones: number = 0;
  idRecepcionista: number = 0;
  idCliente: number = 0;
  dias: number = 0;
  nPersona: number = 0;
  estado: String = '';

}
