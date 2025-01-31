import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../clientes/cliente.service';
import { Cliente } from '../clientes/cliente';
import { PersonaService } from '../persona/persona.service';

@Component({
  selector: 'app-clientes-lista',
  templateUrl: './clientes-lista.component.html',
  styleUrls: ['./clientes-lista.component.css']
})
export class ClientesListaComponent implements OnInit {

  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  idClienteBuscar: string = '';

  constructor(
    private clienteService: ClienteService,
    private personaService: PersonaService
  ) { }

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clienteService.getAllClientes().subscribe(
      (clientes) => {
        this.clientes = clientes.map(cliente => ({
          ...cliente,
          persona: cliente.persona || {}  // Inicializa persona si es undefined
        }));

        this.clientes.forEach(cliente => {
          this.personaService.getPersona(cliente.cedula_persona).subscribe(
            (persona) => cliente.persona = persona,
            (error) => console.error('Error al cargar persona:', error)
          );
        });

        this.clientesFiltrados = [...this.clientes];
      },
      (error) => console.error('Error al cargar clientes:', error)
    );
  }

  buscarClienteTiempoReal() {
    this.clientesFiltrados = this.idClienteBuscar.trim() === '' 
      ? [...this.clientes]
      : this.clientes.filter(cliente =>
          cliente.usuario.toLowerCase().includes(this.idClienteBuscar.toLowerCase())
        );
  }
}
