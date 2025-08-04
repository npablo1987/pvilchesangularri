import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorizacionOrdenDialogComponent } from './priorizacion-orden-dialog.component';

describe('PriorizacionOrdenDialogComponent', () => {
  let component: PriorizacionOrdenDialogComponent;
  let fixture: ComponentFixture<PriorizacionOrdenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriorizacionOrdenDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriorizacionOrdenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
