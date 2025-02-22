import { Component, OnInit } from '@angular/core';
import { ServicioService } from './servicio.service';
import { Servicio } from './servicio';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})

export class ServiciosComponent implements OnInit {

  Servicios: Servicio[] = [];
  ServiciosFiltrados: Servicio[] = [];
  titulosUnicos: string[] = []; // Array para almacenar los títulos únicos
  filtroServicio: string = ''; // Valor seleccionado del filtro

  constructor(private servicioservice: ServicioService) { }

  ngOnInit(): void {
    this.servicioservice.getServicios().subscribe(
      (Servicios) => {
        this.Servicios = Servicios;
        this.ServiciosFiltrados = [...this.Servicios]; // Inicialmente mostramos todos los servicios
        
        // Llenamos el array titulosUnicos con los títulos de los servicios sin duplicados
        this.titulosUnicos = [...new Set(this.Servicios.map(servicio => servicio.titulo))];
      }
    );
  }

  // Método para filtrar los servicios por el título seleccionado
  filtrarServicios(): void {
    if (this.filtroServicio) {
      this.ServiciosFiltrados = this.Servicios.filter(servicio => 
        servicio.titulo.toLowerCase() === this.filtroServicio.toLowerCase()
      );
    } else {
      this.ServiciosFiltrados = [...this.Servicios]; // Si no hay filtro, mostramos todos los servicios
    }
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
                this.ServiciosFiltrados = [...this.Servicios]; // Actualizamos los servicios filtrados
                Swal.fire('Servicio eliminado', `Servicio ${servicio.titulo} eliminado con éxito`, 'success');
              },
            );
          },
        );
      }
    });
  }
}
