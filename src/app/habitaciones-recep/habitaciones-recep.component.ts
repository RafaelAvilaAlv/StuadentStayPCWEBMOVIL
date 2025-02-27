import { Component, OnInit } from '@angular/core';
import { Habitaciones } from '../habitaciones/habitaciones';
import { HabitacionesService } from '../habitaciones/habitaciones.service';
import { RecepcionistaService } from '../recepcionista/recepcionista.service';
import { UserService } from '../login/UserService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-habitaciones-recep',
  templateUrl: './habitaciones-recep.component.html',
  styleUrls: ['./habitaciones-recep.component.css']
})
export class HabitacionesRecepComponent implements OnInit {

  habitaciones: Habitaciones[] = [];
  currentRecepcionistaId: number = 0;

  constructor(
    private habitacionService: HabitacionesService,
    private recepcionistaService: RecepcionistaService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    const usuarioActual = this.userService.getUsuario(); // Obtener usuario guardado

    if (usuarioActual) {
      this.recepcionistaService.buscarPorUsuario(usuarioActual).subscribe(recepcionista => {
        if (recepcionista) {
          this.currentRecepcionistaId = recepcionista.idRecepcionista;
          this.cargarHabitaciones();
        } else {
          Swal.fire('Aviso', 'El recepcionista aun no tiene habitaciones', 'error');
        }
      });
    } else {
      Swal.fire('Error', 'No se encontró un usuario activo en UserService.', 'error');
    }
  }

  cargarHabitaciones(): void {
    this.habitacionService.getHabitaciones().subscribe(data => {
      this.habitaciones = data.filter(hab => hab.idRecepcionista === this.currentRecepcionistaId);
    });
  }
}
