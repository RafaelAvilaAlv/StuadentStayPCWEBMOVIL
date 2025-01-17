import { Component, OnInit } from '@angular/core';
import { CantonService } from './canton.service';
import { Cantones } from './canton';
import { ProvinciaService } from '../provincias/provincia.service';

@Component({
  selector: 'app-cantones',
  templateUrl: './cantones.component.html',
})
export class CantonesComponent implements OnInit {
  cantones: Cantones[] = [];

  constructor(
    private cantonService: CantonService,
    private provinciaService: ProvinciaService
  ) { }

  ngOnInit(): void {
    //console.log("OnInit - Loading Cantones");
    this.loadCantones();
  }

  loadCantones() {
    this.cantonService.getCantones().subscribe(
      (data) => {
        this.cantones = data;
        this.loadProvincias();
      },
      (error) => {
        // console.error('Error loading cantones', error);
      }
    );
  }

  loadProvincias() {
    this.provinciaService.getProvincias().subscribe(
      (provincias) => {
        this.cantones.forEach(canton => {
          const provincia = provincias.find(p => p.id_provincia === canton.id_provincia);
          if (provincia) {
            canton.id_provincia = provincia.id_provincia;
          }
        });
      },
      (error) => {
        //console.error('Error loading provincias', error);
      }
    );
  }
}
