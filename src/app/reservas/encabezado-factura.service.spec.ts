import { TestBed } from '@angular/core/testing';

import { EncabezadoFacturaService } from './encabezado-factura.service';

describe('EncabezadoFacturaService', () => {
  let service: EncabezadoFacturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncabezadoFacturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
