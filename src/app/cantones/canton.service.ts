import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cantones } from './canton';

@Injectable({
  providedIn: 'root',
})
export class CantonService {
  //private apiUrl = 'http://192.168.40.228:8081/api';
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) { }

  getCantones(): Observable<Cantones[]> {
    return this.http.get<Cantones[]>(`${this.apiUrl}/Cantons`);
  }

  getCantonById(id: string): Observable<Cantones> {
    return this.http.get<Cantones>(`${this.apiUrl}/Cantons/${id}`);
  }

}
