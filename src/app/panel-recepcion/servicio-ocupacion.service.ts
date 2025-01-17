import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicioOcupacion {
  constructor(private http: HttpClient) { }

  getOcupacionGeneral(): Observable<number> {
    const apiUrl = 'http://localhost:8081/api/habitaciones';
    return this.http.get<number>(apiUrl);
  }
}
