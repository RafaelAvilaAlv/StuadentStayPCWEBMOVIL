import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UserService } from './UserService';

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
    private userService: UserService, // Inyecta el UserService
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
          const clientesEncontrados = result;
          const clienteEncontrado = clientesEncontrados.find(cliente => cliente.contrasena === contraneusu);
          if (clienteEncontrado) {

            this.inicio.idUsuario = clienteEncontrado.idCliente;
            this.userService.setUsuario(usuario);  // Guarda el usuario en el UserService
            console.log('Usuario guardado:', this.userService.getUsuario()); // Muestra el usuario guardado en la consola
            this.router.navigate(['./carrucel']);
            this.inicio.login();
            this.inicio.setCliente();
            this.logeado = 'cliente';
            this.inicio.setCedula(clienteEncontrado.cedula_persona);
            Swal.fire(`Bienvenid@ ${usuario}`, 'Inicio de sesión correcto', 'success');

          } else {
            Swal.fire('Contraseña o usuario incorrectos', 'Cliente', 'error' );
          }
        }
      },
      (error) => {
        this.loginService.buscarAdmin(usuario).subscribe(
          (resultAdmin) => {
            if (Array.isArray(resultAdmin) && resultAdmin.length > 0) {
              const adminEncontrados = resultAdmin;
              const adminEncontrado = adminEncontrados.find(admin => admin.contrasena === contraneusu);
              if (adminEncontrado) {
                this.inicio.idUsuario = adminEncontrado.idAdmin;
                this.inicio.setCedula(adminEncontrado.cedula_persona);
                this.userService.setUsuario(usuario);  // Guarda el usuario en el UserService
                this.router.navigate(['./carrucel']);
                this.inicio.login();
                this.inicio.setAdmin();
                Swal.fire(`Bienvenid@ ${usuario}`, 'Inicio de sesión correcto', 'success');
              } else {
                Swal.fire('Contraseña incorrecta', 'Administrador', 'error');
              }
            }
          },
          (error) => {
            this.loginService.buscarRecep(usuario).subscribe(
              (resultRecep) => {
                if (Array.isArray(resultRecep) && resultRecep.length > 0) {
                  const recepEcontrados = resultRecep;
                  const recepEncontrado = recepEcontrados.find(recep => recep.contrasena === contraneusu);
                  if (recepEncontrado) {
                    this.inicio.idUsuario = recepEncontrado.idRecepcionista;
                    this.inicio.setCedula(recepEncontrado.cedula_persona);
                    this.userService.setUsuario(usuario);  // Guarda el usuario en el UserService
                    this.router.navigate(['./carrucel']);
                    this.inicio.login();
                    this.inicio.setRecep();
                    Swal.fire(`Bienvenid@ ${usuario}`, 'Inicio de sesión correcto', 'success');
                  } else {
                    Swal.fire('Contraseña incorrecta', 'Recepcionista', 'error');
                  }
                }
              },
              (error) => {
                Swal.fire('Usuario incorrecto', 'Usuario', 'error');
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
