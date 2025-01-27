import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '../clientes/cliente';

@Component({
  selector: 'app-cliente-detalle',
  templateUrl: './cliente-detalle.component.html',
})
export class ClienteDetalleComponent implements OnInit {

  cliente: Cliente = new Cliente();

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const idCliente = +this.route.snapshot.paramMap.get('idCliente')!;  // Obtiene el idCliente de la URL
    this.clienteService.getCliente(idCliente).subscribe(cliente => {
      this.cliente = cliente;
    });
  }
}
