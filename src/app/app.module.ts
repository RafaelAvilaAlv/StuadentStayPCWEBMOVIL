import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule, Routes } from '@angular/router';
import { FormPanelControlComponent } from './recepcionista/form-panel-control.component';

import { ClientesComponent } from './clientes/clientes.component';
import { FormClienteComponent } from './clientes/form-cliente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from './clientes/cliente.service';
import { ReservaService } from './reservas/reserva.service';
import { EncabezadoFacturaService } from './reservas/encabezado-factura.service';
import { DetalleFacturaService } from './reservas/detalle-factura.service';
import { HttpClientModule } from '@angular/common/http';
import { FormReservasComponent } from './reservas/form-reservas.component';

////agregados mios  edisson///
import { ServiciosComponent } from './servicios/servicios.component';
import { Servicios2Component } from './servicios2/servicios2.component';
import { ServicioService } from './servicios/servicio.service';
import { Servicio2Service } from './servicios2/servicio2.service';
import { FormComponent as ServiciosFormComponent } from './servicios/form.component';
import { HabitacionesComponent } from './habitaciones/habitaciones.component';
import { HabitacionesService } from './habitaciones/habitaciones.service';
import { PanelRecepcionComponent } from './panel-recepcion/panel-recepcion.component';
import { PanelServiciosReservasComponent } from './panel-servicios-reservas/panel-servicios-reservas.component';
import { CarrucelComponent } from './carrucel/carrucel.component';
import { FormHbitacionesComponent } from './habitaciones/form-hbitaciones.component';
import { FormComponentServi as Servicios2FormComponent } from './servicios2/form.component';
// B
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';
import { FormAComponent } from './login/formA.component';

import { PersonaService } from './persona/persona.service';
import { PersonaComponent } from './persona/persona.component';
import { FormPComponent } from './persona/formP.component';
import { ProvinciasComponent } from './provincias/provincias.component';
import { CantonesComponent } from './cantones/cantones.component';
import { CantonService } from './cantones/canton.service';
import { ProvinciaService } from './provincias/provincia.service';
import { RegistroCComponent } from './registroC/registroC.component';
import { RegistroCService } from './registroC/registroC.service';
import { FormRCComponent } from './registroC/formRC.component';
import { FormrrcepcionistaComponent } from './header/formrrcepcionista.component';
import { FormAdminLoginComponent } from './header/form-admin-login.component';
import { FormFacturaComponent } from './reservas/form-factura.component';
import { vigilanteGuard } from './vigilante.guard';
import { AuthService } from './auth.service';
import { FormRecepcionistaComponent } from './recepcionista/form-recepcionista.component';
import { RecepcionistaComponent } from './recepcionista/recepcionista.component';
import { FilterPipe } from './filter.pipe';
import { FormhistorialComponent } from './reservas/formhistorial.component';
import { FormFacturaHistorialComponent } from './reservas/form-factura-historial.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'habitaciones', component: HabitacionesComponent },
  { path: 'recepcionista/form-panel-control', component: FormPanelControlComponent },
  { path: 'panel-recepcion', component: PanelRecepcionComponent },
  { path: 'reservas/form-factura', component: FormFacturaComponent },
  { path: 'panel-servicios-reservas', component: PanelServiciosReservasComponent },
  { path: 'habitaciones/form/:id', component: FormHbitacionesComponent },
  { path: 'habitaciones/form', component: FormHbitacionesComponent },
  { path: 'carrucel', component: CarrucelComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'servicios/form', component: ServiciosFormComponent },
  { path: 'servicios/form/:id', component: ServiciosFormComponent },
  { path: 'servicios2', component: Servicios2Component },
  { path: 'servicios2/form', component: Servicios2FormComponent },
  { path: 'servicios2/form/:id', component: Servicios2FormComponent },
  { path: 'reservas/form-reservas/:id', component: FormReservasComponent },
  { path: 'reservas/form-factura-historial', component: FormFacturaHistorialComponent },
  { path: 'reservas/formhistorial', component: FormhistorialComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'clientes/:id', component: ClientesComponent },
  { path: 'clientes/form', component: FormClienteComponent },
  { path: 'clientes/form/:id', component: FormClienteComponent },
  { path: 'login', component: LoginComponent, canActivate: [vigilanteGuard] },
  { path: 'persona', component: PersonaComponent },
  { path: 'persona/form', component: FormPComponent },
  { path: 'persona/form/:id', component: FormPComponent },
  { path: 'provincias', component: ProvinciasComponent },
  { path: 'cantones', component: CantonesComponent },
  { path: 'registroC', component: RegistroCComponent },
  { path: 'recepcionista', component: RecepcionistaComponent },
  { path: 'recepcionista/form', component: FormRecepcionistaComponent },
  { path: 'registroC/form/:cedula_persona', component: FormRCComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ClientesComponent,
    FormClienteComponent,
    FormReservasComponent,
    ServiciosComponent,
    ServiciosFormComponent,
    Servicios2FormComponent,
    PanelRecepcionComponent,
    PanelServiciosReservasComponent,
    HabitacionesComponent,
    HabitacionesComponent,
    CarrucelComponent,
    FormPanelControlComponent,
    FormHbitacionesComponent,
    LoginComponent,
    FormAComponent,
    Servicios2Component,
    PersonaComponent,
    FormPComponent,
    ProvinciasComponent,
    CantonesComponent,
    RegistroCComponent,
    FormRCComponent,
    FormrrcepcionistaComponent,
    FormAdminLoginComponent,
    FormRecepcionistaComponent,
    FormFacturaComponent,
    FilterPipe,
    FormhistorialComponent,
    FormFacturaHistorialComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthService,
    ClienteService,
    ReservaService,
    EncabezadoFacturaService,
    DetalleFacturaService,
    ServicioService,
    Servicio2Service,
    HabitacionesService,
    LoginService,
    PersonaService,
    ProvinciaService,
    CantonService,
    RegistroCService,
    FilterPipe,
    provideClientHydration()

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
