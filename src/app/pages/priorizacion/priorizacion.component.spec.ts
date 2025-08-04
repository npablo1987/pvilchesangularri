import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorizacionComponent } from './priorizacion.component';

describe('PriorizacionComponent', () => {
  let component: PriorizacionComponent;
  let fixture: ComponentFixture<PriorizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriorizacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriorizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
