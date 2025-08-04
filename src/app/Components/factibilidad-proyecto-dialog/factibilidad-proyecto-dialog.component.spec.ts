import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactibilidadProyectoDialogComponent } from './factibilidad-proyecto-dialog.component';

describe('FactibilidadProyectoDialogComponent', () => {
  let component: FactibilidadProyectoDialogComponent;
  let fixture: ComponentFixture<FactibilidadProyectoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactibilidadProyectoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactibilidadProyectoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
