import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private urlEndPoint: string = "https://localhost:8080/api";

  constructor(private http: HttpClient) { }

  // Obtener todas las categorías
  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(this.urlEndPoint);
  }

  // Obtener una categoría por ID
  getCategoria(id: any): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/${id}`);
  }
}
