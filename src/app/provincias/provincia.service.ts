
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provincia } from './provincia';

@Injectable({
  providedIn: 'root',
})
export class ProvinciaService {
  private urlEndPoint: string = "https://localhost:8080/api";
  
  constructor(private http: HttpClient) { }

  getProvincias(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(`${this.urlEndPoint}/provincias`);
  }

  getProvinciaById(id: string): Observable<Provincia> {
    return this.http.get<Provincia>(`${this.urlEndPoint}/provincias/${id}`);
  }

}
