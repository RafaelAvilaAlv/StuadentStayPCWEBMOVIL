import { Persona } from "../persona/persona";

export class Cliente {
    idCliente:any;
    usuario: string = '';
    contrasena: string = '';
    cedula_persona: string = '';
    foto: string = '';

    persona: Persona = new Persona();  


    constructor() {
        this.idCliente = '';
        this.usuario = '';
        this.contrasena = '';
        this.cedula_persona = '';
        this.foto = '';
        this.persona = new Persona();  // Inicializar la propiedad persona
    }
}