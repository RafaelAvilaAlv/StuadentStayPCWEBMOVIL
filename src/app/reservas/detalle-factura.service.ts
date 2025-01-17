import { Injectable } from '@angular/core';
import { DetalleFactura } from './detalle-factura';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DetalleFacturaService {
  //private urlEndPoint:string = 'http://192.168.40.228:8081/api/detallefactura';
  //private urlEndPoint: string = 'http://192.168.0.119:8081/api/detallefactura';
  private urlEndPoint: string = 'http://localhost:8081/api/detallefactura';
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' })
  constructor(private http: HttpClient) { }
  getReserva(): Observable<DetalleFactura[]> {
    return this.http.get<DetalleFactura[]>(this.urlEndPoint);
  }

  create(detallefactura: DetalleFactura): Observable<DetalleFactura> {
    return this.http.post<DetalleFactura>(this.urlEndPoint, detallefactura, { headers: this.httpHeaders })
  }

  getreserva(id: any): Observable<DetalleFactura> {
    return this.http.get<DetalleFactura>(`${this.urlEndPoint}/${id}`);
  }

}
