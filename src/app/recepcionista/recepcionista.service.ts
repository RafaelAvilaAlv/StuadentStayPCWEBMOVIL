import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Recepcionista } from './recepcionista';
import { appConfig } from '../enviroment/appConfig';


@Injectable({
  providedIn: 'root'
})
export class RecepcionistaService {
  private urlEndPoint: string = `${appConfig.baseUrl}/recepcionistas`;
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  create(recepcionista: Recepcionista): Observable<Recepcionista> {
    return this.http.post<Recepcionista>(this.urlEndPoint, recepcionista, { headers: this.httpHeaders });
  }

  getRecepcionista(id: number): Observable<Recepcionista> {
    return this.http.get<Recepcionista>(`${this.urlEndPoint}/${id}`);
  }

  eliminarRecepcionista(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  createRecepcionista(recepcionista: any): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/recepcionistas`, recepcionista);
  }

  getRecepcionistas(): Observable<Recepcionista[]> {
   
    return this.http.get<Recepcionista[]>(`${this.urlEndPoint}`);
         
    }
    verificarCedula(cedula: string): Observable<boolean> {
      return this.http.get<boolean>(`${this.urlEndPoint}/verificarCedula/${cedula}`);
    }
  
    


}
