import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjuntarArchivosComponent } from './adjuntar-archivos.component';

describe('AdjuntarArchivosComponent', () => {
  let component: AdjuntarArchivosComponent;
  let fixture: ComponentFixture<AdjuntarArchivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdjuntarArchivosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdjuntarArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
