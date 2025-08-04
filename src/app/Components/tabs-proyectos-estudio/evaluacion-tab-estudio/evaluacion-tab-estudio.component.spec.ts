import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionTabComponent } from './evaluacion-tab.component';

describe('EvaluacionTabComponent', () => {
  let component: EvaluacionTabComponent;
  let fixture: ComponentFixture<EvaluacionTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluacionTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluacionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
