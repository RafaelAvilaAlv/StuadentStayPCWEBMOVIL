import { TestBed } from '@angular/core/testing';

import { ServicioComunicacionService } from './servicio-comunicacion.service';

describe('ServicioComunicacionService', () => {
  let service: ServicioComunicacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioComunicacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
