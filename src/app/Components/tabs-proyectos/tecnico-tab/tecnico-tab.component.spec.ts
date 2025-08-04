import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TecnicoTabComponent } from './tecnico-tab.component';

describe('TecnicoTabComponent', () => {
  let component: TecnicoTabComponent;
  let fixture: ComponentFixture<TecnicoTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TecnicoTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TecnicoTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
