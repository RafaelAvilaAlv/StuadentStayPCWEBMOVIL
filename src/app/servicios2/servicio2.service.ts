import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Servicios2 } from './servicios2';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Servicio2Service {

  //private urlEndPoint: string = 'http://192.168.40.228:8081/api/servicio';
  private urlEndPoint: string = 'http://localhost:8081/api/servicio';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http: HttpClient) { }

  getServicios2(): Observable<Servicios2[]> {
    return this.http.get<Servicios2[]>(this.urlEndPoint).pipe(
      map(response => response as Servicios2[])
    );
  }

  create(articulo: Servicios2): Observable<Servicios2> {
    return this.http.post<Servicios2>(this.urlEndPoint, articulo, { headers: this.httpHeaders })
  }

  getServicios2id(id: any): Observable<Servicios2> {
    return this.http.get<Servicios2>(`${this.urlEndPoint}/${id}`);
  }

  deleteServicios2id(id: any): Observable<Servicios2> {
    return this.http.delete<Servicios2>(`${this.urlEndPoint}/${id}`);
  }

  actualizarEstado(id: number, nuevoEstado: string): Observable<Servicios2> {
    const url = `${this.urlEndPoint}/${id}`;
    const body = { estado: nuevoEstado };
    return this.http.put<Servicios2>(url, body, { headers: this.httpHeaders });
  }
  
}
