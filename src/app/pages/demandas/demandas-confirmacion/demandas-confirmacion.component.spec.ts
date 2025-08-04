import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandasConfirmacionComponent } from './demandas-confirmacion.component';

describe('DemandasConfirmacionComponent', () => {
  let component: DemandasConfirmacionComponent;
  let fixture: ComponentFixture<DemandasConfirmacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandasConfirmacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandasConfirmacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
