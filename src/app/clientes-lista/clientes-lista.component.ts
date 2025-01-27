import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../clientes/cliente.service';
import { Cliente } from '../clientes/cliente';
import { PersonaService } from '../persona/persona.service';  // Importa el servicio Persona

@Component({
  selector: 'app-clientes-lista',
  templateUrl: './clientes-lista.component.html',
  styleUrls: ['./clientes-lista.component.css']
})
export class ClientesListaComponent implements OnInit {

  clientes: Cliente[] = []; // Lista original de clientes
  clientesFiltrados: Cliente[] = []; // Lista filtrada para búsqueda
  idClienteBuscar: string = ''; // ID a buscar

  constructor(
    private clienteService: ClienteService,
    private personaService: PersonaService  // Inyecta el servicio Persona
  ) { }

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clienteService.getAllClientes().subscribe(
      (clientes) => {
        this.clientes = clientes;

        // Cargar los datos de las personas asociadas
        this.clientes.forEach(cliente => {
          this.personaService.getPersona(cliente.cedula_persona).subscribe(
            (persona) => {
              // Asigna los datos de persona al cliente
              cliente.persona = persona;  // Asumimos que cliente tiene una propiedad 'persona' para almacenar los datos
            },
            (error) => {
              console.error('Error al cargar persona:', error);
            }
          );
        });

        this.clientesFiltrados = [...this.clientes];
      },
      (error) => {
        console.error('Error al cargar clientes:', error);
      }
    );
  }

  buscarClienteTiempoReal() {
    if (this.idClienteBuscar.trim() === '') {
      this.clientesFiltrados = [...this.clientes];
    } else {
      this.clientesFiltrados = this.clientes.filter((cliente) =>
        cliente.usuario.toLowerCase().includes(this.idClienteBuscar.toLowerCase())
      );
    }
  }
}
