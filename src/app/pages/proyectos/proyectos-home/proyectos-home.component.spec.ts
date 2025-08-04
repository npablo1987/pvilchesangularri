import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectosHomeComponent } from './proyectos-home.component';

describe('ProyectosHomeComponent', () => {
  let component: ProyectosHomeComponent;
  let fixture: ComponentFixture<ProyectosHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectosHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectosHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
