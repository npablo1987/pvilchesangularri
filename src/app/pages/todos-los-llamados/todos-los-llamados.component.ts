import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from '../../Components/card/card.component';
import { TableComponent } from '../../Components/table/table.component';
import { HeaderComponent } from '../../Components/header/header.component';
import { BreadcrumbComponent } from '../../Components/breadcrumb/breadcrumb.component';
import { TitleComponent } from '../../Components/title/title.component';
import { BreadMenuItem, Concurso } from '../../interfaces/concursos.interfaces';
import { ConcursoService } from '../../services/concurso.service';

@Component({
  selector: 'app-todos-los-llamados',
  standalone: true,
  imports: [RouterOutlet, CardComponent, TableComponent, HeaderComponent, BreadcrumbComponent, TitleComponent],
  templateUrl: './todos-los-llamados.component.html',
  styleUrl: './todos-los-llamados.component.scss'
})
export class TodosLosLlamadosComponent implements OnInit {
  breadcrumb: BreadMenuItem[] = [];
  subtitle: string = 'Consulta aquí el listado actualizado de llamados a concurso de riego dentro de tu zona activa, podrás ingresar al detalle de cada uno de ellos.';  
  concursos: Concurso[] = [];

  constructor(private concursoService: ConcursoService) { }

  ngOnInit() {

    this.breadcrumb = [
      { label: 'Escritorio', url: '/riego-home' },
      { label: 'Llamados', url: '/todos-los-llamados' }
    ]

    this.concursoService.getConcurso().subscribe(concursos => {
      this.concursos = concursos;
    });
  }
}
