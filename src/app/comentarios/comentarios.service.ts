import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private url: string = "https://localhost:8080/api";

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
