import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitacionesRecepComponent } from './habitaciones-recep.component';

describe('HabitacionesRecepComponent', () => {
  let component: HabitacionesRecepComponent;
  let fixture: ComponentFixture<HabitacionesRecepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HabitacionesRecepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitacionesRecepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
