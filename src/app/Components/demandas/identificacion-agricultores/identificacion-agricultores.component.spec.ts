import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentificacionAgricultoresComponent } from './identificacion-agricultores.component';

describe('IdentificacionAgricultoresComponent', () => {
  let component: IdentificacionAgricultoresComponent;
  let fixture: ComponentFixture<IdentificacionAgricultoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdentificacionAgricultoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdentificacionAgricultoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
