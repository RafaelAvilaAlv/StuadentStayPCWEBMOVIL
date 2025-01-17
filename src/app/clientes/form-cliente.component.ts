import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Persona } from '../persona/persona';
import { PersonaService } from '../persona/persona.service';
import { AppComponent } from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { error } from 'console';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html'
})
export class FormClienteComponent implements OnInit{

  previewImage: string | ArrayBuffer = '';
  public cliente:Cliente = new Cliente()
  public persona: Persona = new Persona()
  public title:string = "Editar Usuario"
  id:number= this.inicio.idUsuario;
  cedula:any = this.inicio.cedulaUser;

  constructor(private clienteService:ClienteService, 
    private personaService:PersonaService,
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private inicio: AuthService) {}
  
  ngOnInit(): void {
    this.cargarCliente()
  }

  cargarCliente(): void {
    this.clienteService.getCliente(this.id).subscribe(
      (cliente) => {
        this.cliente = cliente;
        this.cargarPersona()
      },
      (error) => {
        //console.error(error);
      }
    );
  } 

  cargarPersona(): void{
    this.personaService.getPersona(this.cedula).subscribe(
      (persona) => {
        this.persona = persona;
      },
      (error) => {
       // console.error(error);
      }
    )
  }

  public editU(): void{
    this.clienteService.edit(this.cliente)
    .subscribe(cliente => {
        this.router.navigate(['/clientes'])
        Swal.fire('Usuario guardado', `Usuario ${cliente.usuario} guardado con exito`, 'success')
      }
    )
  }

  public editPer(): void{
    this.personaService.updatePersona(this.persona)
    .subscribe(persona => {}
    )
  }

  onFileSelected(event: any):void{
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.previewImage = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  convertToBase64(): void {
    if (this.previewImage) {
      const base64String = this.previewImage.toString();
     // console.log(base64String);

      this.cliente.foto = base64String;
    }
  }
}