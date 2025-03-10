import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recepcionista } from './recepcionista';
import { RecepcionistaService } from './recepcionista.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Persona } from '../persona/persona';
import { PersonaService } from '../persona/persona.service';
import { Cantones } from '../cantones/canton';
import { Provincia } from '../provincias/provincia';
import { CantonService } from '../cantones/canton.service';
import { ProvinciaService } from '../provincias/provincia.service';

@Component({
  selector: 'app-form-recepcionista',
  templateUrl: './form-recepcionista.component.html',
  styleUrl: './form-recepcionista.component.css'
})
export class FormRecepcionistaComponent implements OnInit {
  public persona: Persona = new Persona();
  public recepcionista: Recepcionista = new Recepcionista();
  public titulo: string = 'Crear Propietario';
  public cantones: Cantones[] = [];
  public cantonesFiltrados: Cantones[] = [];
  public provincias: Provincia[] = [];
  public provinciaSeleccionada: string | undefined;
  public isFilterClicked: boolean = false;
  public selectedProvinceMessage: string = 'Ninguna provincia seleccionada';
  public isProvinciaSelected: boolean = false;
  personas: Persona[] = [];

  constructor(
    private recepcionistaService: RecepcionistaService,
    private personaService: PersonaService, 
    private cantonesService: CantonService,
    private provinciasService: ProvinciaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.cargarCantones();
    this.cargarProvincias();
  }

  cargarCantones(): void {
    this.cantonesService.getCantones().subscribe((cantones) => {
      this.cantones = cantones;
      this.cantonesFiltrados = [...this.cantones];
    });
  }

  cargarProvincias(): void {
    this.provinciasService.getProvincias().subscribe((provincias) => {
      this.provincias = provincias;
    });
  }

  filtrarCantonesPorProvincia(): void {
    this.cantonesFiltrados = [];
    if (this.provinciaSeleccionada) {
      const provinciaSeleccionada = this.provincias.find(provincia => provincia.id_provincia === this.provinciaSeleccionada);
      if (provinciaSeleccionada) {
        this.selectedProvinceMessage =` Provincia ${provinciaSeleccionada.nombre} seleccionada`;
        this.isProvinciaSelected = true;
      }
      this.cantonesFiltrados = this.cantones.filter(
        (canton) => canton.id_provincia === this.provinciaSeleccionada
      );
    } else {
      this.selectedProvinceMessage = 'Ninguna provincia seleccionada';
      this.isProvinciaSelected = false;
    }
    this.isFilterClicked = true;
    setTimeout(() => {
      this.isFilterClicked = false;
    }, 1000);
  }
  
  calcularEdad(): void {
    if (this.persona.fechaNacimiento) {
      const hoy = new Date();
      const fechaNacimiento = new Date(this.persona.fechaNacimiento);
      const edadMilisegundos = hoy.getTime() - fechaNacimiento.getTime();
      const edadFecha = new Date(edadMilisegundos);
      this.persona.edad = Math.abs(edadFecha.getUTCFullYear() - 1970);
      if (this.persona.edad < 18) {
        Swal.fire('Edad no válida', 'Debe tener al menos 18 años para registrarse.', 'error');
      }
    }
  }
  validarFechaNacimiento(): boolean {
    if (!this.persona.fechaNacimiento) {
      Swal.fire('Error', 'Debe ingresar una fecha de nacimiento.', 'error');
      return false;
    }
  
    const fechaNacimiento = new Date(this.persona.fechaNacimiento);
    if (isNaN(fechaNacimiento.getTime())) {
      Swal.fire('Error', 'Fecha de nacimiento inválida.', 'error');
      return false;
    }
  
    return true;
  }

  validarFormulario(): boolean {
    if (!this.persona.nombre || !this.persona.apellido || !this.persona.fechaNacimiento) {
      Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
      return false;
    }
  
    if (!this.validarFechaNacimiento()) {
      return false;
    }
  
    if (this.persona.edad < 18) {
      Swal.fire('Edad no válida', 'Debe tener al menos 18 años para registrarse.', 'error');
      return false;
    }
  
    return true;
  }

  guardar() {
    if (!this.validarFormulario()) {
      return;
    }
  
    this.personaService.createPersona(this.persona).subscribe((personaCreada) => {
      this.recepcionista.cedula_persona = personaCreada.cedula_persona;
      this.recepcionistaService.create(this.recepcionista).subscribe((recepcionistaCreado) => {
        this.router.navigate(['/panel-recepcion']);
        Swal.fire('Propietario  guardado', `Propietario  ${this.persona.nombre} guardado con éxito`, 'success');
      }, (error) => {
        console.error('Error al guardar el Propietario : ', error);
      });
    }, (error) => {
      console.error('Error al guardar la persona: ', error);
    });
  }
  onKeyPress(event: any): void {
    const char = event.key;
    const allowedKeys = ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete', 'Escape'];
  
    if (event.ctrlKey || event.altKey || event.metaKey || allowedKeys.includes(char)) {
      return;
    }
  
    if (char === ' ') {
      event.preventDefault();
      return;
    }
  
    if (!this.validarLetras(char)) {
      event.preventDefault();
    }
  }
  
  onKeyPressNumeros(event: KeyboardEvent): void {
    const char = event.key;
    const allowedKeys = ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete', 'Escape'];
  
    if (event.ctrlKey || event.altKey || event.metaKey || allowedKeys.includes(char)) {
      return;
    }
  
    if (isNaN(Number(char))) {
      event.preventDefault();
    }
  }
  // VALIDACIONES
 

  onKeyPress2(event: any): void {
    const char = event.key;
    if (event.ctrlKey || event.altKey || event.metaKey || char === 'Enter' || char === 'Tab' || char === 'Backspace') {
      return;
    }
    if (!this.validarLetras(char) && char !== ' ') {
      event.preventDefault();
    }
  }

 

  validarLetras(char: string): boolean {
    return /^[a-zA-Z\s]*$/.test(char);
  }

  validarNumeros(char: string): boolean {
    return /^[0-9]*$/.test(char);
  }
}