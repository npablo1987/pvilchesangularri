import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresupuestoTabComponent } from './presupuesto-tab.component';

describe('PresupustoTabComponent', () => {
  let component: PresupuestoTabComponent;
  let fixture: ComponentFixture<PresupuestoTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresupuestoTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresupuestoTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
