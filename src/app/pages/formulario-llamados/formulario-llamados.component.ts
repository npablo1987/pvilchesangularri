import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../Components/header/header.component';
import { BreadcrumbComponent } from '../../Components/breadcrumb/breadcrumb.component';
import { TitleComponent } from '../../Components/title/title.component';
import { CallParametersComponent } from '../../Components/call-parameters/call-parameters.component';
import { BreadMenuItem } from '../../interfaces/concursos.interfaces';

@Component({
  selector: 'app-formulario-llamados',
  standalone: true,
  imports: [HeaderComponent, BreadcrumbComponent, TitleComponent, CallParametersComponent],
  templateUrl: './formulario-llamados.component.html',
  styleUrl: './formulario-llamados.component.css'
})
export class FormularioLlamadosComponent implements OnInit {
  subtitle: string = 'Define el objetivo y criterios de elegibilidad para participantes. Especifica fechas clave y requisitos de presentación para propuestas de proyectos de riego.'

  breadcrumb: BreadMenuItem[] = [];

  ngOnInit() {
    this.breadcrumb = [
      { label: 'Escritorio', url: '/riego-home' },
      { label: 'Llamados', url: '/todos-los-llamados' },
      { label: 'Crear llamado', url: '/formulario-llamados' }
    ]
  }

}
