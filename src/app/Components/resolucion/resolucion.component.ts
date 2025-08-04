import { Component, ChangeDetectorRef, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CeroPapelService } from '../../services/ceroPapel.service';
import { CommonModule } from '@angular/common';
import { CeroPapelResponse, Documento } from '../../interfaces/ceroPapel.interfaces';
import { downloadPDF, obtenerTipoDocumento } from '../../utils/descargarPDF';

@Component({
  selector: 'app-resolucion',
  standalone: true,
  imports: [InputTextModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './resolucion.component.html',
  styleUrls: ['./resolucion.component.scss']
})
export class ResolucionComponent {

  errorVinculacion: number = 0;
  codigoResolucion: string = '';
  resolucion: CeroPapelResponse | null = null;
  documento: Documento | null = null;
  descargarPDF: any;
  numeroResolucion: string = '';
  nombreDocumento: string = '';
  exito: boolean = false;
  mensajeExito: string = '';

  constructor(private ceroPapelService: CeroPapelService, private cdr: ChangeDetectorRef) { }

  @Input() codigoResolucionInput: string = '';

  @Output() codigoResolucionEmitido: EventEmitter<string> = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['codigoResolucionInput'] && this.codigoResolucionInput) {
      this.codigoResolucion = this.codigoResolucionInput;
      this.vincularCeroPapel(); 
    }
  }

  vincularCeroPapel() {
    this.ceroPapelService.getVincularCeroPapel(this.codigoResolucion).subscribe(vinculacion => {
      const { cant, documentos, success } = vinculacion;
      const [documento] = documentos;
      const { numero_resolucion, pdf } = documento;
      this.respuestaCeroPapel(pdf, numero_resolucion, success, cant);
      this.codigoResolucionEmitido.emit(this.codigoResolucion);
    });
  }

  obtenerNombreDescarga(documento: string): string {
    const codigo = parseInt(documento.slice(0, 4), 10);
    const tipoDocumento = obtenerTipoDocumento(codigo);
    return `${tipoDocumento} ${documento}`;
  }

  respuestaCeroPapel(pdf: any, numeroResolucion: string, mensajeExito: string, errorVinculacion: number) {
    this.descargarPDF = pdf;
    this.numeroResolucion = numeroResolucion;
    this.nombreDocumento = this.obtenerNombreDescarga(numeroResolucion);
    if (mensajeExito === 'true') {
      this.exito = true;
      this.codigoResolucionEmitido.emit(this.codigoResolucion);
    }
    this.errorVinculacion = errorVinculacion;

    this.cdr.detectChanges();
  }
  descargaPDF() {
    downloadPDF(this.descargarPDF, this.obtenerNombreDescarga(this.numeroResolucion) + '.pdf');
  }

  borrarPDF() {
    this.exito = false;
  }
}
