import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-formrrcepcionista',
  templateUrl: './formrrcepcionista.component.html',
  styleUrl: './formrrcepcionista.component.css'
})
export class FormrrcepcionistaComponent {
  constructor(private inicio: AuthService, private router: Router) { }
  apagar() {
    this.router.navigate(['./login']);
    this.inicio.logout()
  }

}
