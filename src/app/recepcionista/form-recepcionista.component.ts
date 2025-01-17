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
  public titulo: string = 'Crear Recepcionista';
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
        this.selectedProvinceMessage = `Provincia ${provinciaSeleccionada.nombre} seleccionada`;
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
      if (this.persona.edad < 5 || this.persona.edad > 100) {
      }
    }
  }

  guardar() {
    this.personaService.createPersona(this.persona).subscribe((personaCreada) => {
      this.recepcionista.cedula_persona = personaCreada.cedula_persona;
      this.recepcionistaService.create(this.recepcionista).subscribe((recepcionistaCreado) => {
      this.router.navigate(['/panel-recepcion'])
      Swal.fire('Recepcionista guardado', `Recepcionista ${this.persona.nombre} Guardado con exito`, 'success')
      //Swal.fire('Recepcionista', `Recepcionista Guardado con exito`, 'success')
      }, (error) => {
        console.error('Error al guardar el recepcionista: ', error);
      });
    }, (error) => {
      console.error('Error al guardar la persona: ', error);
    });
  }
}
