import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadMenuItem } from '../../../interfaces/concursos.interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleComponent } from '../../../Components/title/title.component';
import { BreadcrumbComponent } from '../../../Components/breadcrumb/breadcrumb.component';
import { HeaderComponent } from '../../../Components/header/header.component';
import { ButtonsComponent } from '../../../Components/buttons/buttons.component';
import { TipoAgua } from '../../../interfaces/proyecto.interfaces';
import { ProyectosService } from '../../../services/proyectos.service';
import { formatRut } from '../../../utils/formatters';

@Component({
  selector: 'app-confirmacion-proyectos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TitleComponent,
    BreadcrumbComponent,
    HeaderComponent,
    ButtonsComponent
  ],
  templateUrl: './confirmacion-proyectos.component.html',
  styleUrl: './confirmacion-proyectos.component.scss'
})
export class ConfirmacionProyectosComponent implements OnInit {
  breadcrumb: BreadMenuItem[] = [];
  redireccion: string = '';

  nombrePostulante: string = '';
  rutPostulante: string = '';
  idProyecto: string = '';

  constructor(
    private router: Router,
    private proyectosService: ProyectosService,
    private route: ActivatedRoute
  ) {
  }

  descargarComprobantePostulacion() {
    this.proyectosService.getComprobanteProyecto(this.idProyecto).subscribe({
      next: (blob: Blob) => {
        console.log('comprobante descargado')
      }
    });
  }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;
      this.idProyecto = id;
      this.proyectosService.getProyectoId(id).subscribe(proyecto => {
        this.nombrePostulante = proyecto.general.antecedentesPostulante.nombre;
        this.rutPostulante = formatRut(proyecto.general.antecedentesPostulante.rut);
    })});



    this.breadcrumb = [
      { label: 'Escritorio', url: '/riego-home' },
      { label: 'Demandas', url: '/demandas-home' },
      { label: 'Crear demanda', url: '/formulario-demandas' }
    ]
  }
}
