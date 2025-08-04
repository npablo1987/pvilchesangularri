import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalTabComponent } from './legal-tab.component';

describe('LegalTabComponent', () => {
  let component: LegalTabComponent;
  let fixture: ComponentFixture<LegalTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
