// panel-servicios-reservas.component.ts

import { Component, OnInit } from '@angular/core';
import { ServicioReservas } from './servicio-reservas.service';  // Asegúrate de importar el servicio correcto

@Component({
  selector: 'app-panel-servicios-reservas',
  templateUrl: './panel-servicios-reservas.component.html',
  styleUrls: ['./panel-servicios-reservas.component.css']
})
export class PanelServiciosReservasComponent implements OnInit {
  reservasPendientes: any[] = [];
  serviciosSolicitados: any[] = [];

  constructor(private servicioReservas: ServicioReservas) { }

  ngOnInit(): void {
    this.cargarInformacion();
  }

  cargarInformacion(): void {
    this.servicioReservas.getReservasPendientes().subscribe(reservas => {
      this.reservasPendientes = reservas;
    });

    this.servicioReservas.getServiciosSolicitados().subscribe(servicios => {
      this.serviciosSolicitados = servicios;
    });
  }

  editarReserva(reserva: any): void {
  }

  eliminarReserva(reserva: any): void {
  }

  editarServicio(servicio: any): void {
  }

  eliminarServicio(servicio: any): void {
  }
}
