import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ProyectosService } from '../../services/proyectos.service';
import { ChipComponent } from '../chip/chip.component';
import { Archivo, PreFactibilidad } from '../../interfaces/proyecto.interfaces';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-factibilidad-proyecto-dialog',
  standalone: true,
  imports: [
    DividerModule,
    FormsModule,
    CommonModule,
    DialogModule,
    InputTextModule,
    ChipComponent,
    RadioButtonModule,
    ButtonModule
  ],
  templateUrl: './factibilidad-proyecto-dialog.component.html',
  styleUrl: './factibilidad-proyecto-dialog.component.scss'
})
export class FactibilidadProyectoDialogComponent {
  
  @Input() idProyectoBorrador: string = '';
  @Input() displayDialog: boolean = false;

  factibilidad: boolean = false;
  archivoFactibilidad: Archivo | null = null;
  listadoFactibilidad: Archivo[] = [];
  archivoCargado: boolean = false;

  estado: string = 'Factible';
  constructor(
    private proyectoService: ProyectosService
  ) { }

  triggerFileInput(idInput: string): void {
    const fileInput = document.getElementById(idInput) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    } else {
      console.error(`No se encontró el input de archivo con ID: ${idInput}`);
    }
  }

  subirArchivoPrefactibilidad(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('El archivo es demasiado grande. El tamaño máximo permitido es 5 MB.');
        input.value = '';
        return;
      }

      this.proyectoService.postSubirArchivo(this.idProyectoBorrador, file).subscribe({
        next: (response) => {
          const archivo: Archivo = {
            id: response.id,
            nombre: response.nombre,
            tamaño: response.tamaño,
          };

          this.archivoFactibilidad = archivo;
          this.archivoCargado = true;
          input.value = '';
        },
        error: (error) => {
          console.error('Error al subir el archivo:', error);
          alert('No se pudo subir el archivo. Inténtelo nuevamente.');
          this.archivoCargado = false;
          this.archivoFactibilidad = null;
          input.value = '';
        },
      });
    }
  }

  eliminarArchivoPrefactibilidad(): void {
    this.archivoCargado = false;
    this.archivoFactibilidad = null;
  }
  
  guardarFactibilidad() {
    if(this.archivoFactibilidad){
      const prefactibilidad: PreFactibilidad = {
        archivoId: this.archivoFactibilidad.id,
        nombreArchivo: this.archivoFactibilidad.nombre,
        tamañoArchivo: this.archivoFactibilidad.tamaño,
        esPrefactible: this.factibilidad? true : false,
      }

      this.proyectoService.postPreFactibilidadProyecto(prefactibilidad, this.idProyectoBorrador).subscribe({
        next: (response) => {
          alert('PreFactibilidad guardada exitosamente');
          this.displayDialog = false;
        },
        error: (error) => {
          console.error('Error al guardar la PreFactibilidad:', error);
          alert('No se pudo guardar la PreFactibilidad. Inténtelo nuevamente.');
        },
      });

    }
  }

}
