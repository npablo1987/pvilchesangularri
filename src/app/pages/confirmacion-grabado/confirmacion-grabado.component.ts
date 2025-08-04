import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../Components/header/header.component';
import { TitleComponent } from '../../Components/title/title.component';
import { BreadcrumbComponent } from '../../Components/breadcrumb/breadcrumb.component';
import { BreadMenuItem } from '../../interfaces/concursos.interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmacion-grabado',
  standalone: true,
  imports: [HeaderComponent, TitleComponent, BreadcrumbComponent],
  templateUrl: './confirmacion-grabado.component.html',
  styleUrl: './confirmacion-grabado.component.scss'
})
export class ConfirmacionGrabadoComponent implements OnInit {
  nombreConcurso: string | undefined;
  breadcrumb: BreadMenuItem[] = [];
  subtitle: string = '';
  redireccion: string = '';
  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { nombreConcurso: string };
    this.nombreConcurso = state?.nombreConcurso;
  }

  ngOnInit() {
    const hasReloaded = sessionStorage.getItem('hasReloaded');

    if (!hasReloaded) {
      sessionStorage.setItem('hasReloaded', 'true');
      
      window.location.reload();
    }

    this.subtitle = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eget tincidunt tortor. Aliquam vel mollis leo, nec egestas sapien. Pellentesque.'
    this.breadcrumb = [
      { label: 'Escritorio', url: '/riego-home' },
      { label: 'Llamados', url: '/todos-los-llamados' },
      { label: 'Crear llamado', url: '/formulario-llamados' }
    ]
  }
}
