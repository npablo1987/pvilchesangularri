import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoInversionSelectorComponent } from './tipo-inversion-selector.component';

describe('TipoInversionSelectorComponent', () => {
  let component: TipoInversionSelectorComponent;
  let fixture: ComponentFixture<TipoInversionSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoInversionSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoInversionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
