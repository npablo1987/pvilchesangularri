import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLlamadosComponent } from './home-llamados.component';

describe('HomeLlamadosComponent', () => {
  let component: HomeLlamadosComponent;
  let fixture: ComponentFixture<HomeLlamadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeLlamadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeLlamadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
