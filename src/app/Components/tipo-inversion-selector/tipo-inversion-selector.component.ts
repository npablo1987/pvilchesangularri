import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TipologiaObra } from '../../interfaces/proyecto.interfaces';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tipo-inversion-selector',
  standalone: true,
  imports: [
    CheckboxModule,
    CommonModule
  ],
  templateUrl: './tipo-inversion-selector.component.html',
  styleUrl: './tipo-inversion-selector.component.scss'
})
export class TipoInversionSelectorComponent {

  @Input() tipoInversiones: { 
    nombre: string, 
    selected: boolean, 
    tipologias: TipologiaObra[] 
  }[] = [];

  @Input() nombreTipoInversionSeleccionado?: string;
  
  @Output() tipoInversionesSeleccionada = new EventEmitter<string>();

  ngOnInit(): void {
    if (this.nombreTipoInversionSeleccionado) {
      this.seleccionarPorNombre(this.nombreTipoInversionSeleccionado);
    }
  }

  private seleccionarPorNombre(nombre: string): void {
    this.tipoInversiones.forEach(tipo => {
      tipo.selected = tipo.nombre === nombre;
    });
  }

  onCheckboxChange(tipoSeleccionado: any): void {
    // Desmarcar todos los demás
    this.tipoInversiones.forEach(t => t.selected = false);
    
    // Marcar el seleccionado
    tipoSeleccionado.selected = true;
    
    // Emitir el nombre del tipo seleccionado
    this.tipoInversionesSeleccionada.emit(tipoSeleccionado.nombre);
  }

}
