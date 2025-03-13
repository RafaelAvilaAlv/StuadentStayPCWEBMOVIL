import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cantones } from './canton';

@Injectable({
  providedIn: 'root',
})
export class CantonService {
  private urlEndPoint: string = "http://localhost:8080/api";
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http: HttpClient) { }

  getCantones(): Observable<Cantones[]> {
    return this.http.get<Cantones[]>(`${this.urlEndPoint}/Cantonss`);
  }

  getCantonById(id: string): Observable<Cantones> {
    return this.http.get<Cantones>(`${this.urlEndPoint}/Cantonss/${id}`);
  }

}