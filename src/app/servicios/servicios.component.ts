import { Component, OnInit } from '@angular/core';
import { ServicioService } from './servicio.service';
import { Servicio } from './servicio';
import { Observable } from 'rxjs';
import { response } from 'express';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})

export class ServiciosComponent implements OnInit {

  Servicios: Servicio[] = [];

  constructor(private servicioservice: ServicioService) { }

  ngOnInit(): void {
    this.servicioservice.getServicios().subscribe(
      Servicios => this.Servicios = Servicios
    );
  }

  delete(servicio: Servicio): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar el Servicio ${servicio.titulo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioservice.deleteServicioid(servicio.idTipo_servicio).subscribe(
          () => {
            this.servicioservice.getServicios().subscribe(
              (servicios) => {
                this.Servicios = servicios;
                Swal.fire('Servicio eliminado', `Servicio ${servicio.titulo} eliminado con éxito`, 'success');
              },
            );
          },
        );
      }
    });
  }

}