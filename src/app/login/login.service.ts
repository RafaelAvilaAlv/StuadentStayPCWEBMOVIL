// login.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../clientes/cliente';
import { Administrador } from '../administrador/administrador';
import { Recepcionista } from '../recepcionista/recepcionista';
import { UserService } from './UserService';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private urlEndPoint: string = "https://localhost:8080/api";
  private urlEndPoint1: string = "https://localhost:8080/api";
  private urlEndPoint2: string = "https://localhost:8080/api";

  constructor(
    private http: HttpClient,
    private userService: UserService  // Inyectar el servicio UserService
  ) { }

  buscarCliente(usuario: string): Observable<Cliente | Cliente[]> {
    const url = `${this.urlEndPoint}/usuario/${usuario}`;
    return this.http.get<Cliente | Cliente[]>(url);
  }

  buscarAdmin(usuario: string): Observable<Administrador | Administrador[]> {
    const url = `${this.urlEndPoint1}/usuario/${usuario}`;
    return this.http.get<Administrador | Administrador[]>(url);
  }

  buscarRecep(usuario: string): Observable<Recepcionista | Recepcionista[]> {
    const url = `${this.urlEndPoint2}/usuario/${usuario}`;
    return this.http.get<Recepcionista | Recepcionista[]>(url);
  }

  // Método para almacenar el usuario en el servicio UserService después de un inicio de sesión exitoso
  setUsuarioGlobal(usuario: string): void {
    this.userService.setUsuario(usuario);  // Usar el servicio para almacenar el usuario
  }
}
