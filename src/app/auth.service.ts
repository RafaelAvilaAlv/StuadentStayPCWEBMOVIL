import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  idUsuario: any;
  cedulaUser: any;
  tipoUser: any;
  idReserva: any;
  idEncabezado: any;
  idDetalle: any;
  idHabitacion: any;

  constructor() {
    try {
      if (typeof localStorage !== 'undefined') {
        this.loadUserFromLocalStorage();
      } else {
        console.error('localStorage no está disponible en este entorno.');
      }
    } catch (error) {
      console.error('Ocurrió un error:', error);
    }
  }

  loadUserFromLocalStorage() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.isLoggedIn = user.isLoggedIn || false;
    this.idUsuario = user.idUsuario || null;
    this.cedulaUser = user.cedulaUser || null;
    this.tipoUser = user.tipoUser || null;
    this.idReserva = user.idReserva || null;
    this.idEncabezado = user.idEncabezado || null;
    this.idDetalle = user.idDetalle || null;
    this.idHabitacion = user.idHabitacion || null;
  }

  saveUserToLocalStorage() {
    localStorage.setItem('user', JSON.stringify({
      isLoggedIn: this.isLoggedIn,
      idUsuario: this.idUsuario,
      cedulaUser: this.cedulaUser,
      tipoUser: this.tipoUser,
      idReserva: this.idReserva,
      idEncabezado: this.idEncabezado,
      idDetalle: this.idDetalle,
      idHabitacion: this.idHabitacion
    }));
  }

  setCliente() {
    this.tipoUser = 'cliente';
    this.saveUserToLocalStorage();
  }

  setRecep() {
    this.tipoUser = 'recep';
    this.saveUserToLocalStorage();
  }

  setAdmin() {
    this.tipoUser = 'admin';
    this.saveUserToLocalStorage();
  }

  login() {
    this.isLoggedIn = true;
    this.saveUserToLocalStorage();
  }

  logout() {
    this.isLoggedIn = false;
    this.saveUserToLocalStorage();
  }

  setCedula(cedula: any) {
    this.cedulaUser = cedula;
    this.saveUserToLocalStorage();
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  getUserType(): string {
    return this.tipoUser;
  }
}
