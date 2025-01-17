import { Component } from '@angular/core';
import { Administrador } from './administrador';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrl: './administrador.component.css'
})
export class AdministradorComponent {
  public admin: Administrador = new Administrador()
  administrador: Administrador[] = [];
}
