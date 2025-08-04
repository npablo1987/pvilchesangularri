import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../Components/card/card.component';
import { HeaderComponent } from '../../Components/header/header.component';
import { BreadcrumbComponent } from '../../Components/breadcrumb/breadcrumb.component';
import { TitleComponent } from '../../Components/title/title.component';
import { BreadMenuItem } from '../../interfaces/concursos.interfaces';
import { AuthService } from '../../services/auth.service';
import { TIPO_USUARIO } from '../../constants/constantes';
import { PriorizacionProyectos, Proyecto } from '../../interfaces/proyecto.interfaces';
import { PriorizacionOrdenDialogComponent } from '../../Components/priorizacion-orden-dialog/priorizacion-orden-dialog.component';
import { EnviarComiteDialogComponent } from '../../Components/enviar-comite-dialog/enviar-comite-dialog.component';
import { PriorizacionFinalDialogComponent } from '../../Components/priorizacion-final-dialog/priorizacion-final-dialog.component';
import { ProyectosService } from '../../services/proyectos.service';

@Component({
  selector: 'app-priorizacion',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    CardComponent,
    HeaderComponent,
    BreadcrumbComponent,
    TitleComponent,
    TableModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    PriorizacionOrdenDialogComponent,
    EnviarComiteDialogComponent,
    PriorizacionFinalDialogComponent
  ],
  templateUrl: './priorizacion.component.html',
  styleUrl: './priorizacion.component.scss'
})
export class PriorizacionComponent {

  @ViewChild('dt') dt: Table | undefined;

  showLinksMap: Map<string, boolean> = new Map();
  breadcrumb: BreadMenuItem[] = [];
  subtitle: string = '';
  token!: string;
  rol: string = '';
  proyectosPriorizacion: PriorizacionProyectos[] = [];
  ordenarPorPuntaje: boolean = false;
  textoBotonPriorizacion: string = 'Priorización previa';
  mostrarDialogo: boolean = false;
  mostrarDialogoComite: boolean = false;
  mostrarDialogoFinal: boolean = false;

  nombreProyecto: string = 'Proyectos PRI';
  idConcurso: string = '';
  enviarAComite: boolean = false;
  priorizacionFinal: boolean = false;

  priorizacionFinalCompletada: boolean = false;

  constructor(
    private authService: AuthService, 
    private proyectoService: ProyectosService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  buscarTabla(event: Event) {
    const input = event.target as HTMLInputElement;
    const valor = input.value.toLowerCase();
    if (this.dt) {
      this.dt.filterGlobal(valor, 'contains');
    }
  }

  toggleLinks(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation(); 
    const currentState = this.showLinksMap.get(id) || false;

    this.showLinksMap.forEach((_, key) => {
      if (key !== id) this.showLinksMap.set(key, false);
    });

    this.showLinksMap.set(id, !currentState);
  }

  verDemanda(id: string) {
    this.router.navigate(['/formulario-demandas/revision'], { 
      queryParams: { id: id, esRevision: true }
    });
  }

  editarDemanda(id: string) {
    this.router.navigate(['/formulario-demandas/id'], { 
      queryParams: { id: id, editar: true }
    });
  }

  @HostListener('document:click', ['$event']) 
  handleOutsideClick(event: Event) {
    const clickedElement = event.target as HTMLElement;
    const clickedInsideMenu = clickedElement.closest('.additional-links');

    if (!clickedInsideMenu) {
      this.showLinksMap.clear();
    }
  }

  ordenActiva: boolean = false;

  priorizacionPrevia() {
    this.ordenActiva = !this.ordenActiva;
    this.ordenarYActualizarPriorizacion();
    this.router.navigate([], {
      queryParams: { orden: this.ordenActiva },
      queryParamsHandling: 'merge'
    });
    this.mostrarDialogo = true;
  }

//  private ordenarYActualizarPriorizacion() {
//   // Ordenar por puntaje
//   this.proyectosPriorizacion.sort((a, b) => this.ordenActiva ? b.puntaje - a.puntaje : a.puntaje - b.puntaje);
  
//   // Asignar priorización numérica y actualizar estados
//   this.proyectosPriorizacion.forEach((proyecto, index) => {
//     proyecto.priorizacion = this.ordenActiva ? index + 1 : proyecto.priorizacion;
    
//     // Cambiar estados solo cuando se activa la ordenación
//     // if(this.ordenActiva) {
//     //   proyecto.estado = proyecto.estado === 'Recom. Aprobación' ? 'Aprobado' : 
//     //                    proyecto.estado === 'Recom. Rechazo' ? 'Rechazado' : 
//     //                    proyecto.estado;
//     // }
//   });
// }

get botonActual(): string {
  if (this.priorizacionFinal && !this.priorizacionFinalCompletada) return 'priorizacionFinal';
  if (this.enviarAComite) return 'comite';
  return 'Priorizacion';
}

// Modificar ordenarYActualizarPriorizacion
private ordenarYActualizarPriorizacion() {
  this.proyectosPriorizacion.sort((a, b) => this.ordenActiva ? b.puntaje - a.puntaje : a.puntaje - b.puntaje);
  
  this.proyectosPriorizacion.forEach((proyecto, index) => {
    proyecto.priorizacion = this.ordenActiva ? index + 1 : proyecto.priorizacion;
  });
  
  if (this.ordenActiva) {
    this.enviarAComite = true; // Activar siguiente etapa después de ordenar
  }
}

  onDialogoCerrado(confirmado: boolean) {
    this.mostrarDialogo = false;
    if (confirmado) {
      this.ordenarYActualizarPriorizacion();
      this.router.navigate([], {
        queryParams: { orden: true },
        queryParamsHandling: 'merge'
      });
      this.enviarAComite = true; // Activar siguiente etapa
    }
  }

  // Nuevo método para manejar comité
  onComiteConfirmado(confirmado: boolean) {
  this.mostrarDialogoComite = false;
  if (confirmado) {
    this.enviarAComite = false;
    this.priorizacionFinal = true; // Activar priorización final
    this.priorizacionFinalCompletada = false; // Asegurar que está habilitado inicialmente
  }
}

  // Nuevo método para manejar priorización final
  onPriorizacionFinalConfirmada(confirmado: boolean) {
  this.mostrarDialogoFinal = false;
  if (confirmado) {
    this.priorizacionFinalCompletada = true; // Cambiar esta variable
    // Lógica adicional para guardar el estado final
  }
}

  handleEnviarComite() {
    this.mostrarDialogoComite = true;
  }

  handlePriorizacionFinal() {
    this.mostrarDialogoFinal = true;
  }

  ngOnInit() {

    this.priorizacionFinal = false;
  this.priorizacionFinalCompletada = false;
  this.enviarAComite = false;

    this.route.params.subscribe(params => {
      this.idConcurso = params['id'];
      this.proyectoService.getProyectosConcurso(this.idConcurso).subscribe({
        next: (data) => {
          this.proyectosPriorizacion = data.proyectos
          console.log(data)
        }
      })
    })

    this.token = this.authService.getToken();
    this.authService.getUsuario(this.token).subscribe({
      next: (data) => {
        this.rol = TIPO_USUARIO[data.data.perfilActual[0]];
      },
      error: (error) => {
        console.error('Error al obtener el usuario:', error);
      }
    });

    this.breadcrumb = [
      { label: 'Escritorio', url: '/riego-home' },
      { label: 'Llamados', url: '/todos-los-llamados' },
      { label: 'Llamado', url: '/proyectos-priorizacion/' + this.idConcurso },
    ]

  }
}
