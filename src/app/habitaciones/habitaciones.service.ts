import { Injectable } from '@angular/core';
import { Habitaciones } from './habitaciones';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { categorias } from './categorias';
@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {
  private urlEndPoint: string = "https://localhost:8080/api";
  private urlEndPoint1: string = "https://localhost:8080/api";

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getHabitaciones(): Observable<Habitaciones[]> {
    return this.http.get(this.urlEndPoint).pipe(map((response) => response as Habitaciones[]));
  }

  create(habitaciones: Habitaciones): Observable<Habitaciones> {
    return this.http.post<Habitaciones>(this.urlEndPoint, habitaciones, {
      headers: this.httpHeaders,
    });
  }

  getHabitacionesid(id: any): Observable<Habitaciones> {
    return this.http.get<Habitaciones>(`${this.urlEndPoint}/${id}`);
  }

  delete(id: any): Observable<Habitaciones> {
    return this.http.delete<Habitaciones>(`${this.urlEndPoint}/${id}`);
  }

  update(habitaciones: Habitaciones): Observable<Habitaciones> {
    const url = `${this.urlEndPoint}/${habitaciones.idHabitaciones}`;
    return this.http.put<Habitaciones>(url, habitaciones, {
      headers: this.httpHeaders,
    });
  }

  getCategoria(id: any): Observable<categorias> {
    return this.http.get<categorias>(`${this.urlEndPoint1}/${id}`);
  }
  getHabitacionesPorRecepcionista(idRecepcionista: number): Observable<Habitaciones[]> {
    return this.http.get<Habitaciones[]>(`${this.urlEndPoint}/recepcionista/${idRecepcionista}`);
  }
  

}