import { Component, OnInit } from '@angular/core';
import { Recepcionista } from './recepcionista';
import { RecepcionistaService } from './recepcionista.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recepcionistas',
  templateUrl: './recepcionista.component.html',
  styleUrls: ['./recepcionista.component.css']
})
export class RecepcionistaComponent implements OnInit {
  recepcionistas: Recepcionista[] = [];
  

  constructor(private recepcionistaService: RecepcionistaService) { }

  ngOnInit() {
    this.recepcionistaService.getRecepcionistas().subscribe(
      (recepcionistas) => (this.recepcionistas = recepcionistas)
    );
  }

  eliminarRecepcionista(idRecepcionista: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.recepcionistaService.eliminarRecepcionista(idRecepcionista).subscribe(
          () => {
            Swal.fire(
              'Borrado',
              'El recepcionista ha sido eliminado',
              'success'
            );
          },
          (error) => {
            //console.error('Error al eliminar al recepcionista', error);
            Swal.fire('Error', 'Hubo un error al eliminar al recepcionista', 'error');
          }
        );
      }
    });
  }

  editarRecepcionista(idRecepcionista: number): void {
  }

  
}
