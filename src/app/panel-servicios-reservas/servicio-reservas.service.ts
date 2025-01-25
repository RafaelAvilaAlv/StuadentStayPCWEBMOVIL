// panel-servicios-reservas/servicio-reservas.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reserva } from '../reservas/reserva';
import { appConfig } from '../enviroment/appConfig';

@Injectable({
  providedIn: 'root',
})
export class ServicioReservas {
  private urlEndPoint: string = `${appConfig.baseUrl}/reservas`;

  constructor(private http: HttpClient) { }

  getReservasPendientes(): Observable<Reserva[]> {
    const url = `${this.urlEndPoint}/pendientes`;
    return this.http.get<Reserva[]>(url).pipe(
      catchError(error => {
        //console.error('Error en la solicitud de reservas pendientes:', error);
        return throwError(error);
      })
    );
  }

  getServiciosSolicitados(): Observable<Reserva[]> {
    const url = `${this.urlEndPoint}/solicitados`;
    return this.http.get<Reserva[]>(url).pipe(
      catchError(error => {
        //console.error('Error en la solicitud de servicios solicitados:', error);
        return throwError(error);
      })
    );
  }


}
