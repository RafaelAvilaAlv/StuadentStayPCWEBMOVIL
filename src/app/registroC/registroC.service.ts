
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroC } from './registroC';
import { appConfig } from '../enviroment/appConfig';

@Injectable({
  providedIn: 'root',
})
export class RegistroCService {
  private urlEndPoint: string = `${appConfig.baseUrl}/clientes`;
  
  constructor(private http: HttpClient) { }

  registrarCliente(registroC: RegistroC): Observable<RegistroC> {
    return this.http.post<RegistroC>(this.urlEndPoint, registroC);
  }

}
