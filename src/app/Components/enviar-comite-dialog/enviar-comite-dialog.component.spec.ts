import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarComiteDialogComponent } from './enviar-comite-dialog.component';

describe('EnviarComiteDialogComponent', () => {
  let component: EnviarComiteDialogComponent;
  let fixture: ComponentFixture<EnviarComiteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnviarComiteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnviarComiteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
