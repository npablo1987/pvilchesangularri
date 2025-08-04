import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChipComponent } from '../chip/chip.component';
import { ProyectosService } from '../../services/proyectos.service';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [CommonModule, ChipComponent],
  templateUrl: './title.component.html',
  styleUrl: './title.component.css'
})
export class TitleComponent implements OnInit{

  @Input() ordenActiva: boolean = false;
  @Output() onOrdenar = new EventEmitter<void>();
  @Output() onEnviarComite = new EventEmitter<void>();
  @Output() onPriorizacionFinal = new EventEmitter<void>();
  @Output() onEditarProyecto = new EventEmitter<void>();

  @Input() comite?: boolean = false;
  @Input() priorizacionFinal?: boolean = false;
  @Input()
  public title!: string;
  @Input()
  public subtitle!: string;
  @Input()
  public redireccion!: string;
  @Input()
  public boton!: string;

  estadoProyecto: string = '';
  estadoDemanda: string = '';
  demandaId: string = '';


  constructor(
    private router: Router,
    private proyectoService: ProyectosService,
    private route: ActivatedRoute
  ) {}

    get chipColor(): 'success' | 'error' {
    return 'success';
  }

  crearLlamado() {
    window.location.href = '/formulario-llamados';
  }

  crearDemanda() {
    window.location.href = '/formulario-demandas';
  }

  crearProyecto() {
    window.location.href = '/buscar-demanda';
  }

  priorizacionPrevia() {
    this.onOrdenar.emit();
  }

  enviarComite() {
    this.onEnviarComite.emit(); // Emitir evento en lugar de cambiar estado local
  }

  priorizacionFin() {
    this.onPriorizacionFinal.emit(); // Emitir evento en lugar de cambiar estado local
  }

  editarProyecto() {
    this.onEditarProyecto.emit();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
    if (!params.get('id')) {
      return;
    }

    const id = params.get('id')!;
    if (this.router.url.includes('formulario-proyectos')) {
      this.proyectoService.getProyectoId(id).subscribe(proyecto => {
        this.estadoProyecto = proyecto.estado ?? '';
        this.demandaId = proyecto.demanda.id?.toString() ?? '';
        this.estadoDemanda = proyecto.demanda.estado ?? '';
      });
    }

    if (this.router.url.includes('formulario-proyecto-estudio')) {
      this.proyectoService.getProyectoId(id).subscribe(proyecto => {
        this.estadoProyecto = proyecto.estado ?? '';
        this.demandaId = proyecto.demanda.id?.toString() ?? '';
        this.estadoDemanda = proyecto.demanda.estado ?? '';
      });
    }
  });
  }
}
