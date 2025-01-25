import { Injectable } from '@angular/core';
import { Servicio } from './servicio';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { appConfig } from '../enviroment/appConfig';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private urlEndPoint: string = `${appConfig.baseUrl}/tiposervicio`;
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http: HttpClient) { }

  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.urlEndPoint).pipe(
      map(response => response as Servicio[])
    );
  }

  create(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(this.urlEndPoint, servicio, { headers: this.httpHeaders })
  }

  getServicioid(id: any): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.urlEndPoint}/${id}`);
  }

  deleteServicioid(id: any): Observable<Servicio> {
    return this.http.delete<Servicio>(`${this.urlEndPoint}/${id}`);
  }
}