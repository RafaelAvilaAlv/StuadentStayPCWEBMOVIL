
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provincia } from './provincia';
import { appConfig } from '../enviroment/appConfig';

@Injectable({
  providedIn: 'root',
})
export class ProvinciaService {
  private urlEndPoint: string = `${appConfig.baseUrl}`;
  constructor(private http: HttpClient) { }

  getProvincias(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(`${this.urlEndPoint}/provincias`);
  }

  getProvinciaById(id: string): Observable<Provincia> {
    return this.http.get<Provincia>(`${this.urlEndPoint}/provincias/${id}`);
  }

}
