

import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint = 'http://localhost:8081/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})

  constructor(private http: HttpClient) { }


  
  // Obtener todos los clientes
  getAllClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.urlEndPoint);
  }

  // Obtener un cliente por su ID
  getCliente(id: number): Observable<Cliente> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.get<Cliente>(url);
  }

  // Editar un cliente
  edit(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.urlEndPoint, cliente, {headers: this.httpHeaders});
  }

  // Obtener un cliente por su ID (método redundante, podrías eliminarlo si no es necesario)
  getClienteId(id: number): Observable<Cliente[]> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.get<Cliente[]>(url);
  }
}
