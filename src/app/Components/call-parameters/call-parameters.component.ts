import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { Concurso, Criterio, CriterioGet, FocalizacionConcurso, FondosConcurso, Instrumentos, TipoConcurso, VariablesCriterio } from '../../interfaces/concursos.interfaces';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CriteriosComponent } from '../criterios/criterios.component';
import { ResolucionComponent } from '../resolucion/resolucion.component';
import { FocalizacionComponent } from '../focalizacion/focalizacion.component';
import { ConcursoService } from '../../services/concurso.service';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChipComponent } from '../chip/chip.component';


export interface CriterioEnvio {
  nombre: string;
  ponderacion: number;
  variables: VariablesCriterio[];
}

@Component({
  selector: 'app-call-parameters',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    RadioButtonModule,
    CriteriosComponent,
    ResolucionComponent,
    FocalizacionComponent,
    DividerModule,
    DialogModule,
    InputTextareaModule,
    ChipComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './call-parameters.component.html',
  styleUrls: ['./call-parameters.component.scss']
})

export class CallParametersComponent implements OnInit {
  displayDialog: boolean = false;

  concursoForm: FormGroup;

  @ViewChild(ResolucionComponent) resolucionComponent!: ResolucionComponent;

  @Input() instrumentos: Instrumentos[] = [];
  
  motivoRechazo: string = '';
  decision: string = '';
  dialogTitle: string = '';
  fondoConcurso: FondosConcurso[] = [];
  selectedFondo: FondosConcurso | undefined;
  instrumentoConcurso: Instrumentos[] = [];
  instrumentoSeleccionado!: Instrumentos;
  tipoConcurso: TipoConcurso[] = [];
  selectedTipoConsurso: TipoConcurso | undefined;
  editar: boolean = false;
  aprobacion: boolean = false;
  focalizacion!: FocalizacionConcurso;
  criterios: Criterio[] = [];
  codigoResolucion: string = '';
  criteriosEditar: CriterioGet[] = [];
  disableFocalizacion: boolean = false;
  criteriosAprobar: boolean = false;
  concursoID: number = 0;
  concursoEstado: string = '';
  verLlamado: boolean = false;
  esRevisionConcurso: boolean = false;
  textoChip: string = '';

  constructor(
    private concursoService: ConcursoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.concursoForm = this.fb.group({
      internalid: [{ value: '', disabled: false }, [Validators.required]],
      nombreConcurso: [{ value: '', disabled: false }, [Validators.required]],
      selectedFondo: [{ value: '', disabled: false }, [Validators.required]],
      selectedInstrumento: [{ value: '', disabled: false }, [Validators.required]],
      selectedTipoConsurso: [{ value: '', disabled: false }, [Validators.required]],
      presupuestoConcurso: [{ value: 0, disabled: false }, [Validators.required]],
      montoMaximo: [{ value: 0, disabled: false }, [Validators.required]],
      porcentajeMaximo: [{ value: 0, disabled: false }, [Validators.required]],
      fechaInicioPostulacion: [{ value: '', disabled: false }, [Validators.required]],
      fechaCierrePostulacion: [{ value: '', disabled: false }, [Validators.required]],
      fechaEstimadaResultados: [{ value: '', disabled: false }, [Validators.required]],
      operacionTemprana: [{ value: false, disabled: false }, [Validators.required]],
      anio: [{ value: '', disabled: false }, [Validators.required]]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.editar = true;
        this.concursoService.getConcursoPorId(id).subscribe(concurso => {
          if (concurso.estado === 'Aprobado') {
            this.verLlamado = true;
          }
          setTimeout(() => {
            if (concurso.motivoRechazo) {
              this.motivoRechazo = concurso.motivoRechazo;
            }
            this.concursoID = concurso.id ?? 0;
            this.concursoEstado = concurso.estado;
            if (concurso.estado === 'Publicado') {
              this.textoChip = 'Publicado';
            } else {
              this.textoChip = this.concursoEstado;
            }
            const selectedFondo = this.fondoConcurso.find(fondo => fondo.name === concurso.origenFondos);
            const selectedInstrumento = this.instrumentoConcurso.find(instrumento => instrumento.name === concurso.instrumento);
            const selectedTipoConsurso = this.tipoConcurso.find(tipo => tipo.name === concurso.tipoConcurso);
            
            this.criteriosEditar = concurso.criterios;
            this.concursoForm.patchValue({
              internalid: id,
              nombreConcurso: concurso.nombre,
              selectedFondo: selectedFondo,
              selectedInstrumento: selectedInstrumento,
              selectedTipoConsurso: selectedTipoConsurso,
              presupuestoConcurso: concurso.presupuesto,
              montoMaximo: concurso.montoMaximo,
              porcentajeMaximo: concurso.porcentajeMaximo,
              identificadorResolucion: concurso.identificadorResolucion,
              fechaInicioPostulacion: concurso.fechaInicioPostulacion ? new Date(concurso.fechaInicioPostulacion) : new Date(),
              fechaCierrePostulacion: concurso.fechaCierrePostulacion ? new Date(concurso.fechaCierrePostulacion) : new Date(),
              fechaEstimadaResultados: concurso.fechaEstimadaResultados ? new Date(concurso.fechaEstimadaResultados) : new Date(),
              operacionTemprana: concurso.esLlamadoOperacionTemprana ? 'si' : 'no',
              anio: concurso.añoPresupuestario
            });

            this.focalizacion = {
              region: { nombre: concurso.focalizacionRegion, cod:concurso.focalizacionIdRegion },
              area: { nombre: concurso.focalizacionArea, cod: concurso.focalizacionIdArea },
              comunas: concurso.focalizacionComunas
            };
            if (this.route.snapshot.url.join('/').includes('formulario-llamados/revision')) {
              this.codigoResolucion = concurso.identificadorResolucion
              this.editar = false;
              this.disableFocalizacion = true;
              this.criteriosAprobar = true;
              this.aprobacion = true;
              this.concursoForm.disable();
            }

            if (this.editar || this.aprobacion) {
              this.codigoResolucion = concurso.identificadorResolucion
              if (this.resolucionComponent) {
                this.resolucionComponent.codigoResolucionInput = this.codigoResolucion;
                this.resolucionComponent.vincularCeroPapel();
              }
            }
          }, 1000);
        });
      }
    });
  }

  get chipColor(): 'success' | 'error' {
    if (this.textoChip === 'Publicado') {
      return 'success';
    } else {
      return 'error';
    }
  }

  manejarCodigoResolucion(codigo: string) {    
    this.codigoResolucion = codigo;
  }    
  
  onCriteriosChange(criterios: Criterio[]) {
    this.criterios = criterios;
  }
  onFocalizacionChange(focalizacion: FocalizacionConcurso) {
    const { region, area, comunas } = focalizacion
      this.focalizacion = {
          area: area,
          region: region,
          comunas: comunas
      };
  }

  isFormValidForAction(action: string): boolean {
    if (action === 'publicar') {
      const { internalid, ...rest } = this.concursoForm.value;
      return !!this.focalizacion && this.criterios.length > 0;
    } else if (action === 'aprobar') {
      return true;
    } else {
      return this.concursoForm.valid && !!this.focalizacion && this.criterios.length > 0 && !!this.concursoForm.get('internalid')?.value;
    }
  }

  aprobarLlamado() {
    this.displayDialog = true;
    this.dialogTitle = this.concursoForm.get('nombreConcurso')?.value
  }

  volver() {
    window.location.href = '/riego-home';
  }

  guardarDecision() { 
    if (this.decision === 'aprobar') {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id')
        if(id) {
          this.concursoService.aprobarConcurso(id).subscribe(response => {
            window.location.href = '/todos-los-llamados';
          });
        }        
      });
    }else {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id')
        if(id) {
          this.concursoService.rechazarConcurso(id, this.motivoRechazo).subscribe(response => {
            window.location.href = '/todos-los-llamados';
          });
        }        
      });
    }
  }
  guardarYVolver() {
        const criteriosEnvio: Criterio[] = this.criterios.map(criterio => ({
          nombre: criterio.nombre,
          ponderacion: criterio.ponderacion,
          activar: criterio.activar,
          variables: criterio.variables || []
        }));
        const concurso: Concurso = {          
        nombre: this.concursoForm.get('nombreConcurso')?.value,
        origenFondos: this.concursoForm.get('selectedFondo')?.value.name,
        instrumento: this.concursoForm.get('selectedInstrumento')?.value.name,
        tipoConcurso: this.concursoForm.get('selectedTipoConsurso')?.value.name,
        presupuesto: this.concursoForm.get('presupuestoConcurso')?.value,
        montoMaximo: this.concursoForm.get('montoMaximo')?.value,
        porcentajeMaximo: this.concursoForm.get('porcentajeMaximo')?.value,
        fechaInicioPostulacion: new Date(this.concursoForm.get('fechaInicioPostulacion')?.value) || new Date(),
        fechaCierrePostulacion: new Date(this.concursoForm.get('fechaCierrePostulacion')?.value) || new Date(),
        fechaEstimadaResultados: new Date(this.concursoForm.get('fechaEstimadaResultados')?.value) || new Date(),
        añoPresupuestario: this.concursoForm.get('anio')?.value ? this.concursoForm.get('anio')?.value : 2024,
        esLlamadoOperacionTemprana: this.concursoForm.get('operacionTemprana')?.value === 'si',
        estado: 'Borrador',
        identificadorResolucion: this.codigoResolucion,
        criterios: criteriosEnvio,
        focalizacionRegion: this.focalizacion && this.focalizacion.region ? this.focalizacion.region.nombre : '',
        focalizacionIdRegion: this.focalizacion && this.focalizacion.region ? this.focalizacion.region.cod : 0,
        focalizacionArea: this.focalizacion && this.focalizacion.area ? this.focalizacion.area.nombre : '',
        focalizacionIdArea: this.focalizacion && this.focalizacion.area ? this.focalizacion.area.cod : 0,
        focalizacionComunas: this.focalizacion && this.focalizacion.comunas ? this.focalizacion.comunas : []        
      };

      this.concursoService.postGuardarConcurso(concurso).subscribe(response => {
        window.location.href = '/riego-home';
      });
  }
   
  editarLlamado() {
        const criteriosEnvio: Criterio[] = this.criterios.map(criterio => ({
          nombre: criterio.nombre,
          ponderacion: criterio.ponderacion,
          activar: criterio.activar,
          variables: criterio.variables || []
        }));
  
        const concurso: Concurso = {
          internalid: this.concursoForm.get('internalid')?.value,
          nombre: this.concursoForm.get('nombreConcurso')?.value,
          origenFondos: this.concursoForm.get('selectedFondo')?.value.name,
          instrumento: this.concursoForm.get('selectedInstrumento')?.value.name,
          tipoConcurso: this.concursoForm.get('selectedTipoConsurso')?.value.name,
          presupuesto: this.concursoForm.get('presupuestoConcurso')?.value,
          montoMaximo: this.concursoForm.get('montoMaximo')?.value,
          porcentajeMaximo: this.concursoForm.get('porcentajeMaximo')?.value,
          fechaInicioPostulacion: new Date(this.concursoForm.get('fechaInicioPostulacion')?.value),
          fechaCierrePostulacion: new Date(this.concursoForm.get('fechaCierrePostulacion')?.value),
          fechaEstimadaResultados: new Date(this.concursoForm.get('fechaEstimadaResultados')?.value),
          añoPresupuestario: this.concursoForm.get('anio')?.value,
          esLlamadoOperacionTemprana: this.concursoForm.get('operacionTemprana')?.value === 'si',
          estado: 'Pendiente Aprobación',
          identificadorResolucion: this.codigoResolucion,
          criterios: criteriosEnvio,
          focalizacionRegion: this.focalizacion.region.nombre,
          focalizacionIdRegion: this.focalizacion.region.cod,
          focalizacionArea: this.focalizacion.area.nombre,
          focalizacionIdArea: this.focalizacion.area.cod,
          focalizacionComunas: this.focalizacion.comunas
        };
    
        this.concursoService.putConcurso(concurso).subscribe(response => {
          window.location.href = '/riego-home';
        });
  }

  publicarLlamado() {
    if (this.isFormValidForAction('publicar')) {
      if (this.focalizacion && this.criterios.length > 0) {
        const criteriosEnvio: Criterio[] = this.criterios.map(criterio => ({
          nombre: criterio.nombre,
          ponderacion: criterio.ponderacion,
          activar: criterio.activar,
          variables: criterio.variables || []
        }));
  
        const concurso: Concurso = {
          nombre: this.concursoForm.get('nombreConcurso')?.value,
          origenFondos: this.concursoForm.get('selectedFondo')?.value.name,
          instrumento: this.concursoForm.get('selectedInstrumento')?.value.name,
          tipoConcurso: this.concursoForm.get('selectedTipoConsurso')?.value.name,
          presupuesto: this.concursoForm.get('presupuestoConcurso')?.value,
          montoMaximo: this.concursoForm.get('montoMaximo')?.value,
          porcentajeMaximo: this.concursoForm.get('porcentajeMaximo')?.value,
          fechaInicioPostulacion: new Date(this.concursoForm.get('fechaInicioPostulacion')?.value),
          fechaCierrePostulacion: new Date(this.concursoForm.get('fechaCierrePostulacion')?.value),
          fechaEstimadaResultados: new Date(this.concursoForm.get('fechaEstimadaResultados')?.value),
          añoPresupuestario: this.concursoForm.get('anio')?.value,
          esLlamadoOperacionTemprana: this.concursoForm.get('operacionTemprana')?.value === 'si',
          estado: 'Pendiente Aprobación',
          identificadorResolucion: this.codigoResolucion,
          criterios: criteriosEnvio,
          focalizacionRegion: this.focalizacion.region.nombre,
          focalizacionIdRegion: this.focalizacion.region.cod,
          focalizacionArea: this.focalizacion.area.nombre,
          focalizacionIdArea: this.focalizacion.area.cod,
          focalizacionComunas: this.focalizacion.comunas
        };
        this.concursoService.postCrearConcurso(concurso).subscribe(response => {
          const navigationExtras: NavigationExtras = {
            state: {
              nombreConcurso: concurso.nombre
            }
          };
          this.router.navigate(['/confirmacion'], navigationExtras);
        });
      } else {
        return;
      }
    } else {
      return;
    }
  }
  

  ngOnInit(): void {

    this.concursoForm.get('selectedInstrumento')?.valueChanges.subscribe(value => {
      if (value) {
        this.instrumentoSeleccionado = value;
      }
    });
    

    this.concursoService.getInstrumentos().subscribe((instrumentos: Instrumentos[]) => {
      this.instrumentoConcurso = instrumentos;
    });

    this.concursoService.getTipoConcurso().subscribe((tipos: TipoConcurso[]) => {
      this.tipoConcurso = tipos;
    });

    this.concursoService.getFondoConcurso().subscribe((fondos: FondosConcurso[]) => {
      this.fondoConcurso = fondos;
    });
  
    if (this.editar) {
      this.concursoForm.enable();
    } else if (this.aprobacion) {
      this.concursoForm.enable();
      this.concursoForm.get('internalid')?.clearValidators();
      this.concursoForm.get('internalid')?.updateValueAndValidity();
    } else {
      this.concursoForm.get('internalid')?.setValidators(Validators.required);
      this.concursoForm.get('internalid')?.updateValueAndValidity();
      this.concursoForm.enable();
    }

    if (this.route.snapshot.url.join('/').includes('revisionConcurso')) {
      this.disableFocalizacion = true;
      this.criteriosAprobar = true;
      this.aprobacion = false;
      this.concursoForm.disable();
      this.esRevisionConcurso = true
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.concursoService.getConcursoPorId(id).subscribe(concurso => {
            this.concursoEstado = concurso.estado;

          })
        }
      });
    }
  }
  
}
