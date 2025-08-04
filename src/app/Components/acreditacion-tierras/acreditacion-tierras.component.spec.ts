import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcreditacionTierrasComponent } from './acreditacion-tierras.component';

describe('AcreditacionTierrasComponent', () => {
  let component: AcreditacionTierrasComponent;
  let fixture: ComponentFixture<AcreditacionTierrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcreditacionTierrasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcreditacionTierrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
