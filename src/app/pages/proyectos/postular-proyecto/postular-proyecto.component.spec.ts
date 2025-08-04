import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostularProyectoComponent } from './postular-proyecto.component';

describe('PostularProyectoComponent', () => {
  let component: PostularProyectoComponent;
  let fixture: ComponentFixture<PostularProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostularProyectoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostularProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
