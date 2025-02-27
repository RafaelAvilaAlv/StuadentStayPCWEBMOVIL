// user.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usuario: string | null = null; // Para almacenar el usuario persistente

  constructor() {}

  // Establecer el usuario
  setUsuario(usuario: string): void {
    this.usuario = usuario;
  }

  // Obtener el usuario
  getUsuario(): string | null {
    return this.usuario;
  }

  // Limpiar el usuario (cuando cierre sesión, por ejemplo)
  clearUsuario(): void {
    this.usuario = null;
  }
}
