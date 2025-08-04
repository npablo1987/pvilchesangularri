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
  selector: 'app-priorizacion-final-dialog',
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
  templateUrl: './priorizacion-final-dialog.component.html',
  styleUrl: './priorizacion-final-dialog.component.scss'
})
export class PriorizacionFinalDialogComponent implements OnInit {

  private _displayDialog = false;


  constructor(
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
  
  
  @Output() onConfirmar = new EventEmitter<boolean>();

  guardarEvaluacion() {
    this.displayDialog = false;
    this.onConfirmar.emit(true); // Emitir confirmación
  }

  @Output() displayDialogChange = new EventEmitter<boolean>();
  
  ngOnInit(): void {
  }
}

