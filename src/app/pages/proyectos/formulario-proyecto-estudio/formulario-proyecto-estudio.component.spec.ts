import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioProyectoEstudioComponent } from './formulario-proyecto-estudio.component';

describe('FormularioProyectoEstudioComponent', () => {
  let component: FormularioProyectoEstudioComponent;
  let fixture: ComponentFixture<FormularioProyectoEstudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioProyectoEstudioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioProyectoEstudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
