import { Injectable } from '@angular/core';
import { Metodopago } from './metodopago';
import { Observable, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../enviroment/appConfig';

@Injectable({
  providedIn: 'root'
})
export class MetodopagoService {
  private urlEndPoint: string = `${appConfig.baseUrl}/metodopago`;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http: HttpClient) { }

  getPagoNombres(): Observable<string[]> {
    return this.http.get<Metodopago[]>(this.urlEndPoint).pipe(
      map(metodos => metodos.map(metodo => metodo.nombre))
    );
  }
}
