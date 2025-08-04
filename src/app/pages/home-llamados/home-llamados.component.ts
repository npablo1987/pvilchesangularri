import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from '../../Components/card/card.component';
import { TableComponent } from '../../Components/table/table.component';
import { HeaderComponent } from '../../Components/header/header.component';
import { BreadcrumbComponent } from '../../Components/breadcrumb/breadcrumb.component';
import { TitleComponent } from '../../Components/title/title.component';
import { ConcursoService } from '../../services/concurso.service';
import { BreadMenuItem, Concurso } from '../../interfaces/concursos.interfaces';

@Component({
  selector: 'app-home-llamados',
  standalone: true,
  imports: [RouterOutlet, CardComponent, TableComponent, HeaderComponent, BreadcrumbComponent, TitleComponent],
  templateUrl: './home-llamados.component.html',
  styleUrl: './home-llamados.component.css'
})
export class HomeLlamadosComponent implements OnInit {

  concursos: Concurso[] = [];
  borradores: Concurso[] = [];
  breadcrumb: BreadMenuItem[] = [];
  usuario!: any;
  tablaHome: boolean = true;

  constructor(private concursoService: ConcursoService) { }

  ngOnInit() {

    this.breadcrumb = [
      { label: 'Escritorio', url: '/riego-home' }
    ]

    this.concursoService.getConcurso().subscribe(concursos => {
      this.concursos = concursos;
    });


    this.concursoService.getEstados('Borrador').subscribe(borradores => {
      this.borradores = borradores;
    })

  }
}

