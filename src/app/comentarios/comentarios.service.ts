import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appConfig } from '../enviroment/appConfig';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private url: string = `${appConfig.baseUrl}/comentarios`;  // Ajusta según tu configuración

  constructor(private http: HttpClient) {}

  getComentarios(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  crearComentario(comentario: any): Observable<any> {
    return this.http.post<any>(this.url, comentario);
  }

  eliminarComentario(idComentario: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${idComentario}`);
  }
}
