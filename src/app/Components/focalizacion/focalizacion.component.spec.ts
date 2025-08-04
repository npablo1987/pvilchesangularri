import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocalizacionComponent } from './focalizacion.component';

describe('FocalizacionComponent', () => {
  let component: FocalizacionComponent;
  let fixture: ComponentFixture<FocalizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FocalizacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FocalizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
