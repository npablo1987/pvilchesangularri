import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallParametersComponent } from './call-parameters.component';

describe('CallParametersComponent', () => {
  let component: CallParametersComponent;
  let fixture: ComponentFixture<CallParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallParametersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
