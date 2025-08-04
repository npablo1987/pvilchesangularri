import { Component, Input, SimpleChanges } from '@angular/core';
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
import { Demanda, GrupoInformalOPersonaJuridica, PreguntasDemanda, TipoUsuarioAgricultor } from '../../../interfaces/demandas.interfaces';
import { RadioButtonComponent } from '../../../Components/radio-button/radio-button.component';
import { DividerModule } from 'primeng/divider';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';
import { IdentificacionAgricultoresComponent } from '../../../Components/demandas/identificacion-agricultores/identificacion-agricultores.component';
import { TableModule } from 'primeng/table';
import { ChipComponent } from '../../../Components/chip/chip.component';
import { INSTRUMENTOS } from '../../../constants/constantes';
import { limpiarRut } from '../../../utils/validaciones';
import { RadioOpciones } from '../../../interfaces/proyecto.interfaces';
import { InputTextareaModule } from 'primeng/inputtextarea';


@Component({
  selector: 'app-demandas-formulario',
  standalone: true,
  imports: [
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
    ChipComponent
  ],
  templateUrl: './demandas-formulario.component.html',
  styleUrl: './demandas-formulario.component.scss'
})
export class DemandasFormularioComponent {
  subtitle: string = 'Busca el rut del usuario y luego responde las preguntas para generar la demanda de este usuario a los programas de riego.'
  textAreaPlaceholder = 'Un proyecto de riego busca optimizar el suministro de agua a cultivos mediante la instalación de sistemas de riego como goteo, aspersión o surcos. Se enfoca en maximizar la eficiencia del uso del agua, mejorar la productividad agrícola y reducir el desperdicio.'
  identificador: string = '';
  breadcrumb: BreadMenuItem[] = [];
  nombreUsuario: string = '';
  rutUsuario: string = '';
  instrumentoUsuario: string = '';
  sexoAgricultor: string = ''; /**revisar */
  acreditacionAgricultor: string = ''; /**revisar */
  selectedInstrumento?: Instrumentos;
  instrumentos: Instrumentos[] = [];
  descripcionDemanda: string = '';
  preguntasDemanda: PreguntasDemanda[] = [];
  respuesta: boolean = false;
  respuestasFinales: PreguntasDemanda[] = [];
  filtrado: boolean = false;
  informacionAgricultorOk: boolean = false;
  demandaCreada!: Demanda;
  demandas: Demanda[] = [];
  esRevision: boolean = false;
  demandaEditar!: Demanda;
  fechaCreacion?: string = '';
  estadoDemanda?: string = '';
  numeroDemanda?: number = 0;
  areaAgencia?: string = '';
  instrumentoRevision?: string = '';
  descripcionRevision?: string = '';
  esEdicion: boolean = false;
  identificadorEditar: string = '';
  esEditar: boolean = false;

  selectedTipoUsuarioAgricultor!: TipoUsuarioAgricultor;
  tiposUsuarioAgricultor: TipoUsuarioAgricultor[] = [];

  rutRepresentanteLegal: string = '';
  filtradoPorAgrupaciones: boolean = false;

  nombreAgrupacion: string = '';

  tipoAgricultor!: TipoUsuarioAgricultor;
  mostrarCamposAgricultor = false;
  resetCampos = false;
  validaFormulario = true;


  constructor(private demandaService: DemandaService, private router: Router, private usuarioService: UsuariosService, private route: ActivatedRoute) { }

  identificadorOk(event: { id: string, nombreUsuario?: string, mostrarCampos: boolean, desplegarDialog?: boolean, gruposOPersonaJuridica?: GrupoInformalOPersonaJuridica[] }) {
    this.mostrarCamposAgricultor = event.mostrarCampos;
    this.nombreUsuario = event.nombreUsuario || '';
    this.rutUsuario = event.id;
    if(!this.esEdicion && !this.esRevision) {
      this.demandaService.getPreguntasDemandas(event.id).subscribe({
         next: (resp) => {
            this.preguntasDemanda = resp;
            this.filtrado = event.mostrarCampos;
          },
          error: (err) => {
            console.error('Error al obtener preguntas:', err);
          }
        });
    }
    this.demandaService.getInstrumentoDemanda(event.id).subscribe({
      next: (resp) => {
        this.instrumentos = resp;
      }
    });

    this.demandaService.getDemandasVigentes(event.id).subscribe({
      next: (resp) => {
        this.demandas = [...resp];
      }
    });
  }
  
  onTipoAgricultorChange(nuevoTipo: TipoUsuarioAgricultor) {
    this.tipoAgricultor = nuevoTipo;
    this.mostrarCamposAgricultor = false;
    this.resetCampos = true;
  }

  resetCompleted() {
    this.resetCampos = false;
  }

  onValueChange(event: boolean | RadioOpciones, index: number) {
    let value: boolean;
    
    if (typeof event === 'object') {
      value = event.respuesta === true;
    } else {
      value = event;
    }

    this.preguntasDemanda[index].respuesta = value;
  }


  crearDemanda() {
    this.demandaCreada = {
      usuario: this.nombreUsuario,
      rut: this.rutUsuario,
      instrumento: this.selectedInstrumento?.name || 'PRI',
      descripcion: this.descripcionDemanda,
      respuestas: this.getFinalValues()
    }

    this.demandaService.postDemanda(this.demandaCreada).subscribe({
      next: (resp) => {
        const navigationExtras: NavigationExtras = {
          state: {
            demandaCreada: this.demandaCreada,
            estadoDemanda: resp.estado,
            idDemanda: resp.id
          }
        };
          this.router.navigate(['/confirmacion-demanda/id'], { 
            state: navigationExtras.state,
            queryParams: { id: resp.internalid }
          });
      },
      error: (err) => {
        console.error('Error al crear demanda:', err);
        this.router.navigate(['/confirmacion-demanda']);
      }
    });
    
  }

  editarDemanda() {
    this.demandaCreada = {
      usuario: this.nombreUsuario,
      rut: this.rutUsuario,
      instrumento: this.selectedInstrumento?.name || 'PRI',
      descripcion: this.descripcionDemanda,
      respuestas: this.getFinalValues()
    }

    this.demandaService.postDemandaDesdeBorrador(this.demandaCreada, this.route.snapshot.queryParams['id']).subscribe({
      next: (resp) => {
        const navigationExtras: NavigationExtras = {
          state: {
            demandaCreada: this.demandaCreada,
            estadoDemanda: resp.estado,
            idDemanda: resp.id,
          }
        };
        this.router.navigate(['/confirmacion-demanda/id'], { 
          state: navigationExtras.state,
          queryParams: { id: resp.internalid }
        });
      },
      error: (err) => {
        console.error('Error al crear demanda:', err);
        this.router.navigate(['/confirmacion-demanda']);
      }
    })    
  }

  guardarYVolver() {
    if (this.selectedInstrumento === undefined) {
      this.demandaCreada = {
        usuario: this.nombreUsuario || '',
        rut: this.rutUsuario || '',
        instrumento: '',
        descripcion: this.descripcionDemanda || '',
        respuestas: this.getFinalValues() || []
      }
    } else {
      this.demandaCreada = {
        usuario: this.nombreUsuario || '',
        rut: this.rutUsuario || '',
        instrumento: this.selectedInstrumento.name || '',
        descripcion: this.descripcionDemanda || '',
        respuestas: this.getFinalValues() || []
      }
    }

    this.demandaService.postDemandaBorrador(this.demandaCreada).subscribe({
      next: (resp) => {
        window.location.href = '/demandas-home'
      }
    });

  }

  volver() {
    window.location.href = '/demandas-home';
  }

  getFinalValues() {
    this.respuestasFinales = this.preguntasDemanda.map(pregunta => ({
      id: pregunta.id,
      pregunta: pregunta.pregunta,
      respuesta: pregunta.respuesta,
      editable: pregunta.editable
    }));
    return this.respuestasFinales;
  }

  verDemanda(demandaId: string) {
    this.demandaService
    this.router.navigate(['/formulario-demandas/revision'], { 
      queryParams: { id: demandaId, esRevision: true }
    });
  }

  get chipColor(): 'success' | 'error' {
    return this.estadoDemanda === 'ADMISIBLE' ? 'success' : 'error';
  }

  descargarDocumentoDeclaracionJurada(): void {
    if (this.route.snapshot.queryParams['id']) {
      this.demandaService.getDocumentoDeclaracionJurada(limpiarRut(this.route.snapshot.queryParams['id'])).subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'declaracion_jurada.pdf';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error al descargar el archivo:', err);
        },
      });
    }
  }

  descargarDocumentoCartaCompromiso(): void {
    if (this.route.snapshot.queryParams['id']) {
      this.demandaService.getDocumentoCartaCompromiso(limpiarRut(this.route.snapshot.queryParams['id'])).subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'carta_compromiso.pdf';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error al descargar el archivo:', err);
        },
      });
    }
 }

  descargarDocumentoListadoConsultores(): void {
    if (this.route.snapshot.queryParams['id']) {
      this.demandaService.getDocumentoListadoConsultores(limpiarRut(this.route.snapshot.queryParams['id'])).subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'listado_consultores.pdf';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error al descargar el archivo:', err);
        },
      });
    }
 }

  descargarDocumentoComprobanteDemanda(): void {
    if (this.route.snapshot.queryParams['id']) {
      this.demandaService.getDocumentoComprobanteDemanda(limpiarRut(this.route.snapshot.queryParams['id'])).subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'comprobante_demanda.pdf';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error al descargar el archivo:', err);
        },
      });
    }
 }

  ngOnInit() {  

    if (this.route.snapshot.queryParams['id']) {
      this.demandaService.getPreguntasDemandas(this.rutUsuario).subscribe({
        next: (resp) => {
          this.preguntasDemanda = resp;
        },
        error: (err) => {
          console.error('Error al obtener preguntas:', err);
        }
      });
    }
    
    this.route.queryParams.subscribe(params => {
      this.esRevision = params['esRevision'] === 'true';
    });

    this.route.queryParams.subscribe(params => {
      this.esEditar = params['editar'] === 'true';
    });

    if (this.esEditar) {
        this.esEdicion = true;
        this.mostrarCamposAgricultor = true;
        this.demandaService.getDemandaPorId(this.route.snapshot.queryParams['id']).subscribe({
          next: (resp) => {
            this.preguntasDemanda = [];
            this.nombreUsuario = resp.usuario;
            this.rutUsuario = resp.rut;
            this.fechaCreacion = resp.fechaCreacion;
            this.estadoDemanda = resp.estado;
            this.numeroDemanda = resp.id;
            this.areaAgencia = resp.agencia;
            this.descripcionDemanda = resp.descripcion;
            this.preguntasDemanda = resp.respuestas.map(pregunta => ({
              ...pregunta,
              respuesta: pregunta.respuesta !== undefined ? pregunta.respuesta : false 
            }));
            this.instrumentoRevision = resp.instrumento;
            this.demandaService.getInstrumentoDemanda(resp.rut).subscribe({
              next: (resp) => {
                this.instrumentos = resp;
                this.selectedInstrumento = this.instrumentos.find(
                  (instrumento) => instrumento.name === this.instrumentoRevision
                );
            }});
            this.identificadorEditar = resp.rut;
          }
        })
      }

    if (this.esRevision) {
      this.mostrarCamposAgricultor = true;
      this.demandaService.getDemandaPorId(this.route.snapshot.queryParams['id']).subscribe({
        next: (resp) => {
          this.preguntasDemanda = [];
          this.nombreUsuario = resp.usuario;
          this.rutUsuario = resp.rut;
          this.fechaCreacion = resp.fechaCreacion;
          this.estadoDemanda = resp.estado;
          this.numeroDemanda = resp.id;
          this.areaAgencia = resp.agencia;
          this.descripcionDemanda = resp.descripcion;
          this.preguntasDemanda = resp.respuestas.map(pregunta => ({
            ...pregunta,
            respuesta: pregunta.respuesta !== undefined ? pregunta.respuesta : false
          }));
          this.instrumentoRevision = resp.instrumento;
          this.demandaService.getInstrumentoDemanda(resp.rut).subscribe({
            next: (resp) => {
              this.instrumentos = resp;
              this.selectedInstrumento = this.instrumentos.find(
                (instrumento) => instrumento.name === this.instrumentoRevision
              );
          }});
        }
      })
    }

    this.usuarioService.getTipoUsuarioAgricultor().subscribe({
      next: (resp) => {
        this.tiposUsuarioAgricultor = resp
      }
    });

    this.breadcrumb = [
      { label: 'Escritorio', url: '/riego-home' },
      { label: 'Demandas', url: '/demandas-home' },
      { label: 'Crear demanda', url: '/formulario-demandas' }
    ]

  }
}
