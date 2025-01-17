import { Component, OnInit } from '@angular/core';
import { PersonaService } from '../persona/persona.service';
import { ReservaService } from './reserva.service';
import { EncabezadoFacturaService } from './encabezado-factura.service';
import { ClienteService } from '../clientes/cliente.service';
import { HabitacionesService } from '../habitaciones/habitaciones.service';
import { AuthService } from '../auth.service';
import { Habitaciones } from '../habitaciones/habitaciones';
import { Reserva } from './reserva';
import { Persona } from '../persona/persona';
import { forkJoin, map, of, switchMap } from 'rxjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-form-factura-historial',
  templateUrl: './form-factura-historial.component.html',
  styleUrl: './form-factura-historial.component.css'
})
export class FormFacturaHistorialComponent implements OnInit {
  combinedData: any;
  constructor(private inicio: AuthService,private route: ActivatedRoute){}

  ngOnInit(): void{
    this.route.params.subscribe(params => {
      this.combinedData = JSON.parse(params['datos']);
      
    });
  }

  downloadPDF() {
    const DATA: any = document.getElementById('htmlData2');
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
