import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { TableModule } from 'primeng/table';
import { Concurso } from '../../interfaces/concursos.interfaces';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Router } from '@angular/router';
import { ConcursoService } from '../../services/concurso.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../interfaces/usuario.interfaces';


@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TableModule, CommonModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit{
  @ViewChild('dt') dt: Table | undefined;
  
  showLinksMap: Map<string, boolean> = new Map();
  noData!: Concurso;
  rolUsuario: string = '';
  
  constructor(
    private router: Router,
    private elementRef: ElementRef, 
    private concursoService: ConcursoService,
    private authService: AuthService
  ) { }

  @Input()
  public concursos: Concurso[] = [];

  @Input()
  public todosLosLlamados: boolean = false;

  ngOnInit(): void {
    this.authService.getUsuario(this.authService.getToken()).subscribe(usuario => {
      this.rolUsuario = usuario.data.ambitoActivo;
      console.log(this.rolUsuario)
    });
      
  }

  toggleLinks(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation(); 
    const currentState = this.showLinksMap.get(id) || false;

    this.showLinksMap.forEach((value, key) => {
      if (key !== id) {
        this.showLinksMap.set(key, false);
      }
    });

    this.showLinksMap.set(id, !currentState);
  }

  get ELEMENT_DATA() {
    return this.concursos;
  }

  verConcurso(id: string, estado: string) {
    if (estado === 'Publicado' || estado === 'Pendiente Aprobación') {
      window.location.href = '/formulario-llamados/revisionConcurso/' + id;
    }else {
      window.location.href = '/formulario-llamados/' + id;
    }
  }

  detalleConcurso(id: string) {
    window.location.href = '/proyectos-priorizacion/' + id;
  }

  revisarConcurso(id: string){
    window.location.href = '/formulario-llamados/revision/' + id;
  }

  eliminarConcurso(id: string) {
    this.concursoService.deleteConcurso(id).subscribe(resp => {
      window.location.href = '/todos-los-llamados';
    });
  }

  buscarTabla(event: Event) {
    const input = event.target as HTMLInputElement;
    const valor = input.value.toLowerCase();
    if (this.dt) {
      this.dt.filterGlobal(valor, 'contains');
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showLinksMap.forEach((value, key) => {
        if (value) {
          this.showLinksMap.set(key, false);
        }
      });
    }
  }
}
