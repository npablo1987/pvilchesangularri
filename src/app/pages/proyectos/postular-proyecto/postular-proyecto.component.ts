import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../../../Components/breadcrumb/breadcrumb.component';
import { TitleComponent } from '../../../Components/title/title.component';
import { HeaderComponent } from '../../../Components/header/header.component';
import { BreadMenuItem } from '../../../interfaces/concursos.interfaces';
import { ChipComponent } from '../../../Components/chip/chip.component';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonsComponent } from '../../../Components/buttons/buttons.component';
import { ActivatedRoute } from '@angular/router';
import { ProyectosService } from '../../../services/proyectos.service';
import { ConcursoPublicado, Proyecto } from '../../../interfaces/proyecto.interfaces';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { ConfirmacionDialogComponent } from '../../../Components/confirmacion-dialog/confirmacion-dialog.component';
import { agregarProyectoPostulado } from '../../../utils/formatters';

@Component({
  selector: 'app-postular-proyecto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbComponent,
    TitleComponent,
    HeaderComponent,
    ChipComponent,
    DropdownModule,
    ButtonsComponent,
    DividerModule,
    DialogModule,
    ConfirmacionDialogComponent
  ],
  templateUrl: './postular-proyecto.component.html',
  styleUrl: './postular-proyecto.component.scss'
})
export class PostularProyectoComponent implements OnInit {

  breadcrumb: BreadMenuItem[] = [];
  estadoProyecto: string = 'ADMISIBLE';
  codigoAreaOptions: { name: string, id: number }[] = [];
  nombreProyecto: string = '';
  validarDatos: boolean = false;
  idProyectoBorrador: string = '';
  solicitante: string = '';
  run: string = '';
  insturmento: string = '';
  comuna: string = '';
  Tipologia: string = '';
  costoTotal: number = 0;
  incentivo: number = 0;
  aportePersonal: number = 0;
  numeroDemanda: number = 0;
  proyecto: Proyecto = {} as Proyecto;
  concursosPublicados: ConcursoPublicado[] = [];
  selectedConcurso: ConcursoPublicado = {} as ConcursoPublicado;
  displayDialog: boolean = false;
  fechaCierrePostulacion: string = '';

  validacionUsuarioAdmisible: boolean = false;
  validacionProyectoPreFactible: boolean = false;
  validacionCartaSeleccionConsultor: boolean = false;
  validacionCartaSeleccionContratista: boolean = false;
  validacionCartaConocimientoAportePersonal: boolean = false;
  validacionCamposRequeridos: boolean = false;
  proyectoValido: boolean = false;

  mostrarDialog: boolean = false;
  esExito: boolean = false;
  mensajeExito: string = '';
  mensajeError: string = '';
  confirmPostulacion: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private proyectosService: ProyectosService,
    private cdr: ChangeDetectorRef
  ) {}

  postulacionOk() {
    window.location.href = '/proyectos-home';
  }

  salir() {
    this.displayDialog = false;
  }

   onConfirmar() {
    this.mostrarDialog = false;
  }

  onCerrar() {
    this.mostrarDialog = false;
  }

  validarDatosClave() {
    this.proyectosService.postValidarProyecto(this.idProyectoBorrador).subscribe({
      next: (response) => {
         if (response) {
        this.validacionUsuarioAdmisible = response.detallesCamposRequeridos['Usuario con admisibilidad.'] === 'CORRECTA';
        this.validacionProyectoPreFactible = response.detalles['Proyecto con prefactibilidad'] === 'CORRECTA';
        this.validacionCartaSeleccionConsultor = response.detalles['Cuenta con carta de selección del consultor.'] === 'CORRECTA';
        this.validacionCartaSeleccionContratista = response.detalles['Cuenta con carta de selección del contratista.'] === 'CORRECTA';
        this.validacionCartaConocimientoAportePersonal = response.detalles['Cuenta con carta de conocimiento de aporte personal'] === 'CORRECTA';
        this.validacionCamposRequeridos = response.detalles['Todos los campos requeridos estan completados.'] === 'CORRECTA';

        this.proyectoValido = this.validacionUsuarioAdmisible &&
          this.validacionProyectoPreFactible &&
          this.validacionCartaSeleccionConsultor &&
          this.validacionCartaSeleccionContratista &&
          this.validacionCartaConocimientoAportePersonal &&
          this.validacionCamposRequeridos;

        this.validarDatos = true; 
        this.cdr.detectChanges();
      } else {
        this.estadoProyecto = 'NO ADMISIBLE';
      }
      }
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedConcurso']) {
      this.fechaCierrePostulacion = this.selectedConcurso.fechaCierrePostulacion;
    }
  }

  postularProyecto() {
    if (
      this.validacionUsuarioAdmisible &&
      this.validacionProyectoPreFactible &&
      this.validacionCartaSeleccionConsultor &&
      this.validacionCartaSeleccionContratista &&
      this.validacionCartaConocimientoAportePersonal &&
      this.validacionCamposRequeridos
    ) {
      this.proyectosService.postPostularProyecto(
        this.idProyectoBorrador,
        { concursoInternalid: this.selectedConcurso.internalid }
      ).subscribe({
        next: (response) => {
          if (response) {
            // TODO: eliminar una vez el endpoint devuelva el concurso!!
            // Agregar el proyecto postulado al listado y guardarlo en el localStorage
            agregarProyectoPostulado(this.idProyectoBorrador, this.selectedConcurso);
            window.location.href = '/confirmacion-proyecto/' + this.idProyectoBorrador;
          } else {
            this.displayDialog = true;
            this.estadoProyecto = 'NO POSTULADO';
          }
        },
        error: (error) => {
          console.error('Error al postular el proyecto:', error);
        }
      });
    }else {
      this.mostrarDialog = true;
      this.esExito = false;
      this.mensajeError = 'Debe completar todos los campos requeridos';
    }
  }

  get chipColor(): 'success' | 'error' {
    return 'success';
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.idProyectoBorrador = params['id'];
      this.proyectosService.getProyectoId(this.idProyectoBorrador).subscribe({
        next: (proyecto) => {
          this.solicitante = proyecto.general.antecedentesPostulante.nombre || '';
          this.run = proyecto.general.antecedentesPostulante.rut || '';
          this.insturmento = proyecto.demanda.instrumento || '';
          this.comuna = proyecto.demanda.agencia || '';
          this.Tipologia = proyecto.tecnico.fuenteEnergia || '';
          this.costoTotal = proyecto.presupuesto.aCostoTotalDirecto || 0;
          this.incentivo = proyecto.presupuesto.incentivoTotal || 0;
          this.aportePersonal = proyecto.presupuesto.aportePropio || 0;
          this.numeroDemanda = proyecto.demanda.id || 0;
          this.nombreProyecto = proyecto.nombre || '';
        }
      });
    });

    this.proyectosService.getConcursosPublicados().subscribe({
      next: (concursos) => {
        this.concursosPublicados = concursos;
      }
    });
    
    this.breadcrumb = [
      { label: 'Escritorio', url: '/riego-home' },
      { label: 'Proyectos', url: '/proyectos-home' }
    ]
  }
}
