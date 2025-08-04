import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { BreadMenuItem, Instrumentos } from '../../../interfaces/concursos.interfaces';
import { HeaderComponent } from '../../../Components/header/header.component';
import { BreadcrumbComponent } from '../../../Components/breadcrumb/breadcrumb.component';
import { TitleComponent } from '../../../Components/title/title.component';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonsComponent } from '../../../Components/buttons/buttons.component';
import { FormsModule } from '@angular/forms';
import { InputTextComponent } from '../../../Components/input-text/input-text.component';
import { DropdownModule } from 'primeng/dropdown';
import { DemandaService } from '../../../services/demanda.service';
import { RadioButtonComponent } from '../../../Components/radio-button/radio-button.component';
import { DividerModule } from 'primeng/divider';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';
import { IdentificacionAgricultoresComponent } from '../../../Components/demandas/identificacion-agricultores/identificacion-agricultores.component';
import { TableModule } from 'primeng/table';
import { ChipComponent } from '../../../Components/chip/chip.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';
import { GeneralTabEstudioComponent } from '../../../Components/tabs-proyectos-estudio/general-tab-estudio/general-tab-estudio.component';
import { LegalTabEstudioComponent } from '../../../Components/tabs-proyectos-estudio/legal-tab-estudio/legal-tab-estudio.component';
import { TecnicoTabEstudioComponent } from '../../../Components/tabs-proyectos-estudio/tecnico-tab-estudio/tecnico-tab-estudio.component';
import { PresupuestoTabEstudioComponent } from '../../../Components/tabs-proyectos-estudio/presupuesto-tab-estudio/presupuesto-tab-estudio.component';

import { GuardarProyectoDialogComponent } from '../../../Components/guardar-proyecto-dialog/guardar-proyecto-dialog.component';
import { ProyectosService } from '../../../services/proyectos.service';
import { Concurso, Demanda, General, Legal, Presupuesto, Proyecto, Tecnico } from '../../../interfaces/proyecto.interfaces';
import { FactibilidadProyectoDialogComponent } from '../../../Components/factibilidad-proyecto-dialog/factibilidad-proyecto-dialog.component';
import { ConfirmacionDialogComponent } from '../../../Components/confirmacion-dialog/confirmacion-dialog.component';
import { EvaluacionTabEstudioComponent } from '../../../Components/tabs-proyectos-estudio/evaluacion-tab-estudio/evaluacion-tab-estudio.component';
import { SupervisionTabEstudioComponent } from '../../../Components/tabs-proyectos-estudio/supervision-tab-estudio/supervision-tab-estudio.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-formulario-proyecto-estudio',
  standalone: true,
  imports: [
    GeneralTabEstudioComponent,
    HeaderComponent,
    BreadcrumbComponent,
    TitleComponent,
    CommonModule,
    InputTextModule,
    ButtonsComponent,
    FormsModule,
    InputTextComponent,
    DropdownModule,
    InputTextareaModule,
    RadioButtonComponent,
    DividerModule,
    IdentificacionAgricultoresComponent,
    TableModule,
    ChipComponent,
    TabViewModule,
    LegalTabEstudioComponent,
    TecnicoTabEstudioComponent,
    PresupuestoTabEstudioComponent,
    GuardarProyectoDialogComponent,
    FactibilidadProyectoDialogComponent,
    ConfirmacionDialogComponent,
    EvaluacionTabEstudioComponent,
    SupervisionTabEstudioComponent,
    DialogModule
  ],
  templateUrl: './formulario-proyecto-estudio.component.html',
  styleUrl: './formulario-proyecto-estudio.component.scss'
})
export class FormularioProyectoEstudioComponent {

  displayDialog: boolean = false;
  nombreUsuarioDemanda: string = '';
  rutUsuarioDemanda: string = '';
  respuestaNumeroDemanda: number = 0;
  instrumentoDemanda: string = '';
  estadoDemanda: string = 'ADMISIBLE';
  chipColor: any = 'error';
  

  datosGenerales: General | null = null;
  datosPresupuesto: Presupuesto | null = null;
  proyectoData: Proyecto | null = null;
  datosLegales: Legal | null = null;
  datosTecnicos: Tecnico | null = null;
  presupuestoRecibido: Presupuesto | null = null;
  proyectoCompleto: Proyecto | null = null;

  @ViewChild(GeneralTabEstudioComponent) generalTabComponent!: GeneralTabEstudioComponent;
  @ViewChild(LegalTabEstudioComponent) legalTabComponent!: LegalTabEstudioComponent;
  @ViewChild(TecnicoTabEstudioComponent) tecnicoTabComponent!: TecnicoTabEstudioComponent;
  @ViewChild(PresupuestoTabEstudioComponent) presupuestoTabComponent!: PresupuestoTabEstudioComponent;

  nombreProyecto = '';
  descripcionProyecto = '';

  textAreaPlaceholder = 'Un proyecto de riego busca optimizar el suministro de agua a cultivos mediante la instalación de sistemas de riego como goteo, aspersión o surcos. Se enfoca en maximizar la eficiencia del uso del agua, mejorar la productividad agrícola y reducir el desperdicio.'
  identificador: string = '';
  breadcrumb: BreadMenuItem[] = [];
  nombreUsuario: string = '';
  rutUsuario: string = '';
  esEditar: boolean = false;

  rutRepresentanteLegal: string = '';
  filtradoPorAgrupaciones: boolean = false;

  nombreAgrupacion: string = '';

  validaFormulario = true;
  mostrarDialog = false;
  idProyectoBorrador: string = '';
  proyecto: Proyecto = {} as Proyecto;

  responsable: string = 'María del Cármen Rodriguez Pérez'
  factibilidadDialog: boolean = false;

  esPrefactibilidadFallida: boolean = true;

  mostrarConfirmacion: boolean = false;
  esExito: boolean = false;
  mensajeExito: string = '';
  mensajeError: string = '';

  estadoProyecto: boolean = false;

  esRutaAsignado: boolean = false;
  activeTabIndex: number = 0;

  proyectoAEvaluar: Proyecto = {} as Proyecto
  
  constructor(
    private usuarioService: UsuariosService, 
    private route: ActivatedRoute,
    private proyectosService: ProyectosService,
    public router: Router
  ) { }

  onConfirmar() {
    this.mostrarDialog = false;
  }

  onCerrar() {
    this.mostrarDialog = false;
  }

  definirFactibilidad() {
    this.factibilidadDialog = true;
  }

  manejarPresupuesto(presupuesto: Presupuesto) {
    this.datosPresupuesto = presupuesto;
  }
  recibirDatosGenerales(datos: General) {
    this.datosGenerales = datos;
  }

  onDialogClosed() {
    this.mostrarDialog = false;
  }

 descargarPrefactibilidad() {
    this.proyectosService.getDocumentoPrefactibilidad(this.idProyectoBorrador).subscribe({
      next: (response) => {
        window.location.href = '/formulario-proyectos/'+ this.idProyectoBorrador;
      },
      error: (error) => {
        console.error(error)
      }
    });

 }

 guardarProyecto() {
    this.datosGenerales = this.generalTabComponent?.getGeneralData();
    this.datosLegales = this.legalTabComponent?.getLegalData();
    this.datosTecnicos = this.tecnicoTabComponent?.getTecnicoData();
    this.presupuestoRecibido = this.presupuestoTabComponent?.getPresupuesto();
    
    if (this.datosGenerales && this.datosLegales && this.datosTecnicos && this.presupuestoRecibido) {

      const proyecto: Proyecto = {
        nombre: this.nombreProyecto,
        descripcion: this.descripcionProyecto,
        general: this.datosGenerales,
        legal: this.datosLegales,
        tecnico: this.datosTecnicos,
        presupuesto: this.presupuestoRecibido,
        concurso: {} as Concurso,
        demanda: {
          internalid: this.proyectoData?.demanda.internalid || '',
        },
        esFormulacionInterna: false,
      };

      this.proyectosService.putProyectos(proyecto, this.idProyectoBorrador).subscribe({
        next: (response) => {
          this.mostrarDialog = true;
        },
        error: (error) => {
          console.error('Error al guardar el proyecto:', error);
        }
      });
    }
  }


  guardarYVolver() {
    this.datosGenerales = this.generalTabComponent?.getGeneralData();
    this.datosLegales = this.legalTabComponent?.getLegalData();
    this.datosTecnicos = this.tecnicoTabComponent?.getTecnicoData();
    this.presupuestoRecibido = this.presupuestoTabComponent?.getPresupuesto();
    ;
    if (this.datosGenerales) {

      const proyecto: Proyecto = {
        nombre: this.nombreProyecto,
        descripcion: this.descripcionProyecto,
        general: this.datosGenerales,
        legal: this.datosLegales,
        tecnico: this.datosTecnicos,
        presupuesto: this.presupuestoRecibido,
        concurso: {} as Concurso,
        demanda: {
          internalid: this.proyectoData?.demanda.internalid || '',
        },
        esFormulacionInterna: false,
      };

      this.proyectosService.putProyectos(proyecto, this.idProyectoBorrador ).subscribe({
        next: (response) => {
          window.location.href = '/proyectos-home';
        },
        error: (error) => {
          console.error('Error al guardar el proyecto:', error);
        }
      });
    }
  }

  obtenerDatosCompletos(): Proyecto {
    try {
      return {
        nombre: this.nombreProyecto,
        descripcion: this.descripcionProyecto,
        general: this.generalTabComponent?.getGeneralData() || {} as General,
        legal: this.legalTabComponent?.getLegalData() || {} as Legal,
        tecnico: this.tecnicoTabComponent?.getTecnicoData() || {} as Tecnico,
        presupuesto: this.presupuestoTabComponent?.getPresupuesto() || {} as Presupuesto,
        concurso: {} as Concurso,
        demanda: {
          internalid: this.proyectoData?.demanda.internalid || '',
        },
        esFormulacionInterna: false,
      };
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      return {} as Proyecto;
    }
  }

  ngAfterViewInit() {
  this.proyectoCompleto = this.obtenerDatosCompletos();
  }

  ngOnInit() {  

    console.log(this.obtenerDatosCompletos())

    this.esRutaAsignado = this.router.url.includes('/asignado');

    this.activeTabIndex = this.esRutaAsignado ? 4 : 0;

    this.route.params.subscribe(params => {
      this.idProyectoBorrador = params['id'];

      this.proyectosService.getProyectoId(this.idProyectoBorrador).subscribe({
        next: (resp) => {
          console.log('respuesta: ', resp.demanda);
          this.proyectoData = resp;
          this.nombreProyecto = resp.nombre;
          this.descripcionProyecto = resp.descripcion

          this.nombreUsuarioDemanda = resp.demanda?.usuario || '';
          this.rutUsuarioDemanda = resp.demanda?.rut || '';
          this.respuestaNumeroDemanda = resp.demanda?.id || 0;
          this.instrumentoDemanda = resp.demanda?.instrumento || '';
          this.estadoDemanda = resp.demanda?.estado || '';
          this.chipColor = resp.demanda?.estado === 'ADMISIBLE' ? 'success' : 'error';

          if (resp.estado === 'BORRADOR'|| resp.estado === 'APROBADO' || resp.estado === 'ASIGNADO') {
            this.estadoProyecto = true;
          }else{
            this.estadoProyecto = false;
          }
      }});
    });

    this.proyectosService.postValidarProyecto(this.idProyectoBorrador).subscribe({
      next: (response) => {
        if (response && response.detalles['Proyecto con prefactibilidad'] === 'FALLIDA') {
          this.esPrefactibilidadFallida = true;
        } else {
          this.esPrefactibilidadFallida = false;
        }
      },
      error: (error) => {
        console.error('Error al validar la prefactibilidad:', error);
      }
    });

    this.breadcrumb = [
      { label: 'Escritorio', url: '/riego-home' },
      { label: 'Proyectos', url: '/proyectos-home' },
      { label: 'Crear proyecto', url: '/formulario-proyectos' }
    ]
  }

  /**
   * Obtiene los datos del proyecto
   * nombre: string;
     descripcion: string;
     fechaCreacion?: string;
     estado?: string;
     general: General;
     legal: Legal;
     tecnico: Tecnico;
     presupuesto: Presupuesto;
     concurso?: Concurso;
     demanda: Demanda;
     esFormulacionInterna: boolean;
     internalid?: string;
     evaluacion?: ProyectoEvaluacion
   */
    actualizarDatosDelProyecto() {
      this.displayDialog = false;

    let proyectoBorrador = {
      nombre: this.nombreProyecto,
      descripcion: this.descripcionProyecto,
      fechaCreacion: this.proyectoData?.demanda.fechaCreacion || '',
      estado: this.proyectoData?.demanda.estado || '',
      general: this.proyectoData?.general || {} as General,
      legal: this.proyectoData?.legal || {} as Legal,
      tecnico: this.proyectoData?.tecnico || {} as Tecnico,
      presupuesto: this.proyectoData?.presupuesto || {} as Presupuesto,
      concurso: this.proyectoData?.concurso || {} as Concurso,
      demanda: this.proyectoData?.demanda || {} as Demanda,
      esFormulacionInterna: this.proyectoData?.esFormulacionInterna || false,
      internalid: this.proyectoData?.internalid || '',
      //evaluacion: this.proyectoData?.evaluacion || {} as ProyectoEvaluacion      
    }

    console.log('proyectoBorrador', proyectoBorrador);
  
    this.proyectosService.putProyectos(proyectoBorrador, this.idProyectoBorrador).subscribe({
      next: response => {
        this.proyecto = response;
        this.idProyectoBorrador = this.proyecto.internalid!;
      },
      error: error => {
        console.error('Error al guardar el proyecto borrador:', error);
      }
    });
    
  }

  editarProyecto() {
    console.log('Editar proyecto');
    this.displayDialog = true;
  }
}

