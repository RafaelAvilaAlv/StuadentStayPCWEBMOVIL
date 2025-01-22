import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Cliente } from '../clientes/cliente';
import { Administrador } from '../administrador/administrador';
import { Recepcionista } from '../recepcionista/recepcionista';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //private apiUrlcli = 'http://192.168.40.228:8081/api/clientes';
  //private apiUrladm = 'http://192.168.40.228:8081/api/administrador';
  //private apiUrlrecep = 'http://192.168.40.228:8081/api/recepcionistas';
  private apiUrlcli = 'http://localhost:8081/api/clientes';
  private apiUrladm = 'http://localhost:8081/api/administrador';
  private apiUrlrecep = 'http://localhost:8081/api/recepcionistas';

  constructor(private http: HttpClient) { }

  buscarCliente(usuario: string): Observable<Cliente | Cliente[]> {
    const url = `${this.apiUrlcli}/usuario/${usuario}`;
    return this.http.get<Cliente | Cliente[]>(url);
  }
  buscarAdmin(usuario: string): Observable<Administrador | Administrador[]> {
    const url = `${this.apiUrladm}/usuario/${usuario}`;
    return this.http.get<Administrador | Administrador[]>(url);
  }
  buscarRecep(usuario: string): Observable<Recepcionista | Recepcionista[]> {
    const url = `${this.apiUrlrecep}/usuario/${usuario}`;
    return this.http.get<Recepcionista | Recepcionista[]>(url);
  }



}
