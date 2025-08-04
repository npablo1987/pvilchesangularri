import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Concurso } from '../../interfaces/concursos.interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class CardComponent {

  @Input()
  public borradores: Concurso[] = [];

  constructor(private router: Router) {
   }

  verBorradores(id: any) {
    window.location.href = '/formulario-llamados/' + id;
  }
  crearLlamado() { 
    window.location.href = '/formulario-llamados';
  }
}
