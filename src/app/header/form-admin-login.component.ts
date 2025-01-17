
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-form-admin-login',
  templateUrl: './form-admin-login.component.html',
  styleUrl: './form-admin-login.component.css'
})
export class FormAdminLoginComponent {

  @Output() recargarHabitaciones = new EventEmitter<void>();

  constructor(private inicio: AuthService, private router: Router) { }
  apagar() {
    this.router.navigate(['./login']);
    this.inicio.logout()
  }

  onClickRecargarHabitaciones(): void {

    this.recargarHabitaciones.emit();
  }

}
