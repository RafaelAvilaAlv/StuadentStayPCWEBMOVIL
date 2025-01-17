import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelServiciosReservasComponent } from './panel-servicios-reservas.component';

describe('PanelServiciosReservasComponent', () => {
  let component: PanelServiciosReservasComponent;
  let fixture: ComponentFixture<PanelServiciosReservasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PanelServiciosReservasComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PanelServiciosReservasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
