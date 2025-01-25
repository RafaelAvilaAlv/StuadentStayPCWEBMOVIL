import { Injectable } from '@angular/core';
import { Reserva } from './reserva';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../enviroment/appConfig';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private urlEndPoint: string = `${appConfig.baseUrl}/reservas`;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http: HttpClient) { }
  getReserva(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.urlEndPoint);
  }

  create(reserva: Reserva): Observable<Reserva> {
    return this.http.post<Reserva>(this.urlEndPoint, reserva, { headers: this.httpHeaders })
  }
  update(reserva: Reserva): Observable<Reserva> {
    const url = `${this.urlEndPoint}/${reserva.idReserva}`;
    return this.http.put<Reserva>(url, reserva, { headers: this.httpHeaders })
  }

  getreserva(id: any): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.urlEndPoint}/${id}`);
  }


}
