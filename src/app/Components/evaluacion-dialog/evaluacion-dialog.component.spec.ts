import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionDialogComponent } from './evaluacion-dialog.component';

describe('EvaluacionDialogComponent', () => {
  let component: EvaluacionDialogComponent;
  let fixture: ComponentFixture<EvaluacionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluacionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluacionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
