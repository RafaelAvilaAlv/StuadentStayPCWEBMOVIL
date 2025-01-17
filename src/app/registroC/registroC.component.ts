
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroCService } from './registroC.service';
import { RegistroC } from './registroC';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registroC',
  templateUrl: './registroC.component.html'
})
export class RegistroCComponent implements OnInit {
  public registroC: RegistroC = new RegistroC();
  public cedulaPersona: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private registroCService: RegistroCService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.cedulaPersona = params['cedulaPersona'];
    });
  }

  registrarCliente(): void {
    this.registroC.cedula_persona = this.cedulaPersona;

    this.registroCService.registrarCliente(this.registroC).subscribe(
      () => {
        Swal.fire('Cliente registrado', 'El cliente se ha registrado con éxito.', 'success');

        this.router.navigate(['/']);
      },
      (error) => {
        //console.error('Error al registrar cliente:', error);
        Swal.fire('Error', 'Ocurrió un error al intentar registrar al cliente.', 'error');
      }
    );
  }
}
