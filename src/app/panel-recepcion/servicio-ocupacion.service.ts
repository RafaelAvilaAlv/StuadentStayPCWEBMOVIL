import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appConfig } from '../enviroment/appConfig';

@Injectable({
  providedIn: 'root',
})
export class ServicioOcupacion {
  private urlEndPoint: string = `${appConfig.baseUrl}/habitaciones`;
  constructor(private http: HttpClient) { }

  getOcupacionGeneral(): Observable<number> {
    return this.http.get<number>(this.urlEndPoint);
  }
}
