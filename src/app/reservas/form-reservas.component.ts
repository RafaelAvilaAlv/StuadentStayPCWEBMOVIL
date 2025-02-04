import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reserva } from './reserva';
import { ReservaService } from './reserva.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Habitaciones } from '../habitaciones/habitaciones';
import { HabitacionesService } from '../habitaciones/habitaciones.service';
import { EncabezadoFactura } from './encabezado-factura';
import { EncabezadoFacturaService } from './encabezado-factura.service';
import { DetalleFactura } from './detalle-factura';
import { DetalleFacturaService } from './detalle-factura.service';
import { AppComponent } from '../app.component';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs';
import { error } from 'console';
import { AuthService } from '../auth.service';
import { MetodopagoService } from './metodopago.service';
@Component({
  selector: 'app-form-reservas',
  templateUrl: './form-reservas.component.html',
  styleUrl: './form-reservas.component.css'
})
export class FormReservasComponent implements OnInit {
  idCliente: number = this.inicio.idUsuario;
  idCli2: number = 0;
  fechaEntrada: string = '';
  fechaSalida: string = '';
  diferenciadias: number = 0;
  idReserva: number = 0;
  idEncabezado: number = 0;
  idHabitaciones: number = 0;
  metodoPago: number = 0;
  dias: number = 0;
  total: number = 0;
  fechareserva: Date = new Date();
  preciohabi: number = 0;
  opciones: number[] = [1, 2, 3, 4];
  opcionSeleccionada: number = 0;
  pagoOpciones: string[] = [];
  pagoSeleccionado: string = '';
  form!: FormGroup;
  btnFactura: boolean = false;
  public reserva: Reserva = new Reserva()
  public encabezado: EncabezadoFactura = new EncabezadoFactura()
  public detalle: DetalleFactura = new DetalleFactura()
  public habitaciones: Habitaciones = new Habitaciones()
  constructor(private reservaService: ReservaService, private habitacionesService: HabitacionesService, private encabezadoService: EncabezadoFacturaService, private detalleService: DetalleFacturaService, private router: Router,
    private activatedRoute: ActivatedRoute, private inicio: AuthService, private fb: FormBuilder, private pagoService: MetodopagoService) {

  }

  ngOnInit(): void {
    this.cargarhabitacion()
    this.cargarMetodopago()
    // console.log('Id cliente en reserva', this.idCliente);
    // console.log('Id cliente habitaciones', this.idHabitaciones);
    this.form = this.fb.group({
      dias1: ['', Validators.required],
      fechafin: ['', Validators.required],
      fechaini: ['', Validators.required],
      numeroPer: [0, this.validateSelectedOption],
      total: ['', Validators.required],
      metodoPago: ['', Validators.required]
    });

  }

  validateSelectedOption(control: FormGroup) {
    if (control.value === 0) {
      return { 'required': true };
    }
    return null;
  }

  cargarhabitacion(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.habitacionesService.getHabitacionesid(id).subscribe(
          (result) => {
            if (result) {
              this.habitaciones = result;
              this.idHabitaciones = result.idHabitaciones;
              // console.log('Id cliente habitaciones antes del método:', this.idHabitaciones);
              this.reserva.idHabitaciones = result.idHabitaciones;
              this.reserva.idCliente = this.idCliente;
              this.reserva.idRecepcionista = 1;
              this.preciohabi = result.precio;
              this.inicio.idHabitacion = result.idHabitaciones;
              // console.log('Precio de la habitación:', this.preciohabi);
            } else {
              // console.error('No se encontró la habitación con ID:', id);

            }
          },
          (error) => {
            // console.error('Error al obtener información de la habitación:', error);
          }
        );
      }
    })

  }

  create() {
    if (this.form.valid) {
      this.reserva.nPersona = this.opcionSeleccionada;
      this.reserva.estado = "Pendiente";
      this.reservaService.create(this.reserva).subscribe(
        response => {
          this.idReserva = response.idReserva;
          this.inicio.idReserva = response.idReserva;
          this.createEncabezado();
          //this.router.navigate(['/habitaciones'])
          this.actualizarEstado();
          Swal.fire('Reserva creada', `guardado con éxito`, 'success')
          this.btnFactura = true;
        }, (error) => {
          // console.error('Error al guardar la reserva:', error);
        }
      );
      // console.log(this.reservaService.create(this.reserva));
    } else {
      Swal.fire('Llene los campos por favor', `Llenar campos...`, 'error')
    }
  }

  createEncabezado() {
    this.encabezado.idCliente = this.idCliente;
    this.encabezado.idReserva = this.idReserva;
    this.encabezado.total = this.total;
    this.encabezado.fechaFactura = this.fechareserva;
    this.encabezadoService.create(this.encabezado).subscribe(
      response => {
        this.idEncabezado = response.idEncabezado;
        this.inicio.idEncabezado = response.idEncabezado;
        // console.log('ENCABEZADO CREADO', this.idEncabezado);
        this.createDetalle();
      }, (error) => {
        // console.error('Error al guardar la encabezado:', error);
      }
    );
    //console.log(this.reservaService.create(this.reserva));
  }

  createDetalle() {
    this.detalle.idEncabezado = this.idEncabezado;
    this.detalle.subTotal = this.preciohabi;
    this.detalleService.create(this.detalle).subscribe(
      response => {
        this.inicio.idDetalle = response.idDetalleFac;
        // console.log('DETALLE CREADO');
      }, (error) => {
        // console.error('Error al guardar la detalle:', error);
      }
    );
    //console.log(this.reservaService.create(this.reserva));
  }

  calcularDiferenciaDeDias() {
    // console.log(this.fechaEntrada)
    // console.log(this.fechaSalida)

    if (this.fechaEntrada.length != 0 && this.fechaSalida.length != 0) {
      const fechaInicio = new Date(this.fechaEntrada);
      const fechaFin = new Date(this.fechaSalida);
      this.reserva.fechaEntrada = fechaInicio.toJSON().split('T')[0];
      this.reserva.fechaSalida = fechaFin.toJSON().split('T')[0];
      const diferenciaMs = fechaFin.getTime() - fechaInicio.getTime();
      this.diferenciadias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
      // console.log(this.diferenciadias)
      this.reserva.dias = this.diferenciadias;
      this.calcularTotal(this.preciohabi, this.diferenciadias);
    }
  }

  calcularTotal(nuevovalor: number, precio: number) {
    this.total = precio * nuevovalor;
    // console.log(precio)
    // console.log('TOTAL', this.total)
    this.reserva.total = this.total;
  }

  actualizarEstado(): void {
    this.habitaciones.estado = "Ocupado";
    this.habitacionesService.update(this.habitaciones).subscribe(
      response => {
        // console.log('Update', this.habitacionesService.update);
        // console.log('Estado actualizado')
      },
      error => {
        // console.error('Error al actualizar:', error);
      }
    );
  }

  cargarMetodopago(): void {
    this.pagoService.getPagoNombres().subscribe(
      response => this.pagoOpciones = response
    );

  }

  onSelectionChange(event: any) {
    const value = (event.target as HTMLSelectElement).value;
    this.pagoSeleccionado = value;
    // console.log('Valor seleccionado:', this.pagoSeleccionado);
    switch (this.pagoSeleccionado) {
      case 'Tarjeta de Crédito':
        this.reserva.idPago = 1;
        // console.log('IdPAGO', this.reserva.idPago);
        break;
      case 'Transferencia Bancaria':
        this.reserva.idPago = 2;
        //console.log('IdPAGO', this.reserva.idPago);
        break;
      case 'Efectivo':
        this.reserva.idPago = 3;
        //console.log('IdPAGO', this.reserva.idPago);
        break;
    }
  }
}
