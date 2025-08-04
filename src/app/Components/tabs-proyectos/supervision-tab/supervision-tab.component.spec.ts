import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisionTabComponent } from './supervision-tab.component';

describe('SupervisionTabComponent', () => {
  let component: SupervisionTabComponent;
  let fixture: ComponentFixture<SupervisionTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupervisionTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupervisionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
