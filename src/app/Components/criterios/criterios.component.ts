import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ConcursoService } from '../../services/concurso.service';
import { Criterio, CriterioGet, Instrumentos, VariablesCriterio } from '../../interfaces/concursos.interfaces';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { VARIABLES_BASE } from '../../constants/constantes';
import { ActivatedRoute } from '@angular/router';
import { InputNumberModule } from 'primeng/inputnumber';
import { isPuntajeValido } from '../../utils/validaciones';

@Component({
  selector: 'app-criterios',
  standalone: true,
  imports: [CommonModule, PanelModule, ButtonModule, DividerModule, InputNumberModule, MenuModule, TableModule, DialogModule, InputTextModule, FormsModule, CheckboxModule],
  templateUrl: './criterios.component.html',
  styleUrl: './criterios.component.scss'
})

export class CriteriosComponent implements OnInit, OnChanges {
  
  criterios: CriterioGet[] = [];
  variables: VariablesCriterio[] = [];
  visible: boolean = false;
  newVariable: VariablesCriterio = { nombre: '', puntaje: 0, opciones: '' };
  selectedCriterio!: CriterioGet;
  selectedVariableIndex: number | null = null;
  activarCriterio: boolean = false;
  errorMessage: string = ''; 
  
  @Input() 
  public criteriosAprobar!: boolean;

  @Input()
  public criteriosEditar!: CriterioGet[];

  @Input() 
  public selectedInstrumento!: Instrumentos;
  @Output()
  criteriosChange = new EventEmitter<CriterioGet[]>();
  items: { label?: string; icon?: string; separator?: boolean }[] = [];
  constructor(private concursoService: ConcursoService, private route: ActivatedRoute) {}

  ngOnInit(): void {
   
    this.loadCriterios();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedInstrumento']) {
      this.loadCriterios();
    }
    if (changes['criteriosAprobar']) {
      this.filterCriterios();
    }
  }

  private filterCriterios(): void {
    if (this.criteriosAprobar) {
      this.criterios = this.criterios.filter(criterio => criterio.activar);
    } else {
      this.criterios = this.criteriosEditar;
    }
  }

  private loadCriterios(): void {
    if (this.criteriosEditar && this.criteriosEditar.length > 0) {
        this.criterios = this.criteriosEditar;
        this.criteriosChange.emit(this.criterios);
        return;
    }
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !this.selectedInstrumento) {
        this.criterios = this.criteriosEditar;
    } else if (this.selectedInstrumento) {
        this.concursoService.getCriterios(this.selectedInstrumento.name).subscribe((criterios: CriterioGet[]) => {
            this.criterios = criterios.map(criterio => ({
                ...criterio,
                variables: [...VARIABLES_BASE, ...(criterio.variables || [])]
            }));
            this.criteriosChange.emit(this.criterios);
        });
    }
}

  
  deleteVariable(criterio: Criterio, variable: VariablesCriterio): void {
    criterio.variables = criterio.variables.filter(v => v !== variable);
  } 

  showAddDialog(criterio: CriterioGet): void {
    this.selectedCriterio = criterio;
    this.selectedVariableIndex = null;
    this.newVariable = { nombre: '', puntaje: 0, opciones: '' };
    this.errorMessage = '';
    this.visible = true;
  }

  showEditDialog(criterio: Criterio, variable: VariablesCriterio): void {
    this.selectedCriterio = criterio;
    this.selectedVariableIndex = criterio.variables.indexOf(variable);
    this.newVariable = { ...variable };
    this.errorMessage = '';
    this.visible = true;
  }

  saveVariable(): void {
    if (this.isValidPuntaje()) {
      if (this.selectedVariableIndex !== null) {
        this.selectedCriterio.variables[this.selectedVariableIndex] = { ...this.newVariable };
      } else {
        this.selectedCriterio.variables.push({ ...this.newVariable });
      }
      this.visible = false;
      this.emitCriterios();
    }
  }
  
  private isValidPuntaje(): boolean {
    const esValido = isPuntajeValido(this.selectedCriterio.variables, this.newVariable.puntaje, this.selectedVariableIndex);
    
    if (!esValido) {
        this.errorMessage = 'La suma total de puntajes excede el máximo (100).';
        return false;
    } else {
        this.errorMessage = '';
        return true;
    }
  }  

  private emitCriterios(): void {
    const criteriosToEmit: Criterio[] = this.criterios.map(criterio => ({
      nombre: criterio.nombre,
      tipo: criterio.tipo,
      caracter: criterio.caracter,
      activar: criterio.activar,
      ponderacion: criterio.ponderacion,
      variables: criterio.variables
    }));
    this.criteriosChange.emit(criteriosToEmit);
  }

  addVariable(criterio: Criterio): void {
  const newVariable: VariablesCriterio = { nombre: 'Nueva Variable', puntaje: 0, opciones: '' };
  criterio.variables.push(newVariable);
  criterio.activar = true;
  this.emitCriterios();
}
  
}
