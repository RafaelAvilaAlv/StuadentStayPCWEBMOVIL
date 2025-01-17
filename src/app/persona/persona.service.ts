import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Persona } from './persona';
import { Cantones } from '../cantones/canton';
import { Provincia } from '../provincias/provincia';

@Injectable({
  providedIn: 'root',
})
export class PersonaService {
  //private apiUrl = 'http://192.168.40.228:8081/api';
  private apiUrl = 'http://localhost:8081/api';
  private urlEndPoint = `${this.apiUrl}/personas`;
  private httpHeaders = { 'Content-Type': 'application/json' };

  constructor(private http: HttpClient) { }

  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.urlEndPoint);
  }

  getPersona(cedula: string): Observable<Persona> {
    return this.http.get<Persona>(`${this.urlEndPoint}/${cedula}`);
  }

  createPersona(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(this.urlEndPoint, persona, { headers: this.httpHeaders })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          //console.error('Error al crear persona:', error);

          if (error.status === 500) {
            return throwError('Ocurrió un error interno en el servidor. Por favor, inténtalo nuevamente más tarde.');
          } else {
            return throwError('Ocurrió un error. Por favor, verifica tus datos e inténtalo nuevamente.');
          }
        })
      );
  }

  updatePersona(persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${this.urlEndPoint}/${persona.cedula_persona}`, persona, { headers: this.httpHeaders });
  }

  deletePersona(cedula: string): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${cedula}`);
  }


  getCantones(): Observable<Cantones[]> {
    return this.http.get<Cantones[]>('http://localhost:8081/api/Cantons');
  }

  getProvincias(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>('http://localhost:8081/api/provincias');
  }

  getPersonaID(cedula: string): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.urlEndPoint}/${cedula}`);
  }


}
