import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cantones } from './canton';
import { appConfig } from '../enviroment/appConfig';

@Injectable({
  providedIn: 'root',
})
export class CantonService {
  private urlEndPoint: string = appConfig.baseUrl;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http: HttpClient) { }

  getCantones(): Observable<Cantones[]> {
    return this.http.get<Cantones[]>(`${this.urlEndPoint}/Cantons`);
  }

  getCantonById(id: string): Observable<Cantones> {
    return this.http.get<Cantones>(`${this.urlEndPoint}/Cantons/${id}`);
  }

}