import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorizacionFinalDialogComponent } from './priorizacion-final-dialog.component';

describe('PriorizacionFinalDialogComponent', () => {
  let component: PriorizacionFinalDialogComponent;
  let fixture: ComponentFixture<PriorizacionFinalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriorizacionFinalDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriorizacionFinalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
