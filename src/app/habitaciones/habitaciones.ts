export class Habitaciones {
    idHabitaciones: number = 0;
    precio!: number;
    nHabitacion!: number;
    nPiso!: number;
    idCategoria!: number;
    foto: string = '';
    foto1?: string = '';
    foto2?: string = '';
    descriphabi: string = '';
    estado: string = '';
    latitud: number = 0;
    longitud: number = 0;
    idRecepcionista: number = 0;
    mostrarFotos?: boolean;
    titulo_anuncio: string = '';
  
    // 🔹 Propiedades agregadas:
   // mostrarComentarios: boolean = false; // Estado inicial en "oculto"
    //comentarios: { usuario: string, mensaje: string }[] = []; // Asegúrate de que esto esté correctamente inicializado

    // Modificar la propiedad comentarios para usar nombreCliente y texto
  //comentarios: { nombreCliente: string; texto: string }[] = [];


  // Propiedades agregadas
  mostrarComentarios: boolean = false;
  comentarios: { nombreCliente: string, texto: string }[] = [];  // 
  }
  