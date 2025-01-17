
import { Cantones } from "../cantones/canton";

export class Provincia {
  id_provincia: string;
  nombre: string;
  cantones?: Cantones[];

  constructor(id_provincia: string, nombre: string, cantones?: Cantones[]) {
    this.id_provincia = id_provincia;
    this.nombre = nombre;
    this.cantones = cantones;
  }
}
