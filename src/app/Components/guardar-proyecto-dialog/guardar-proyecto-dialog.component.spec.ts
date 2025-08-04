import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardarProyectoDialogComponent } from './guardar-proyecto-dialog.component';

describe('GuardarProyectoDialogComponent', () => {
  let component: GuardarProyectoDialogComponent;
  let fixture: ComponentFixture<GuardarProyectoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuardarProyectoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuardarProyectoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
