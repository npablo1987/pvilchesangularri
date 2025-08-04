import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CardComponent } from '../../../Components/card/card.component';
import { HeaderComponent } from '../../../Components/header/header.component';
import { BreadcrumbComponent } from '../../../Components/breadcrumb/breadcrumb.component';
import { TitleComponent } from '../../../Components/title/title.component';
import { BreadMenuItem } from '../../../interfaces/concursos.interfaces';
import { Demanda } from '../../../interfaces/demandas.interfaces';
import { DemandaService } from '../../../services/demanda.service';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { TIPO_USUARIO } from '../../../constants/constantes';
import { Proyecto, ProyectoPostulado } from '../../../interfaces/proyecto.interfaces';
import { ProyectosService } from '../../../services/proyectos.service';
import { asignarConcursosAProyectos } from '../../../utils/formatters';
import { AsignarProyectoDialogComponent } from '../../../Components/asignar-proyecto-dialog/asignar-proyecto-dialog.component';

interface Registro {
    usuario: string;
    rut: string;
    instrumento: string;
    codigoProyecto: string;
    llamado: string;
    area: string;
    postulacion: string;
    estado: string;
}
@Component({
  selector: 'app-proyectos-home',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    CardComponent,
    HeaderComponent,
    BreadcrumbComponent,
    TitleComponent,
    TableModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    AsignarProyectoDialogComponent
  ],
  templateUrl: './proyectos-home.component.html',
  styleUrls: ['./proyectos-home.component.scss']
})

export class ProyectosHomeComponent {

  @ViewChild('dt') dt: Table | undefined;

  showLinksMap: Map<string, boolean> = new Map();
  breadcrumb: BreadMenuItem[] = [];
  subtitle: string = 'Consulta aquí el listado actualizado de los proyectos ingresados para los programas de riego por parte de usuarios INDAP.';  
  demandas: Demanda[] = [];
  token!: string;
  rol: string = '';
  proyectos: Proyecto[] = [];

  demandaId: string = '';
  selectedProyectoId: string = '';
  dialogPosition: any = {};
  asignarDialog: boolean = false; 
  idProyectoBorrador: string = '';
  estadoProyecto: string = '';
  esEvaluador: boolean = false;

  constructor(private authService: AuthService, private proyectoService: ProyectosService, private router: Router) { }

  buscarTabla(event: Event) {
    const input = event.target as HTMLInputElement;
    const valor = input.value.toLowerCase();
    if (this.dt) {
      this.dt.filterGlobal(valor, 'contains');
    }
  }

  verProyecto(id: string) {
    const proyecto = this.proyectos.find(p => p.internalid === id);
    console.log(proyecto?.demanda?.instrumento?.trim())
    
    if (proyecto?.demanda?.instrumento?.trim() === 'Estudios Riego') {
      window.location.href = `/formulario-proyecto-estudio/${id}`;
    } else if (proyecto?.estado === 'ASIGNADO' && this.esEvaluador || 
        proyecto?.estado === 'CON_OBSERVACIONES' || 
        proyecto?.estado === 'RECOMENDACION_APROBADA') {
      window.location.href = `/formulario-proyectos/${id}/asignado`;
    } else {
      window.location.href = `/formulario-proyectos/${id}`;
    }
  }

  verDemanda() {
    this.router.navigate(['/formulario-demandas/id'], { 
      queryParams: { id: this.demandaId, editar: true }
    });
  }

  asignarProyecto(id: string) {
    this.asignarDialog = true;
    this.idProyectoBorrador = id;
  }

  esEstadoAsignado(proyectoId: string): boolean {
    const proyecto = this.proyectos.find(p => p.internalid === proyectoId);
    return proyecto?.estado === 'ASIGNADO';
  }

   onDialogClose() {
    this.asignarDialog = false;
    this.idProyectoBorrador = '';
  }

  toggleLinks(id: string, idDemanda: string, event: Event, rowIndex: number, estadoProyecto: string ): void {
    event.preventDefault();
    event.stopPropagation();

    this.showLinksMap.clear();

    this.showLinksMap.set(id, true);
    this.demandaId = idDemanda;
    this.selectedProyectoId = id;
    this.estadoProyecto = estadoProyecto;


    const button = event.target as HTMLElement;
    const rect = button.getBoundingClientRect();

    this.dialogPosition = {
      top: `${rect.bottom + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`,
    };
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    const clickedElement = event.target as HTMLElement;
    const clickedInsideMenu = clickedElement.closest('.overlay-dialog');

    if (!clickedInsideMenu) {
      this.showLinksMap.clear();
    }
  }


  ngOnInit() {
    this.token = this.authService.getToken();
    this.authService.getUsuario(this.token).subscribe({
      next: (data) => {
        this.rol = data.data.perfilActual[0];
        if (this.rol === '77' || this.rol === '76' || this.rol === '3'){
          console.log('entro aca')
          this.esEvaluador = true;
        }else {
          console.log(this.rol = data.data.perfilActual[0], 'este es el rol actual')
          this.esEvaluador = false;
        }
      },
      error: (error) => {
        console.error('Error al obtener el usuario:', error);
      }
    });

    this.breadcrumb = [
      { label: 'Escritorio', url: '/riego-home' },
      { label: 'Proyectos', url: '/proyectos-home' }
    ]

    this.proyectoService.getProyectos().subscribe({
      next: (data) => {
        const proyectosPostulados: ProyectoPostulado[] = JSON.parse(localStorage.getItem('proyectosPostulados') || '[]');
        this.proyectos = asignarConcursosAProyectos(data, proyectosPostulados);
      },
      error: (error) => {
        console.error('Error al obtener los proyectos:', error);
      }
    });

  }
}

