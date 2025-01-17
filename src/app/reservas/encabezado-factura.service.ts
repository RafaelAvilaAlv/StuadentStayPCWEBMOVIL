import { Injectable } from '@angular/core';
import { EncabezadoFactura } from './encabezado-factura';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EncabezadoFacturaService {
  //private urlEndPoint:string = 'http://192.168.40.228:8081/api/encabezadofactura';
  //private urlEndPoint: string = 'http://192.168.0.119:8081/api/encabezadofactura';
  private urlEndPoint: string = 'http://localhost:8081/api/encabezadofactura';
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http: HttpClient) { }
  getReserva(): Observable<EncabezadoFactura[]> {
    return this.http.get<EncabezadoFactura[]>(this.urlEndPoint);
  }

  create(encabezadofactura: EncabezadoFactura): Observable<EncabezadoFactura> {
    return this.http.post<EncabezadoFactura>(this.urlEndPoint, encabezadofactura, { headers: this.httpHeaders })
  }

  getreserva(id: any): Observable<EncabezadoFactura> {
    return this.http.get<EncabezadoFactura>(`${this.urlEndPoint}/${id}`);
  }

}
