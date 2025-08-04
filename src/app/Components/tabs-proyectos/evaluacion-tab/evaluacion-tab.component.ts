import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { EvaluacionDialogComponent } from '../../evaluacion-dialog/evaluacion-dialog.component';
import { ProyectosService } from '../../../services/proyectos.service';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Criterio, Proyecto } from '../../../interfaces/proyecto.interfaces';
import { ConcursoService } from '../../../services/concurso.service';
import { Concurso } from '../../../interfaces/concursos.interfaces';

@Component({
  selector: 'app-evaluacion-tab',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    EvaluacionDialogComponent
  ],
  templateUrl: './evaluacion-tab.component.html',
  styleUrl: './evaluacion-tab.component.scss'
})
export class EvaluacionTabComponent implements OnInit {

  // @Input() proyectoCompleto: Proyecto = {} as Proyecto;

  responsable: string = "María del Cármen Rodriguez Pérez "
  evaluarDialog: boolean = false;
  proyectoId: string = '';
  fechaEvaluacion?: string = '';
  evaluacionFavorable: boolean = false;
  fechaEntrega: string = '';
  observacionEvaluacion: string = '';
  nombreProyecto: string = '';
  presentaObservaciones: boolean = false;
  proyectoActualizado!: Proyecto;
  idConcurso: string = '';
  concursoCriterios!: Criterio[];
  concursoProyecto!: Concurso;


  constructor(
     private proyectoService: ProyectosService,
     private route: ActivatedRoute,
     private concursoService: ConcursoService
  ) {}

  descargarPrefactibilidad() {
    this.proyectoService.getDocumentoPrefactibilidad(this.proyectoId).subscribe({
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
    })
  }

  descargarFactibilidad() {
    this.proyectoService.getResumenProyecto(this.proyectoId).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const blob = response.body!;
        const contentDisposition = response.headers.get('Content-Disposition');
        const filenameMatch = contentDisposition?.match(/filename\*?=(?:UTF-8'')?([^;]+)/i);
        
        const filename = filenameMatch 
          ? decodeURIComponent(filenameMatch[1]) 
          : `Resumen_proyecto_${this.nombreProyecto}.pdf`;

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      },
      error: (error) => {
        console.error('Error en descarga:', error);
        // Mostrar mensaje de error al usuario
      }
    });
  }

  evaluarProyecto() {
    // if (this.presentaObservaciones && this.proyectoCompleto) {
    //   this.proyectoActualizado = {
    //     ...this.proyectoCompleto,
    //     evaluacion: {
    //       proyectoInternalid: this.proyectoId,
    //       decision: 'PRESENTA_OBSERVACIONES',
    //       fecha: new Date().toISOString(),
    //       observaciones: this.observacionEvaluacion,
    //       criterioRegionalParaPriorizacion: 0,
    //       criterioSustentabilidadAgroambiental: 0
    //     }
    //   };
    //   this.evaluarDialog = true;
    // } else {
      this.evaluarDialog = true;
    // }
  }

   onDialogClose() {
    this.evaluarDialog = false;
  }

  // sumar15Dias(fechaString: string): string {
  //   // Validar formato ISO 8601 básico
  //   const isoRegex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(\.\d+)?(Z)$/i;
  //   const match = fechaString.match(isoRegex);
    
  //   if (!match) {
  //     throw new Error('Formato de fecha inválido. Use ISO 8601 (ej: 2025-03-26T17:48:45.308654Z)');
  //   }

  //   // Extraer componentes
  //   const [_, fechaHora, fraccionSegundos = '.000000', z] = match;
    
  //   // Parsear fecha
  //   const fecha = new Date(fechaString);
  //   if (isNaN(fecha.getTime())) throw new Error('Fecha inválida');

  //   // Sumar 15 días en UTC
  //   fecha.setUTCDate(fecha.getUTCDate() + 15);

  //   // Mantener la fracción de segundos original o usar ceros
  //   const fraccionFormateada = fraccionSegundos
  //     .padEnd(7, '0')  // Asegurar 6 dígitos + punto
  //     .slice(0, 7)     // Cortar a .xxxxxx
  //     .replace('.', '');

  //   // Construir nueva fecha en formato idéntico
  //   return fecha.toISOString()
  //     .replace(/(\d{2}:\d{2}:\d{2})\.\d+/, `$1.${fraccionFormateada}`);
  // }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
    this.proyectoId = params['id'];
  });

  this.proyectoService.getProyectoId(this.proyectoId).subscribe({
    next: (resp) => {
      this.idConcurso = resp.concurso?.internalid || ''
      if(resp.evaluacion?.decision === 'RECOMENDACION_FAVORABLE') {
        this.evaluacionFavorable = true
        this.fechaEvaluacion = resp.evaluacion.fecha
        this.nombreProyecto = resp.nombre
        console.log(resp.evaluacion, 'evaluacion')
      }else {
        this.evaluacionFavorable = false 
        this.fechaEvaluacion = resp.evaluacion?.fecha
        this.observacionEvaluacion = resp.evaluacion?.observaciones || ''
        this.nombreProyecto = resp.nombre
        this.presentaObservaciones = true
        console.log(resp, 'evaluacion')
      }
    }
  })

  this.proyectoService.getProyectoCriterios(this.idConcurso).subscribe({
    next: (resp) => {
      this.concursoCriterios = resp[0].criterios
    }
  })

  this.concursoService.getConcursoPorId(this.idConcurso).subscribe({
    next: (resp) => {
      this.concursoProyecto = resp
      this.fechaEntrega = this.concursoProyecto.fechaCierrePostulacion.toString()
    }
  })
  

  }

  
}
