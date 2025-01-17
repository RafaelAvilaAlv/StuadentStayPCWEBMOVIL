// servicio-comunicacion.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioComunicacionService {
  private actualizarPanelSubject = new Subject<void>();

  actualizarPanel$ = this.actualizarPanelSubject.asObservable();

  notificarActualizacion(): void {
    this.actualizarPanelSubject.next();
  }
}
