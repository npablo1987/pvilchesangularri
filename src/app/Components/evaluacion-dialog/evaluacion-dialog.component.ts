import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProyectosService } from '../../services/proyectos.service';
import { Concurso, Criterio, Proyecto, ProyectoEvaluacion } from '../../interfaces/proyecto.interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluacion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    DividerModule,
    RadioButtonModule,
    InputTextareaModule
  ],
  templateUrl: './evaluacion-dialog.component.html',
  styleUrl: './evaluacion-dialog.component.scss'
})
export class EvaluacionDialogComponent implements OnInit {
  @Input() proyectoInternalId!: string;
  @Input() proyectoAEvaluar?: Proyecto;
  @Input() concursoCriterios?: Criterio[];

  private _displayDialog = false;
  evaluacionFavorable: boolean = false;
  observacionesEvaluacion: string = '';
  opcionAsesoriaSeleccionada: number = 0;
  criterioNacionalSeleccionado: boolean = false;  
  fechaObservaciones: string = '';
  fechaPlazo: string = '';

  selectedOptions: { [key: string]: number } = {};
  

  constructor(
    private proyectoService: ProyectosService,
    private router: Router
  ) {

  }
  
  @Input() 
  get displayDialog(): boolean {
    return this._displayDialog;
  }
  
  set displayDialog(value: boolean) {
    if (this._displayDialog !== value) {
      this._displayDialog = value;
      this.displayDialogChange.emit(value);
    }
  }
  
  
  guardarEvaluacion() {
  if (this.proyectoAEvaluar && this.router.url.includes('/asignado')) {
    this.guardarEvaluacionConObservaciones();
  } else {
    this.guardarEvaluacionSimple();
  }
}

 private guardarEvaluacionConObservaciones() {
    if (!this.observacionesEvaluacion) {
      alert('Debe ingresar observaciones');
      return;
    }

    const proyectoEnviar: Proyecto = {
      ...this.proyectoAEvaluar!,
      evaluacion: {
        ...this.proyectoAEvaluar!.evaluacion!,
        observaciones: this.observacionesEvaluacion,
        fecha: new Date().toISOString()
      }
    };

    this.proyectoService.postProyectoSolicitarEvaluar(
      this.proyectoInternalId,
      proyectoEnviar
    ).subscribe({
      next: (response) => {
        this.mostrarResultado();
        this.displayDialog = false;
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
  

private guardarEvaluacionSimple() {
  // Construir array de respuestas de criterios
  const respuestasCriterios = this.concursoCriterios?.map(criterio => ({
    nombre: criterio.nombre,
    ponderacion: criterio.ponderacion, // Asumiendo que el criterio tiene esta propiedad
    variableSeleccionada: this.obtenerVariableSeleccionada(criterio, this.selectedOptions[criterio.nombre]),
    variableSeleccionadaPuntaje: this.selectedOptions[criterio.nombre] || 0
  })) || [];

  const proyectoEvaluar: ProyectoEvaluacion = {
    proyectoInternalid: this.proyectoInternalId,
    decision: this.evaluacionFavorable ? 'RECOMENDACION_FAVORABLE' : 'PRESENTA_OBSERVACIONES',
    observaciones: this.observacionesEvaluacion || '',
    criterioRegionalParaPriorizacion: this.evaluacionFavorable ? 50 : 0,
    criterioSustentabilidadAgroambiental: this.evaluacionFavorable ? 100 : 0,
    respuestasCriterios: respuestasCriterios
  };

  console.log('Datos a enviar:', proyectoEvaluar);

  this.proyectoService.postProyectoEvaluar(proyectoEvaluar)
    .subscribe({
      next: (response) => {
        this.mostrarResultado();
        this.displayDialog = false;
      },
      error: (error) => {
        console.error('Error:', error);
        alert('Error al enviar la evaluación');
      }
    });
}

private obtenerVariableSeleccionada(criterio: Criterio, puntaje: number): string {
  // Asumiendo que el criterio tiene una propiedad 'variables' con las opciones posibles
  const variable = criterio.variables?.find(v => v.puntaje === puntaje);
  return variable ? variable.nombre : 'No seleccionado';
}

private mostrarResultado() {
  window.location.reload();
}

  // private calcularFechas(): void {
  //   const hoy = new Date();
    
  //   const fechaObservacionesUTC = new Date(Date.UTC(
  //     hoy.getUTCFullYear(),
  //     hoy.getUTCMonth(),
  //     hoy.getUTCDate()
  //   ));
    
  //   const fechaPlazoUTC = new Date(fechaObservacionesUTC);
  //   fechaPlazoUTC.setUTCDate(fechaPlazoUTC.getUTCDate() + 15);

  //   this.fechaObservaciones = this.formatearFechaUTC(fechaObservacionesUTC);
  //   this.fechaPlazo = this.formatearFechaUTC(fechaPlazoUTC);
  // }

  // private formatearFechaUTC(fecha: Date): string {
  //   return `${this.agregarCero(fecha.getUTCDate())}-${this.agregarCero(fecha.getUTCMonth() + 1)}-${fecha.getUTCFullYear()}`;
  // }

  // private agregarCero(valor: number): string {
  //   return valor < 10 ? `0${valor}` : `${valor}`;
  // }
  
  @Output() displayDialogChange = new EventEmitter<boolean>();
  
  ngOnInit(): void {
  }
}
