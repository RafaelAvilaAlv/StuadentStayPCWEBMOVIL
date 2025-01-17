import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Cliente } from '../clientes/cliente';
import { ClienteService } from '../clientes/cliente.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppComponent } from '../app.component';

import { Administrador } from '../administrador/administrador';
import { Recepcionista } from '../recepcionista/recepcionista';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public searchForm: FormGroup;
  logeado: any;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private inicio: AuthService,
  ) {
    this.inicio.isLoggedIn = false;
    this.inicio.tipoUser = '';
    this.searchForm = this.fb.group({
      usuario: [''],
      contraneusu: ['']
    });
  }


  onSubmit() {

    const usuario = this.searchForm.value.usuario;
    const contraneusu = this.searchForm.value.contraneusu;

    this.loginService.buscarCliente(usuario).subscribe(
      (result) => {
        if (Array.isArray(result) && result.length > 0) {
          const clientesEncontrados = result as Cliente[];
          const clienteEncontrado = clientesEncontrados.find(cliente => cliente.contrasena === contraneusu);
          if (clienteEncontrado) {

            this.inicio.idUsuario = clienteEncontrado.idCliente;
            this.router.navigate(['./carrucel']);
            this.inicio.login();
            this.inicio.setCliente();
            this.logeado = 'cliente'
            this.inicio.setCedula(clienteEncontrado.cedula_persona);
            //console.log(this.inicio.idUsuario);
            //console.log(this.inicio.tipoUser);
            //console.log(this.inicio.cedulaUser);
            Swal.fire(`Bienvenid@ ${usuario}`, 'Inicio de sesion correcto', 'success');

          } else {
            // La contraseña no coincide con ninguna en el array
            Swal.fire('Contraseña o usuario incorrectos', 'Cliente', 'error');
          }
        }
      },
      (error) => {
        this.loginService.buscarAdmin(usuario).subscribe(
          (resultAdmin) => {
            if (Array.isArray(resultAdmin) && resultAdmin.length > 0) {
              const adminEncontrados = resultAdmin as Administrador[];
              const adminEncontrado = adminEncontrados.find(admin => admin.contrasena === contraneusu);
              if (adminEncontrado) {
                this.inicio.idUsuario = adminEncontrado.idAdmin;
                this.inicio.setCedula(adminEncontrado.cedula_persona);
                this.router.navigate(['./carrucel']);
                this.inicio.login();
                this.inicio.setAdmin();
                //console.log(this.inicio.tipoUser);
                Swal.fire(`Bienvenid@ ${usuario}`, 'Inicio de sesion correcto', 'success');
              } else {
                Swal.fire('Contraseña  incorrectos', 'Administrador', 'error');
              }

            }
          },
          (error) => {
            this.loginService.buscarRecep(usuario).subscribe(
              (resultRecep) => {
                if (Array.isArray(resultRecep) && resultRecep.length > 0) {
                  const recepEcontrados = resultRecep as Recepcionista[];
                  const recepEncontrado = recepEcontrados.find(recep => recep.contrasena === contraneusu);
                  if (recepEncontrado) {
                    this.inicio.idUsuario = recepEncontrado.idRecepcionista ;
                    this.inicio.setCedula(recepEncontrado.cedula_persona);
                    this.router.navigate(['./carrucel']);
                    this.inicio.login();
                    this.inicio.setRecep();
                    //console.log(this.inicio.tipoUser);
                    Swal.fire(`Bienvenid@ ${usuario}`, 'Inicio de sesion correcto', 'success');
                  } else {
                    Swal.fire('Contraseña  incorrectos', 'Recepcionista', 'error');
                  }

                }
              },
              (error) => {
                Swal.fire('Usuario incorrectos', 'Usuario', 'error');
              }
            );

          }
        );
      }
    );
  }

  redirectA() {

    this.router.navigate(['/persona/form']);
  }

}
