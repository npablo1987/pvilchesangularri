import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarProyectoDialogComponent } from './asignar-proyecto-dialog.component';

describe('AsignarProyectoDialogComponent', () => {
  let component: AsignarProyectoDialogComponent;
  let fixture: ComponentFixture<AsignarProyectoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarProyectoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarProyectoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
