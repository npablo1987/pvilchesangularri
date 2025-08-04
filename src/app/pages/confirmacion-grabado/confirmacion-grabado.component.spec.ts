import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionGrabadoComponent } from './confirmacion-grabado.component';

describe('ConfirmacionGrabadoComponent', () => {
  let component: ConfirmacionGrabadoComponent;
  let fixture: ComponentFixture<ConfirmacionGrabadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmacionGrabadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmacionGrabadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
