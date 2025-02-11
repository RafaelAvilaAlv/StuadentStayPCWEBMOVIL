
import { Cantones } from "../cantones/canton";

export class Persona {
  cedula_persona!: string;
  nombre!: string;
  nombre2!: string;
  apellido!: string;
  apellido2!: string;
  genero!: string;
  telefono!: string;
  direccion!: string;
  edad!: number;
  id_canton!: string;
  fechaNacimiento!: Date;
  cantones?: Cantones[];
  
  // Nuevos atributos para contacto de emergencia
  nombreContactoEmergencia!: string;
  telefonoContactoEmergencia!: string;
  parentescoContactoEmergencia!: string;

   // Nuevos atributos para contacto de emergencia2
   nombreContactoEmergencia2!: string;
   telefonoContactoEmergencia2!: string;
   parentescoContactoEmergencia2!: string;

  constructor() {
    this.cantones = [];
    this.nombre = '';
    this.apellido = '';
    this.edad = 0;
    
  }
}