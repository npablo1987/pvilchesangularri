import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandasHomeComponent } from './demandas-home.component';

describe('DemandasHomeComponent', () => {
  let component: DemandasHomeComponent;
  let fixture: ComponentFixture<DemandasHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandasHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandasHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
