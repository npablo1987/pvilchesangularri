import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-confirmacion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    DividerModule,
  ],
  templateUrl: './confirmacion-dialog.component.html',
  styleUrl: './confirmacion-dialog.component.scss',
})

export class ConfirmacionDialogComponent {
  @Input() display: boolean = false;
  @Input() isSuccess: boolean = false; 
  @Input() successMessage: string = 'Se ha guardado correctamente el proyecto.';
  @Input() errorMessage: string = 'El formulario no está completo. Verifica los campos requeridos.';
  @Output() onConfirm: EventEmitter<void> = new EventEmitter<void>();
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>(); 

  confirmar() {
    this.onConfirm.emit();
    this.display = false;
  }

  salir() {
    this.display = false;
    this.onClose.emit();
  }
}