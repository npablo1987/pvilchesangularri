import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TecnicoTabEstudioComponent } from './tecnico-tab-estudio.component';

describe('TecnicoTabEstudioComponent', () => {
  let component: TecnicoTabEstudioComponent;
  let fixture: ComponentFixture<TecnicoTabEstudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TecnicoTabEstudioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TecnicoTabEstudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
