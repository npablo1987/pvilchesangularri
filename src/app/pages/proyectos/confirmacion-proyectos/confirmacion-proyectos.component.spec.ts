import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionProyectosComponent } from './confirmacion-proyectos.component';

describe('ConfirmacionProyectoComponent', () => {
  let component: ConfirmacionProyectosComponent;
  let fixture: ComponentFixture<ConfirmacionProyectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmacionProyectosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmacionProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
