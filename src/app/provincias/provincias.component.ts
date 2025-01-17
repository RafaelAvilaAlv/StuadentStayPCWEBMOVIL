import { Component, OnInit } from '@angular/core';
import { ProvinciaService } from './provincia.service';
import { Provincia } from './provincia';
import { CantonService } from '../cantones/canton.service';
import { Cantones } from '../cantones/canton';

@Component({
  selector: 'app-provincias',
  templateUrl: './provincia.component.html',
})
export class ProvinciasComponent implements OnInit {
  provincias: Provincia[] = [];
  cantones: Cantones[] = [];

  constructor(
    private provinciaService: ProvinciaService,
    private cantonService: CantonService
  ) { }

  ngOnInit(): void {
    this.loadProvincias();
  }

  loadProvincias() {
    this.provinciaService.getProvincias().subscribe(
      (provincias) => {
        this.provincias = provincias;
        this.loadCantones();
      },
      (error) => {
        //console.error('Error loading provinces', error);
      }
    );
  }

  loadCantones() {
    this.cantonService.getCantones().subscribe(
      (cantones) => {
        this.cantones = cantones;
        this.mapCantonesToProvincias();
      },
      (error) => {
        //console.error('Error loading cantones', error);
      }
    );
  }


  mapCantonesToProvincias() {

    this.cantones.forEach((canton) => {
      const provincia = this.provincias.find(
        (p) => p.id_provincia === canton.id_provincia
      );
      if (provincia) {
        if (!provincia.cantones) {
          provincia.cantones = [];
        }
        provincia.cantones.push(canton);
      }
    });
  }
}
