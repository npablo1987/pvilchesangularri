import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandasFormularioComponent } from './demandas-formulario.component';

describe('DemandasFormularioComponent', () => {
  let component: DemandasFormularioComponent;
  let fixture: ComponentFixture<DemandasFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandasFormularioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandasFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
