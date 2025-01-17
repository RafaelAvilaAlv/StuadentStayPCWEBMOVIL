
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroC } from './registroC';

@Injectable({
  providedIn: 'root',
})
export class RegistroCService {
  private apiUrl = 'http://localhost:8081/api';
  //private apiUrl = 'http://192.168.40.228:8081/api';
  private urlEndPoint = `${this.apiUrl}/clientes`;

  constructor(private http: HttpClient) { }

  registrarCliente(registroC: RegistroC): Observable<RegistroC> {
    return this.http.post<RegistroC>(this.urlEndPoint, registroC);
  }

}
