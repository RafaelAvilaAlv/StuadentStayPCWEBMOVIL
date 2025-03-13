import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Servicios2 } from './servicios2';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Servicio2Service {
  private urlEndPoint: string = "https://localhost:8080/api";

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getServicios2(): Observable<Servicios2[]> {
    return this.http.get<Servicios2[]>(this.urlEndPoint).pipe(
      map(response => response as Servicios2[])
    );
  }

  create(articulo: Servicios2): Observable<Servicios2> {
    return this.http.post<Servicios2>(this.urlEndPoint, articulo, { headers: this.httpHeaders });
  }

  getServicios2id(id: any): Observable<Servicios2> {
    return this.http.get<Servicios2>(`${this.urlEndPoint}/${id}`);
  }

  deleteServicios2id(id: any): Observable<Servicios2> {
    return this.http.delete<Servicios2>(`${this.urlEndPoint}/${id}`);
  }

  // Actualizar estado, idTipo_servicio y descripcion
  actualizarEstado(id: number, nuevoEstado: string, idTipo_servicio: number, descripcion: string): Observable<Servicios2> {
    const url = `${this.urlEndPoint}/${id}`;
    const body = {
      estado: nuevoEstado,
      idTipo_servicio: idTipo_servicio,  // Nuevo campo
      descripcion: descripcion           // Nuevo campo
    };
    return this.http.put<Servicios2>(url, body, { headers: this.httpHeaders });
  }
}
