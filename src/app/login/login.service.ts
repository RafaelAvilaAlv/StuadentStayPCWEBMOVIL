import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Cliente } from '../clientes/cliente';
import { Administrador } from '../administrador/administrador';
import { Recepcionista } from '../recepcionista/recepcionista';
import { appConfig } from '../enviroment/appConfig';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private urlEndPoint: string = `${appConfig.baseUrl}/clientes`;
  private urlEndPoint1: string = `${appConfig.baseUrl}/administrador`;
  private urlEndPoint2: string = `${appConfig.baseUrl}/recepcionistas`;

  constructor(private http: HttpClient) { }

  buscarCliente(usuario: string): Observable<Cliente | Cliente[]> {
    const url = `${this.urlEndPoint}/usuario/${usuario}`;
    return this.http.get<Cliente | Cliente[]>(url);
  }
  buscarAdmin(usuario: string): Observable<Administrador | Administrador[]> {
    const url = `${this.urlEndPoint1}/usuario/${usuario}`;
    return this.http.get<Administrador | Administrador[]>(url);
  }
  buscarRecep(usuario: string): Observable<Recepcionista | Recepcionista[]> {
    const url = `${this.urlEndPoint2}/usuario/${usuario}`;
    return this.http.get<Recepcionista | Recepcionista[]>(url);
  }

}
