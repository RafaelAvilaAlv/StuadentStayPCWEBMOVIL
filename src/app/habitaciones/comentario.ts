import { Cliente } from "../clientes/cliente";  // Importar la clase Cliente

export class Comentario {
    idComentario?: number;
    comentario: string;
    habitacionId: number;
    cliente: Cliente;  // Cambiar clienteId a cliente (objeto Cliente)

    constructor(comentario: string, habitacionId: number, cliente: Cliente, idComentario?: number) {
      this.comentario = comentario;
      this.habitacionId = habitacionId;
      this.cliente = cliente;  // Asignar un objeto Cliente en lugar de un ID
      if (idComentario) {
        this.idComentario = idComentario;
      }
    }
}
