import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ServicioOcupacion {
  private urlEndPoint: string = "https://localhost:8080/api";

  constructor(private http: HttpClient) { }

  getOcupacionGeneral(): Observable<number> {
    return this.http.get<number>(this.urlEndPoint);
  }
}
