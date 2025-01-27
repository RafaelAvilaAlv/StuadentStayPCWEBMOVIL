import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../clientes/cliente.service';
import { Cliente } from '../clientes/cliente';

@Component({
  selector: 'app-clientes-lista',
  templateUrl: './clientes-lista.component.html',
  styleUrls: ['./clientes-lista.component.css']
})
export class ClientesListaComponent implements OnInit {

  clientes: any[] = [];
  clientesFiltrados: Cliente[] = []; // Lista filtrada para búsqueda
  idClienteBuscar: string = ''; // ID a buscar

  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.cargarClientes();
    this.clienteService.getAllClientes().subscribe(data => {
      this.clientes = data;
    });
  }

  cargarClientes() {
    this.clienteService.getAllClientes().subscribe(
      (clientes) => {
        this.clientes = clientes; // Asignar los datos originales
        this.clientesFiltrados = [...this.clientes]; // Inicializar la lista filtrada
      },
      (error) => {
        console.error('Error al cargar clientes:', error);
      }
    );
  }

  buscarClienteTiempoReal() {
    if (this.idClienteBuscar.trim() === '') {
      this.clientesFiltrados = [...this.clientes]; // Si está vacío, mostrar todos
    } else {
      this.clientesFiltrados = this.clientes.filter((cliente) =>
        cliente.usuario.toLowerCase().includes(this.idClienteBuscar.toLowerCase())
      );
    }
  }

  

}
