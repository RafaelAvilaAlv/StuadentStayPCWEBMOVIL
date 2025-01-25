import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../enviroment/appConfig';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint: string = appConfig.baseUrl;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  
  constructor( private http: HttpClient) { }

  getClientes(): Observable<Cliente[]>{

    return this.http.get<Cliente[]>(this.urlEndPoint);
  }

  getCliente(id: number): Observable<Cliente> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.get<Cliente>(url);
  }

  edit(cliente:Cliente):Observable<Cliente>{
    return this.http.post<Cliente>(this.urlEndPoint, cliente, {headers: this.httpHeaders})
  }

  getClienteId(id: number): Observable<Cliente[]> {
    const url = `${this.urlEndPoint}/${id}`;
    return this.http.get<Cliente[]>(url);
  }
  
  
  
}

