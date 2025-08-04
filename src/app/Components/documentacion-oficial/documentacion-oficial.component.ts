// TODO: Revisar implementacion
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonsComponent } from '../buttons/buttons.component';
import { Archivo } from '../../interfaces/proyecto.interfaces';
import { ProyectosService } from '../../services/proyectos.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-documentacion-oficial',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonsComponent
  ],
  templateUrl: './documentacion-oficial.component.html',
  styleUrl: './documentacion-oficial.component.scss'
})
export class DocumentacionOficialComponent implements OnInit {

  idProyectoBorrador: string = '';

  @Input() subTitulo: string = '';
  @Input() subTexto: string = '';
  @Input() textoFormato: string = '';
  @Input() tamanio: string = '';
  @Output() archivoCargado = new EventEmitter<Archivo>();

  constructor(
    private route: ActivatedRoute,
    private proyectoService: ProyectosService
  ) {}

  archivoSubido: Archivo | undefined;
  //FIX: cambiar a onclick falta link
  //@Input() linkFormato: string = '';

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

   onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const maxSizeInBytes = Number(this.tamanio) * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        alert(`El archivo excede el tamaño máximo permitido de ${this.tamanio} MB`);
        return;
      }

      this.proyectoService.postSubirArchivo(this.idProyectoBorrador, file).subscribe({
        next: (response) => {
          this.archivoSubido = response;
          this.archivoCargado.emit(this.archivoSubido); 
        },
        error: (error) => {
          console.error('Error al subir el archivo:', error);
          alert('No se pudo subir el archivo. Inténtelo nuevamente.');
        },
      });
    }
  }

  ngOnInit(): void {

  this.route.params.subscribe(params => {
        this.idProyectoBorrador = params['id'];
      });
  }
}
