import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appConfig } from './enviroment/appConfig';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
   private urlEndPoint: string = `${appConfig.baseUrl}/categorias`; // Cambia esto según la URL de tu backend

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
