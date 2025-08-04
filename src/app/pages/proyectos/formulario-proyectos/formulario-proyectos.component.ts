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
import { GeneralTabComponent } from '../../../Components/tabs-proyectos/general-tab/general-tab.component';
import { LegalTabComponent } from '../../../Components/tabs-proyectos/legal-tab/legal-tab.component';
import { TecnicoTabComponent } from '../../../Components/tabs-proyectos/tecnico-tab/tecnico-tab.component';
import { PresupuestoTabComponent } from '../../../Components/tabs-proyectos/presupuesto-tab/presupuesto-tab.component';
import { GuardarProyectoDialogComponent } from '../../../Components/guardar-proyecto-dialog/guardar-proyecto-dialog.component';
import { ProyectosService } from '../../../services/proyectos.service';
import { Concurso, Demanda, General, Legal, Presupuesto, Proyecto, Tecnico } from '../../../interfaces/proyecto.interfaces';
import { FactibilidadProyectoDialogComponent } from '../../../Components/factibilidad-proyecto-dialog/factibilidad-proyecto-dialog.component';
import { ConfirmacionDialogComponent } from '../../../Components/confirmacion-dialog/confirmacion-dialog.component';
import { EvaluacionTabComponent } from '../../../Components/tabs-proyectos/evaluacion-tab/evaluacion-tab.component';
import { SupervisionTabComponent } from '../../../Components/tabs-proyectos/supervision-tab/supervision-tab.component';

@Component({
  selector: 'app-formulario-proyectos',
  standalone: true,
  imports: [
    GeneralTabComponent,
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
    LegalTabComponent,
    TecnicoTabComponent,
    PresupuestoTabComponent,
    GuardarProyectoDialogComponent,
    FactibilidadProyectoDialogComponent,
    ConfirmacionDialogComponent,
    EvaluacionTabComponent,
    SupervisionTabComponent
  ],
  templateUrl: './formulario-proyectos.component.html',
  styleUrl: './formulario-proyectos.component.scss'
})
export class FormularioProyectosComponent {

  datosGenerales: General | null = null;
  datosPresupuesto: Presupuesto | null = null;
  proyectoData: Proyecto | null = null;
  datosLegales: Legal | null = null;
  datosTecnicos: Tecnico | null = null;
  presupuestoRecibido: Presupuesto | null = null;
  proyectoCompleto: Proyecto | null = null;

  @ViewChild(GeneralTabComponent) generalTabComponent!: GeneralTabComponent;
  @ViewChild(LegalTabComponent) legalTabComponent!: LegalTabComponent;
  @ViewChild(TecnicoTabComponent) tecnicoTabComponent!: TecnicoTabComponent;
  @ViewChild(PresupuestoTabComponent) presupuestoTabComponent!: PresupuestoTabComponent;

  nombreProyecto = '';
  descripcionProyecto = '';

  subtitle: string = ''
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
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'prefactibilidad.pdf'
        a.click()
        window.URL.revokeObjectURL(url)
      },
      error: (error) => {
        console.error(error)
      }
    });
 }

 guardarProyecto() {
    this.datosGenerales = this.generalTabComponent.getGeneralData();
    this.datosLegales = this.legalTabComponent.getLegalData();
    this.datosTecnicos = this.tecnicoTabComponent.getTecnicoData();
    this.presupuestoRecibido = this.presupuestoTabComponent.getPresupuesto();
    
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

      console.log('Datos a guardar:', proyecto);

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
    this.datosGenerales = this.generalTabComponent.getGeneralData();
    this.datosLegales = this.legalTabComponent.getLegalData();
    this.datosTecnicos = this.tecnicoTabComponent.getTecnicoData();
    this.presupuestoRecibido = this.presupuestoTabComponent.getPresupuesto();
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
          this.subtitle = resp.descripcion;
          this.proyectoData = resp;
          this.nombreProyecto = resp.nombre;
          this.descripcionProyecto = resp.descripcion
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
}
