// TODO: Revisar si se va a utilizar
import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { Archivo } from '../../interfaces/proyecto.interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-adjuntar-archivos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule],
  templateUrl: './adjuntar-archivos.component.html',
  styleUrls: ['./adjuntar-archivos.component.scss']
})
export class AdjuntarArchivosComponent implements OnInit {
  @Input() titulo: string = '';
  @Input() tamanioArchivo: string = '';
  @Input() data: Archivo[] = [];

  @Input() onFileSelected: (event: Event) => void = () => {}; 
  @Input() guardarArchivo: () => void = () => {}; 
  @Input() eliminarArchivo: (archivo: Archivo) => void = () => {}; 

  constructor() {}

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelectedChange(event: Event): void {
    this.onFileSelected(event);
  }

  guardarArchivoClick() {
    this.guardarArchivo();
  }

  eliminarArchivoClick(rowData: Archivo) {
    this.eliminarArchivo(rowData);
  }

  ngOnInit(): void {}
}
