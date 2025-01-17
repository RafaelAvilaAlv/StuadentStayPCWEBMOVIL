import { TestBed } from '@angular/core/testing';

import { DetalleFacturaService } from './detalle-factura.service';

describe('DetalleFacturaService', () => {
  let service: DetalleFacturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleFacturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
