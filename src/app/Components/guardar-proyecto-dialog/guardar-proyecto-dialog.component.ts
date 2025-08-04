import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ProyectosService } from '../../services/proyectos.service';
import { Proyecto } from '../../interfaces/proyecto.interfaces';

@Component({
  selector: 'app-guardar-proyecto-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    DividerModule,
  ],
  templateUrl: './guardar-proyecto-dialog.component.html',
  styleUrl: './guardar-proyecto-dialog.component.scss'
})
export class GuardarProyectoDialogComponent implements OnInit {
  @Input() display: boolean = false;
  @Input() formularioIncompleto: boolean = false;
  @Output() dialogClosed: EventEmitter<void> = new EventEmitter<void>();

  idProyectoBorrador: string = '';

  constructor(
    private route: ActivatedRoute,
    private proyectosService: ProyectosService
  ) { }

  guardarProyecto() {
    this.route.params.subscribe(params => {
      this.idProyectoBorrador = params['id'];
      this.guardarProyecto = () => {
        window.location.href = `postular-proyecto/${this.idProyectoBorrador}`;
      };
    });
  }

  salir() {
    this.display = false;
    this.dialogClosed.emit();
  }

  ngOnInit(): void {
  }
}
