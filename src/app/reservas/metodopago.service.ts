import { Injectable } from '@angular/core';
import { Metodopago } from './metodopago';
import { Observable, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MetodopagoService {
  private urlEndPoint: string = "https://localhost:8080/api";

  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http: HttpClient) { }

  getPagoNombres(): Observable<string[]> {
    return this.http.get<Metodopago[]>(this.urlEndPoint).pipe(
      map(metodos => metodos.map(metodo => metodo.nombre))
    );
  }
}
