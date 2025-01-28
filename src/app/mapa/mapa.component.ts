import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  template: `<div id="map"></div>`,
  styleUrls: ['./mapa.component.css'],
})
export class MapaComponent implements OnInit {
  private map: L.Map | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Solo inicializa en el navegador
      this.initializeMap();
    }
  }

  private async initializeMap(): Promise<void> {
    const L = await import('leaflet');
    this.map = L.map('map', {
      center: [51.5, -0.09], // mapa iniciale
      zoom: 13, //zoom 
      scrollWheelZoom: false, // Desactivar scroll mouse
      dragging: false, // Desactivar arrastre mouse
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      console.log(`Latitud: ${e.latlng.lat}, Longitud: ${e.latlng.lng}`);
    });
  }
}