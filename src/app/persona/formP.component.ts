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
  styleUrl: './formP.component.css'
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
        Swal.fire('Persona guardada', `Persona ${persona.nombre} guardada con éxito.`, 'success');
      },
      (error) => {
        Swal.fire('Error', 'Ocurrió un error al intentar guardar la persona.', 'error');
      }
    );
  }
  

  irARegistroC(): void {

    // Validación de la cédula ecuatoriana
  if (!this.validarCedula(this.persona.cedula_persona)) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'La cédula ecuatoriana ingresada no es válida.',
      confirmButtonText: 'OK',
    });
    return; // Detener el proceso si la cédula no es válida
  }


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
        // Verifica si el error indica que la cédula ya está registrada
        if (error.status === 409) { // Supongamos que el error 409 indica conflicto (cedula ya registrada)
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La cédula ya está registrada. No se puede crear una nueva persona con la misma cédula.',
            confirmButtonText: 'OK',
          });
        } else {
          // Para otros errores
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al intentar guardar sus datos. Por favor, datos erróneos o campos incompletos.',
            confirmButtonText: 'OK',
          });
        }
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

onKeyPress(event: any): void {
  const inputElement = event.target;
  const currentValue = inputElement.value;

  // Permitir la tecla "Backspace" y otras teclas de control
  if (event.key === 'Backspace') {
    return; // Permite el backspace sin restricciones
  }

  // Verificar si la tecla presionada es una letra válida y si no supera los 15 caracteres, también bloquear espacios
  if (!this.validarLetras(event.key) || currentValue.length >= 15 || event.key === ' ') {
    event.preventDefault(); // Bloquear la entrada si no es válida, si excede los 15 caracteres o si es un espacio
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

  onTelefonoChange(value: string): void {
    if (!value.startsWith('+593')) {
      this.persona.telefono = '+593' + value; // Siempre añadir el prefijo si no está presente
    } else {
      this.persona.telefono = value;
    }
  }
  

  validarLetras(char: string): boolean {

    return /^[a-zA-Z\s]*$/.test(char);
  }
  validarNumeros(char: string): boolean {
    return /^[0-9]*$/.test(char);
  }

  validarCedula(cedula: string): boolean {
    // Eliminar espacios y asegurarse de que la cédula tenga 10 dígitos
    cedula = cedula.trim();
    if (cedula.length !== 10 || !/^\d{10}$/.test(cedula)) {
      Swal.fire('Error', 'La cédula debe tener exactamente 10 dígitos.', 'error');
      return false;
    }
  
    // Algoritmo de validación para la cédula
    const provincia = parseInt(cedula.substring(0, 2), 10);
    const digitoVerificador = parseInt(cedula.charAt(9), 10);
  
    // La provincia debe estar entre 1 y 24 para ser ecuatoriana
    if (provincia < 1 || provincia > 24) {
      Swal.fire('Error', 'La cédula no corresponde a una provincia ecuatoriana válida.', 'error');
      return false;
    }
  
    // Validación del dígito verificador utilizando el algoritmo oficial
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let digito = parseInt(cedula.charAt(i), 10);
      if (i % 2 === 0) {
        digito *= 2;
        if (digito > 9) {
          digito -= 9;
        }
      }
      suma += digito;
    }
  
    const digitoCalculado = (10 - (suma % 10)) % 10;
  
    if (digitoVerificador !== digitoCalculado) {
      Swal.fire('Error', 'El dígito verificador de la cédula no es válido.', 'error');
      return false;
    }
  
    return true;
  }
  
  

}
