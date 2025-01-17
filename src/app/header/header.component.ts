import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { AppComponent } from '../app.component';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private inicio: AuthService, private router: Router) { }
  apagar() {
    this.router.navigate(['./login']);
    this.inicio.logout()
  }

  usuario: number = this.inicio.idUsuario;
  tipUser: any = this.inicio.tipoUser;

  abrirFormularioPersona(): void {
    this.router.navigate(['/persona/form']);
  }

}
