import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
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
import { formatRut } from '../../../utils/formatters';

@Component({
  selector: 'app-demandas-home',
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
    InputIconModule
  ],
  templateUrl: './demandas-home.component.html',
  styleUrl: './demandas-home.component.scss'
})
export class DemandasHomeComponent {

  @ViewChild('dt') dt: Table | undefined;

  showLinksMap: Map<string, boolean> = new Map();
  breadcrumb: BreadMenuItem[] = [];
  subtitle: string = 'Consulta aquí el listado actualizado de demandas ingresadas para los programas de riego por parte de usuarios INDAP.';  
  demandas: Demanda[] = [];
  token!: string;
  rol: string = '';

  constructor(private authService: AuthService, private demandasService: DemandaService, private router: Router) { }

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

  eliminarDemanda(id: string) {
    this.demandasService.deleteDemanda(id).subscribe(() => {});
    window.location.reload();   
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    const clickedElement = event.target as HTMLElement;
    const clickedInsideMenu = clickedElement.closest('.additional-links');

    if (!clickedInsideMenu) {
      this.showLinksMap.clear();
    }
  }

  ngOnInit() {
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
      { label: 'Demandas', url: '/demandas-home' }
    ]

    this.demandasService.getDemandas().subscribe(demandas => {
      this.demandas = demandas.map(demanda => {
      demanda.rut = formatRut(demanda.rut);
      return demanda;
    });
    })

  }
}
