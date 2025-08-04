import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosLosLlamadosComponent } from './todos-los-llamados.component';

describe('TodosLosLlamadosComponent', () => {
  let component: TodosLosLlamadosComponent;
  let fixture: ComponentFixture<TodosLosLlamadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodosLosLlamadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodosLosLlamadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
