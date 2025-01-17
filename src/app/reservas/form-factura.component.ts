import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { PersonaService } from '../persona/persona.service';
import { ReservaService } from './reserva.service';
import { EncabezadoFacturaService } from './encabezado-factura.service';
import { DetalleFacturaService } from './detalle-factura.service';
import { ClienteService } from '../clientes/cliente.service';
import { Cliente } from '../clientes/cliente';
import { Persona } from '../persona/persona';
import { Reserva } from './reserva';
import { EncabezadoFactura } from './encabezado-factura';
import { DetalleFactura } from './detalle-factura';
import { HabitacionesService } from '../habitaciones/habitaciones.service';
import { Habitaciones } from '../habitaciones/habitaciones';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-form-factura',
  templateUrl: './form-factura.component.html',
  styleUrl: './form-factura.component.css'
})
export class FormFacturaComponent implements OnInit {
  cedula_persona: any;
  constructor(private inicio: AuthService, private sevicePersona: PersonaService, private serviceReserva: ReservaService, private seviceEncabezado: EncabezadoFacturaService,
  private serviceDetalle: DetalleFacturaService, private serviceClietne: ClienteService, private serviceHabitacion: HabitacionesService) { }
  public cliente: Cliente = new Cliente();
  public persona: Persona = new Persona();
  public reserva: Reserva = new Reserva();
  public encabezado: EncabezadoFactura = new EncabezadoFactura();
  public habitacion: Habitaciones = new Habitaciones();
  public detallet: DetalleFactura = new DetalleFactura();

  ngOnInit(): void {
    this.cargar(),
      this.cargarUsuario(),
      this.cargarReserva(),
      this.cargarEncabezado(),
      this.cargarDetalle(),
      this.cargarHabitacion()
  }
  cargar(): void {

    // console.log('IDCLIENTE' + this.inicio.idUsuario)
    // console.log('IDRESERVA' + this.inicio.idReserva)
    // console.log('IDENCABEZADO' + this.inicio.idEncabezado)
    // console.log('IDETALLE' + this.inicio.idDetalle)

  }

  cargarUsuario(): void {
    this.serviceClietne.getCliente(this.inicio.idUsuario).subscribe(
      (response) => {
        //console.log('IDETALLE' + response)
        this.cliente = response;
        // console.log('IDETALLE' + this.cliente)
        this.cedula_persona = response.cedula_persona;
        this.cargarPersona();
      },
      (error) => {
        // console.error(error);
      }
    );
  }

  cargarPersona(): void {
    this.sevicePersona.getPersona(this.cedula_persona).subscribe(
      (response) => {
        // console.log('IDETALLE' + response)
        this.persona = response;
        // console.log('IDETALLE' + this.cliente)
      },
      (error) => {
        // console.error(error);
      }
    );
  }

  cargarReserva(): void {
    this.serviceReserva.getreserva(this.inicio.idReserva).subscribe(
      (response) => {
        // console.log('IDETALLE'+response)
        this.reserva = response;

      },
      (error) => {
        // console.error(error);
      }
    );
  }

  cargarEncabezado(): void {
    this.seviceEncabezado.getreserva(this.inicio.idEncabezado).subscribe(
      (response) => {
        this.encabezado = response;
      },
      (error) => {
        // console.error(error);
      }
    );
  }
  cargarDetalle(): void {
    this.serviceDetalle.getreserva(this.inicio.idDetalle).subscribe(
      (response) => {
        this.detallet = response;
      },
      (error) => {
        // console.error(error);
      }
    );
  }
  cargarHabitacion(): void {
    this.serviceHabitacion.getHabitacionesid(this.inicio.idHabitacion).subscribe(
      (response) => {
        this.habitacion = response;
      },
      (error) => {
        // console.error(error);
      }
    );
  }
  downloadPDF() {
    const DATA: any = document.getElementById('htmlData');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');

      const fileName = `${new Date().toISOString()}_zhotel.pdf`;
      doc.save(fileName);
    });
  }


}
