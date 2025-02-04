import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { PersonaService } from '../persona/persona.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { Persona } from '../persona/persona';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {
  id: number | null = null;
  cedula: string | null = null;
  public cliente: Cliente = new Cliente();
  public persona: Persona = new Persona();
  clientes: Cliente[] = [];

  constructor(
    private clienteService: ClienteService,
    private personaService: PersonaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.id = this.authService.idUsuario ?? null;
    this.cedula = this.authService.cedulaUser ?? null;

    if (this.id) {
      this.cargarCliente();
    } else {
      console.error('ID de usuario no definido en AuthService');
    }

    this.loadAllClientes();
  }

  cargarCliente(): void {
    if (!this.id) return;

    this.clienteService.getCliente(this.id).subscribe({
      next: (cliente: Cliente) => {
        this.cliente = cliente;
        if (this.cedula) {
          this.cargarPersona();
        }
      },
      error: (error) => {
        console.error('Error al obtener cliente:', error);
      },
    });
  }

  loadAllClientes(): void {
    this.clienteService.getAllClientes().subscribe({
      next: (clientes: Cliente[]) => {
        this.clientes = clientes;
      },
      error: (error) => {
        console.error('Error al obtener todos los clientes:', error);
      },
    });
  }

  cargarPersona(): void {
    if (!this.cedula) return;

    this.personaService.getPersona(this.cedula).subscribe({
      next: (persona: Persona) => {
        this.persona = persona;
      },
      error: (error) => {
        console.error('Error al obtener persona:', error);
      },
    });
  }
}
