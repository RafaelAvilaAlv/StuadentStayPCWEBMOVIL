import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { PersonaService } from '../persona/persona.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { Persona } from '../persona/persona';
import { error } from 'console';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {

  id: number = this.inicio.idUsuario;
  cedula: any = this.inicio.cedulaUser;
  public cliente: Cliente = new Cliente();
  public persona: Persona = new Persona();
  clientes: Cliente[] = [];

  constructor(
    private clienteService: ClienteService,
    private personaService: PersonaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private inicio: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarCliente();
    this.loadAllClientes();  // Llama el nuevo método para cargar todos los clientes
  }

  // Método para cargar un cliente específico
  cargarCliente(): void {
    this.clienteService.getCliente(this.id).subscribe(
      (cliente: Cliente) => {  // Definir tipo de cliente
        this.cliente = cliente;
        this.cargarPersona();
      },
      (error: any) => {  // Definir tipo de error
        console.error(error);
      }
    );
  }

  // Método para cargar todos los clientes
  loadAllClientes(): void {
    this.clienteService.getAllClientes().subscribe(
      (clientes: Cliente[]) => {  // Definir tipo de clientes
        this.clientes = clientes;
      },
      (error: any) => {  // Definir tipo de error
        console.error('Error fetching all clients', error);
      }
    );
  }

  // Método para cargar la persona asociada al cliente
  cargarPersona(): void {
    this.personaService.getPersona(this.cedula).subscribe(
      (persona: Persona) => {  // Definir tipo de persona
        this.persona = persona;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }
}
