import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientesListaComponent } from './clientes-lista/clientes-lista.component';
import { FormClienteComponent } from './clientes/form-cliente.component';
import { ReservasListaComponent } from './reservas-lista/reservas-lista.component';
import { ComentariosComponent } from './comentarios/comentarios.component'; // Asegúrate de importar el componente


const routes: Routes = [
  { path: 'clientes/lista', component: ClientesListaComponent }, // Lista de clientes
  { path: 'clientes/from', component: FormClienteComponent },  
  { path: 'reservas/lista', component: ReservasListaComponent },
  { path: 'comentarios', component: ComentariosComponent },  // Ruta para comentarios

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
