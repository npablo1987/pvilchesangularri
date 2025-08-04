import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { InputTextComponent } from '../../input-text/input-text.component';
import { ButtonsComponent } from '../../buttons/buttons.component';
import { DemandaService } from '../../../services/demanda.service';
import { GrupoInformalOPersonaJuridica, PersonaNatural, TipoUsuarioAgricultor } from '../../../interfaces/demandas.interfaces';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { formatRut } from '../../../utils/formatters';
import { esRutValido } from '../../../utils/validaciones';

@Component({
  selector: 'app-identificacion-agricultores',
  standalone: true,
  imports: [InputTextComponent, ButtonsComponent, CommonModule, DialogModule, CheckboxModule, FormsModule, TableModule, DividerModule],
  templateUrl: './identificacion-agricultores.component.html',
  styleUrl: './identificacion-agricultores.component.scss'
})
export class IdentificacionAgricultoresComponent implements OnInit{
  @Input() tipoAgricultor!: TipoUsuarioAgricultor;
  @Input() resetCampos = false;
  @Output() resetCompleted = new EventEmitter<void>();
  @Input() mostrarCamposAgricultor: boolean = false;
  @Output()
  identificadorOk = new EventEmitter<{ id: string, nombreUsuario?: string, mostrarCampos: boolean }>();
  @Input() esRevision: boolean = false;
  @Input() identificadorEditar: string = '';
  @Input() esEditar: boolean = false;

  identificador: string = '';
  personaNatural!: PersonaNatural;
  informacionAgricultorOk: boolean = false;
  nombreAgricultor: string = '';
  rutAgricultor: string = '';
  edadAgricultor: string = '';
  sexoAgricultor: string = '';
  acreditacionAgricultor: string = '';
  razonSocialAgricultor: string = '';
  nombreRepresentanteAgricultor: string = '';
  nombreAgrupacion: string = '';
  rutRepresentanteLegal: string = '';
  displayDialog: boolean = false;
  esAgrupacion: boolean = false;
  representanteSeleccionado: number = 0;

  rutIdentificadorValido     = false;
  rutRepresentanteLegalValido = false;

  tableData: GrupoInformalOPersonaJuridica[] = [];

  constructor(private demandaService: DemandaService) {

  }

  onCheckboxChange(rut: string, isChecked: boolean): void {
    const mostrarCampos = true;
    if (isChecked && this.esAgrupacion) {
      this.representanteSeleccionado ++;
      this.demandaService.getRepresentanteLegal(rut).subscribe({
        next: (resp) => {
            this.tableData = resp
          }
      })
      if (this.representanteSeleccionado > 1) {
        this.displayDialog = false;
        this.demandaService.getPersonaJuridica(rut).subscribe({
          next: (resp) => {
              this.razonSocialAgricultor = resp.razonSocial
              this.rutAgricultor = formatRut(resp.rut)
              this.acreditacionAgricultor = resp.estadoAcreditacion ? 'Acreditado' : 'No acreditado'
              this.nombreRepresentanteAgricultor = resp.representante
              this.informacionAgricultorOk = true;
              this.identificadorOk.emit({ id: resp.rut, nombreUsuario: this.nombreRepresentanteAgricultor, mostrarCampos });
            }
        })
      }
    } else {
      this.displayDialog = false;
      this.esAgrupacion = false;
      this.demandaService.getPersonaJuridica(rut).subscribe({
        next: (resp) => {
            this.razonSocialAgricultor = resp.razonSocial
            this.rutAgricultor = resp.rut
            this.acreditacionAgricultor = resp.estadoAcreditacion ? 'Acreditado' : 'No acreditado'
            this.nombreRepresentanteAgricultor = resp.representante
            this.informacionAgricultorOk = true;
            this.identificadorOk.emit({ id: resp.rut, nombreUsuario: this.nombreRepresentanteAgricultor, mostrarCampos });
          }
      })
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['resetCampos'] && this.resetCampos) {
      this.resetFormFields();
      this.resetCompleted.emit();
    }

    if (changes['esEditar'] || changes['identificadorEditar']) {
      this.camposEdicion();
    }
  }

  resetFormFields() {
    this.identificador = '';
    this.nombreAgricultor = '';
    this.rutAgricultor = '';
    this.edadAgricultor = '';
    this.sexoAgricultor = '';
    this.acreditacionAgricultor = '';
    this.razonSocialAgricultor = '';
    this.nombreRepresentanteAgricultor = '';
    this.nombreAgrupacion = '';
    this.informacionAgricultorOk = false;
    this.mostrarCamposAgricultor = false;
  }


  mostrarInputsTipoJuridico(): boolean {
    return this.tipoAgricultor?.idTipoUsuario === 2;
  }

  filtrarJuridicas() {
    const mostrarCampos = true;
    this.demandaService.getRepresentanteLegal(this.rutRepresentanteLegal).subscribe({
      next: (resp) => {
        this.displayDialog = true;
        this.tableData = resp
        this.identificadorOk.emit({ id: this.identificador, mostrarCampos });
      }
    })
  }


  filtrarAgrupacion() {
    const mostrarCampos = true;
    this.esAgrupacion = true;
    this.demandaService.getNombreAgrupacion(this.nombreAgrupacion).subscribe({
      next: (resp) => {
        this.displayDialog = true;
        this.tableData = resp
        this.identificadorOk.emit({ id: this.identificador, mostrarCampos });
      }
    })
  }

  identificarAgricultor() {
    const mostrarCampos = true;
    if (this.tipoAgricultor.idTipoUsuario === 1 && !this.esEditar) {
      this.demandaService.getPersonaNatural(this.identificador).subscribe({
        next: (resp) => {
          this.personaNatural = resp
          this.nombreAgricultor = resp.nombreCompleto
          this.rutAgricultor = formatRut(resp.rut)
          this.edadAgricultor = resp.edad.toString()
          this.sexoAgricultor = resp.sexo === 'M' ? 'Masculino' : 'Femenino'
          this.acreditacionAgricultor = resp.estadoAcreditacion ? 'Acreditado' : 'No acreditado'
          this.informacionAgricultorOk = true
          this.identificadorOk.emit({ id: this.identificador, nombreUsuario: this.nombreAgricultor, mostrarCampos });
          this.identificador = formatRut(resp.rut);
        }
      })
    }
    if (this.tipoAgricultor.idTipoUsuario === 3 && !this.esEditar) {
      this.demandaService.getGrupoInformal(this.identificador).subscribe({
        next: (resp) => {
          this.nombreAgrupacion = resp.nombreGrupo
          this.rutAgricultor = resp.rut
          this.nombreRepresentanteAgricultor = resp.representante
          this.informacionAgricultorOk = true
          this.identificadorOk.emit({ id: this.identificador, nombreUsuario: this.nombreRepresentanteAgricultor, mostrarCampos });
        }
      })
    }
    this.mostrarCamposAgricultor = mostrarCampos;
  }

  private camposEdicion(): void {
    if (this.identificadorEditar && this.esEditar) {
      const mostrarCampos = true;
      this.identificador = this.identificadorEditar;
      this.demandaService.getPersonaNatural(this.identificador).subscribe({
        next: (resp) => {
          this.personaNatural = resp;
          this.nombreAgricultor = resp.nombreCompleto;
          this.rutAgricultor = resp.rut;
          this.edadAgricultor = resp.edad.toString();
          this.sexoAgricultor = resp.sexo === 'M' ? 'Masculino' : 'Femenino';
          this.acreditacionAgricultor = resp.estadoAcreditacion ? 'Acreditado' : 'No acreditado';
          this.informacionAgricultorOk = true;
          this.identificadorOk.emit({ id: this.identificador, nombreUsuario: this.nombreAgricultor, mostrarCampos });
        }
      });
      this.mostrarCamposAgricultor = mostrarCampos;
    }
  }

  ngOnInit(): void {
    if(this.esEditar) {
      this.tipoAgricultor = { idTipoUsuario: 1, tipoUsuario: 'Persona Natural' };
      this.camposEdicion();
    }
  }

  onIdentificadorChange(val: string) {
    this.identificador = formatRut(val);
    this.rutIdentificadorValido = esRutValido(val);
  }

  onRutRepresentanteChange(val: string) {
    this.rutRepresentanteLegal = formatRut(val);
    this.rutRepresentanteLegalValido = esRutValido(val);
  }

}
