import { Persona } from "../persona/persona";

export class Cliente {
  idCliente: number | null = null; // Puede ser null si no está definido
  usuario: string = '';
  contrasena: string = '';
  cedula_persona: string = '';
  foto: string = '';
  persona: Persona = new Persona(); // Relación con la clase Persona

  constructor(
    idCliente?: number,
    usuario?: string,
    contrasena?: string,
    cedula_persona?: string,
    foto?: string,
    persona?: Persona
  ) {
    this.idCliente = idCliente ?? null;
    this.usuario = usuario ?? '';
    this.contrasena = contrasena ?? '';
    this.cedula_persona = cedula_persona ?? '';
    this.foto = foto ?? '';
    this.persona = persona ?? new Persona(); // Si no se pasa persona, se crea una nueva
  }
}
