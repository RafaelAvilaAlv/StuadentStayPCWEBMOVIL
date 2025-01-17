
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provincia } from './provincia';

@Injectable({
  providedIn: 'root',
})
export class ProvinciaService {
  //private apiUrl = 'http://192.168.40.228:8081/api/provincias';
  private apiUrl = 'http://localhost:8081/api';
  constructor(private http: HttpClient) { }

  getProvincias(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(`${this.apiUrl}/provincias`);
  }

  getProvinciaById(id: string): Observable<Provincia> {
    return this.http.get<Provincia>(`${this.apiUrl}/provincias/${id}`);
  }

}
