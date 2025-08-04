import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioProyectosComponent } from './formulario-proyectos.component';

describe('FormularioProyectosComponent', () => {
  let component: FormularioProyectosComponent;
  let fixture: ComponentFixture<FormularioProyectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioProyectosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
