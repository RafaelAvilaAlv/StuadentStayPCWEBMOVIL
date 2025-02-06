import { Component, OnInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { Persona } from './persona';
import { Cantones } from '../cantones/canton';
import { CantonService } from '../cantones/canton.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PersonaService } from './persona.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Provincia } from '../provincias/provincia';
import { ProvinciaService } from '../provincias/provincia.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-formP',
  templateUrl: './formP.component.html',
  styleUrls: ['./formP.component.css']
})
export class FormPComponent implements OnInit {
  public persona: Persona = new Persona();
  public titulo: string = 'REGISTRO';
  public cantones: Cantones[] = [];
  public cantonesFiltrados: Cantones[] = [];
  public provincias: Provincia[] = [];
  public provinciaSeleccionada: string | undefined;
  public isFilterClicked: boolean = false;
  public selectedProvinceMessage: string = 'Ninguna provincia seleccionada';
  public isProvinciaSelected: boolean = false;

  constructor(
    private personaService: PersonaService,
    private cantonesService: CantonService,
    private provinciasService: ProvinciaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.cargarPersona();
    this.cargarCantones();
    this.cargarProvincias();
  }

  cargarPersona(): void {
    this.activatedRoute.params.subscribe(params => {
      let cedula = params['id'];
      if (cedula) {
        this.personaService.getPersona(cedula).subscribe((persona) => this.persona = persona);
      }
    });
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

  verificarCedulaYAvanzar(): void {
    // Cambiar el estado a "cargando" o algo similar para evitar que el usuario haga más clics.
    Swal.fire({
      title: 'Verificando...',
      text: 'Verificando la cédula...',
      allowOutsideClick: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    this.personaService.verificarCedulaExistente(this.persona.cedula_persona).subscribe(
      (existe) => {
        Swal.close(); // Cerrar el loader

        if (existe) {
          // Mostrar un mensaje de error si la cédula ya está registrada.
          Swal.fire({
            icon: 'error',
            title: 'Cédula ya existe',
            text: 'La cédula ingresada ya está registrada. Por favor, ingrese una cédula diferente.',
          });
        } else {
          // Si la cédula no existe, entonces podemos continuar con el proceso
          this.crearEditarPersona();
        }
      },
      (error) => {
        Swal.close(); // Cerrar el loader en caso de error
        console.error('Error al verificar la cédula', error);
        Swal.fire('Error', 'Hubo un error al verificar la cédula. Intente nuevamente.', 'error');
      }
    );
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

  crearEditarPersona(): void {
    this.personaService.createPersona(this.persona).subscribe(
      (persona) => {
        this.router.navigate(['/persona']);
        Swal.fire('Persona guardada', `Persona ${persona.nombre} guardada con éxito`, 'success');
      },
      (error) => {
        //console.error('Error al crear persona:', error);
        Swal.fire('Error', 'Ocurrió un error al intentar guardar la persona.', 'error');
      }
    );
  }

  irARegistroC(): void {
    this.personaService.createPersona(this.persona).subscribe(
      (persona) => {
        Swal.fire({
          icon: 'success',
          showConfirmButton: false,
          timer: 900,
        });
        this.router.navigate(['/registroC/form', persona.cedula_persona]);
      },
      (error) => {
        //console.error('Error al crear persona:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al intentar guardar sus datos. Por favor, verifique los datos o campos incompletos.',
          confirmButtonText: 'OK',
        });
      }
    );
  }

  calcularEdad(): void {
    if (this.persona.fechaNacimiento) {
      const hoy = new Date();
      const fechaNacimiento = new Date(this.persona.fechaNacimiento);
      const edadMilisegundos = hoy.getTime() - fechaNacimiento.getTime();
      const edadFecha = new Date(edadMilisegundos);
      this.persona.edad = Math.abs(edadFecha.getUTCFullYear() - 1970);
  
      // Verificar si la persona tiene menos de 18 años
      if (this.persona.edad < 18) {
        Swal.fire('Edad no válida', 'Debe tener al menos 18 años para registrarse.', 'error');
      }
    }
  }

  // VALIDACIONES
  onKeyPress(event: any): void {
    const char = event.key;

    // No permitir teclas Ctrl, Alt, Meta, Enter, Tab o Backspace
    if (event.ctrlKey || event.altKey || event.metaKey || char === 'Enter' || char === 'Tab' || char === 'Backspace') {
      return;
    }

    // No permitir espacios
    if (char === ' ') {
      event.preventDefault();
      return;
    }

    // Validar solo letras (y espacios si lo deseas)
    if (!this.validarLetras(char)) {
      event.preventDefault();
    }
  }

  onKeyPress2(event: any): void {
    const char = event.key;

    // No permitir teclas Ctrl, Alt, Meta, Enter, Tab o Backspace
    if (event.ctrlKey || event.altKey || event.metaKey || char === 'Enter' || char === 'Tab' || char === 'Backspace') {
      return;
    }

    // Validar solo letras (y permitir espacios)
    if (!this.validarLetras(char) && char !== ' ') {
      event.preventDefault();
    }
  }

  onKeyPressNumeros(event: KeyboardEvent): void {
    const char = event.key;
    if (event.ctrlKey || event.altKey || event.metaKey || char === 'Enter' || char === 'Tab' || char === 'Backspace') {
      return;
    }
    if (!/^[0-9]*$/.test(char)) {
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
