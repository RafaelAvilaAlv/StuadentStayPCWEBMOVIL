import { Component, OnInit } from '@angular/core';
import { ComentarioService } from '../comentarios/comentarios.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {
  comentarios: any[] = [];
  calificacion: number = 1;
  descripcion: string = '';
  isCliente: boolean = false;

  constructor(
    private comentarioService: ComentarioService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.cargarComentarios();
    this.isCliente = this.authService.isAuthenticated() && this.authService.getUserType() === 'cliente';
  }
  getEstrellas(calificacion: number): string {
    return '⭐'.repeat(calificacion);
  }
  
  

  cargarComentarios(): void {
    this.comentarioService.getComentarios().subscribe((data: any[]) => {
      this.comentarios = data;
    });
  }

  dejarComentario(): void {
    if (!this.authService.isAuthenticated()) {
      console.error("Debes estar logueado para dejar un comentario.");
      return;
    }

    const nuevoComentario = {
      cliente: {
        idCliente: this.authService.idUsuario,
        usuario: this.authService.cedulaUser
      },
      calificacion: this.calificacion,
      descripcion: this.descripcion
    };

    this.comentarioService.crearComentario(nuevoComentario).subscribe(() => {
      this.cargarComentarios();
      this.calificacion = 1;
      this.descripcion = '';
    });
  }

  eliminarComentario(idComentario: number, comentarioClienteId: number): void {
    if (this.authService.idUsuario === comentarioClienteId) {
      this.comentarioService.eliminarComentario(idComentario).subscribe(() => {
        this.cargarComentarios();
      });
    } else {
      console.error("No puedes eliminar comentarios de otros usuarios.");
    }
  }
}
