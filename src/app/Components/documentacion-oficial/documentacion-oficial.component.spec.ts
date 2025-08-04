import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentacionOficialComponent } from './documentacion-oficial.component';

describe('DocumentacionOficialComponent', () => {
  let component: DocumentacionOficialComponent;
  let fixture: ComponentFixture<DocumentacionOficialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentacionOficialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentacionOficialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
