import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioLlamadosComponent } from './formulario-llamados.component';

describe('FormularioLlamadosComponent', () => {
  let component: FormularioLlamadosComponent;
  let fixture: ComponentFixture<FormularioLlamadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioLlamadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioLlamadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
