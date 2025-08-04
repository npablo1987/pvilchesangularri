import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcreditacionAguasComponent } from './acreditacion-aguas.component';

describe('AcreditacionAguasComponent', () => {
  let component: AcreditacionAguasComponent;
  let fixture: ComponentFixture<AcreditacionAguasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcreditacionAguasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcreditacionAguasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
