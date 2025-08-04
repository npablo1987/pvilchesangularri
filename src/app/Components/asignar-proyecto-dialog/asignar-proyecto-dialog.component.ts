import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ChipComponent } from '../chip/chip.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { ProyectosService } from '../../services/proyectos.service';
import { Proyecto, UsuariosEvaluadores } from '../../interfaces/proyecto.interfaces';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmacionDialogComponent } from '../confirmacion-dialog/confirmacion-dialog.component';

@Component({
  selector: 'app-asignar-proyecto-dialog',
  standalone: true,
  imports: [
      DividerModule,
      FormsModule,
      CommonModule,
      DialogModule,
      InputTextModule,
      ChipComponent,
      RadioButtonModule,
      ButtonModule,
      DropdownModule,
      ConfirmacionDialogComponent
    ],
  templateUrl: './asignar-proyecto-dialog.component.html',
  styleUrl: './asignar-proyecto-dialog.component.scss'
})
export class AsignarProyectoDialogComponent implements OnInit {

  @Input() idProyectoBorrador: string = '';
  @Input() displayDialog: boolean = false;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>(); 

  mostrarDialog: boolean = false;
  esExito: boolean = false;

  nombreProyecto: string = '';
  regionProyecto: string = '';
  comunaProyecto: string = '';

  selectedUsuarioAsignacion: UsuariosEvaluadores | null = null;
  usuariosAsignacionOptions: UsuariosEvaluadores[] = [];
  proyecto: Proyecto = {} as Proyecto;
  
  constructor(
    private proyectoService: ProyectosService
  ) { }  

  cerrarDialogo() {
    this.onClose.emit();
  }
 
  guardarAsignacion() {
    if (this.selectedUsuarioAsignacion) {
      this.proyectoService
        .postAsignarProyecto(this.idProyectoBorrador, this.selectedUsuarioAsignacion)
        .subscribe({
          next: (response) => {
            this.displayDialog = false;
            this.mostrarDialog = true;
            this.esExito = true;
            this.cerrarDialogo();
            window.location.href = '/proyectos-home';
          },
          error: (error) => {
            this.mostrarDialog = true;
            this.esExito = false;
            this.cerrarDialogo();
            console.error('Error al guardar la asignación:', error);
          },
        });
    } else {
      console.error('No se ha seleccionado ningún usuario.');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idProyectoBorrador'] && this.idProyectoBorrador) {
      this.cargarProyecto();
    }
  }

  cargarProyecto(): void {
    this.proyectoService.getProyectoId(this.idProyectoBorrador).subscribe({
      next: (response) => {
        this.proyecto = response;
        this.nombreProyecto = response.nombre;
        this.regionProyecto = response.general.antecedentesPostulante.direccion.region;
        this.comunaProyecto = response.general.antecedentesPostulante.direccion.comuna;
      },
      error: (error) => {
        console.error('Error al obtener el proyecto:', error);
      },
    });
  }

  onConfirmar() {
    this.mostrarDialog = false;
  }

  onCerrar() {
    this.mostrarDialog = false;
  }

  ngOnInit(): void {
    
      this.proyectoService.getUsuariosEvaluadores().subscribe({
        next: (response) => {
          this.usuariosAsignacionOptions = response;
        },
        error: (error) => {
          console.error('Error al obtener los usuarios evaluadores:', error);
      }});
  }
}
