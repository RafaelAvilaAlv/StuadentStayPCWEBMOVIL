import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ReservasListaComponent } from './reservas-lista.component';



@NgModule({
  declarations: [
    ReservasListaComponent
  ],
  imports: [
    CommonModule,
    FormsModule 
  ]
})
export class ReservasListaModule { }
