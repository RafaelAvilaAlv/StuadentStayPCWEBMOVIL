import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class ServicioRecepcion {
  constructor(private http: HttpClient) { }

  getHabitaciones(): Observable<any[]> {
    const apiUrl = 'http://localhost:8081/api/habitaciones';
    return this.http.get<any[]>(apiUrl).pipe(
      map((habitaciones: any[]) => {
        return habitaciones.map(habitacion => ({ ...habitacion, estado: habitacion.estado || 'Sin Estado' }));
      }),
      catchError(error => {
        //console.error('Error en la solicitud de habitaciones:', error);
        return throwError(error);
      })
    );
  }

  getRecepcionistasList(): Observable<any[]> {
    const apiUrl = 'http://localhost:8081/api/recepcionistas'; // Ajusta la URL según tu backend
    return this.http.get<any[]>(apiUrl).pipe(
      catchError(error => {
        //console.error('Error en la solicitud de recepcionistas:', error);
        return throwError(error);
      })
    );
  }


  getHabitacionById(id: number): Observable<any> {
    const apiUrl = `http://localhost:8081/api/habitaciones/${id}`;
    return this.http.get<any>(apiUrl).pipe(
      catchError(error => {
        //console.error(`Error al obtener la habitación con ID ${id}:`, error);
        return throwError(error);
      })
    );
  }

  eliminarHabitacion(id: number): Observable<void> {
    const apiUrl = `http://localhost:8081/api/habitaciones/${id}`;
    return this.http.delete<void>(apiUrl).pipe(
      catchError(error => {
        //console.error(`Error al eliminar la habitación con ID ${id}:`, error);
        return throwError(error);
      })
    );
  }

  buscarHabitacion(term: string): Observable<any[]> {
    const apiUrl = `http://localhost:8081/api/habitaciones/buscar/${term}`;
    return this.http.get<any[]>(apiUrl).pipe(
      catchError(error => {
        //console.error(`Error al realizar la búsqueda:`, error);
        return throwError(error);
      })
    );
  }
}
