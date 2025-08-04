import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { AreaConcurso, FocalizacionComuna, FocalizacionConcurso, RegionConcurso } from '../../interfaces/concursos.interfaces';
import { UsuariosService } from '../../services/usuarios.service';
import { Region } from '../../interfaces/usuario.interfaces';

@Component({
  selector: 'app-focalizacion',
  standalone: true,
  imports: [FormsModule, DropdownModule, ReactiveFormsModule, CommonModule, RadioButtonModule, CheckboxModule],
  templateUrl: './focalizacion.component.html',
  styleUrl: './focalizacion.component.scss'
})

export class FocalizacionComponent implements OnInit, OnChanges {

  @Output() focalizacionChange = new EventEmitter<FocalizacionConcurso>();

  @Input() focalizacion!: FocalizacionConcurso;

  @Input() disableFocalizacion: boolean = false;

  selectedRegion!: RegionConcurso;
  areaConcurso: AreaConcurso[] = []
  selectedArea!: AreaConcurso;
  selectedComuna: FocalizacionComuna[] = [];
  regiones: RegionConcurso[] = [];
  comunasConcurso: FocalizacionComuna[] = [];
  selectedComunasCheck: FocalizacionComuna[] = [];
  region!: Region[];
  initializedWithInput: boolean = false;
  isDisabled: boolean = false;

  constructor(private usuarioService: UsuariosService) { }

  emitFocalizacion() {
    const focalizacion: FocalizacionConcurso = {
      region: {
        nombre: this.selectedRegion.nombre,
        cod: this.selectedRegion.code
      },
      area: {
        nombre: this.selectedArea.nombre,
        cod: this.selectedArea.code
      },
      comunas: this.selectedComuna
    };
    this.focalizacionChange.emit(focalizacion);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['focalizacion'] && this.focalizacion) {
      const { region, area, comunas } = this.focalizacion;
  
      this.selectedRegion = {
        nombre: region.nombre,
        code: region.cod
      };
  
      this.areaConcurso = this.region.find(r => r.id_region === this.selectedRegion.code)?.areas.map(area => ({
        nombre: area.nombre,
        code: area.id_area
      })) || [];
  
      this.selectedArea = {
        nombre: area.nombre,
        code: area.cod
      };
  
      this.comunasConcurso = this.region
        .flatMap(r => r.areas)
        .find(a => a.id_area === this.selectedArea.code)?.comunas.map(comuna => ({
          nombre: comuna.nombre,
          idComuna: comuna.id_comuna
        })) || [];
  
      this.selectedComuna = comunas;
      this.selectedComunasCheck = [...comunas];
  
      this.comunasConcurso.forEach(comuna => {
        comuna.selected = this.selectedComunasCheck.some(selected => selected.idComuna === comuna.idComuna);
      });
        this.isDisabled = this.disableFocalizacion;
    }
  }

  onRegionChange(region: RegionConcurso) {
    this.selectedRegion = region;
    this.selectedArea = { nombre: '', code: 0 };
    this.selectedComuna = [];
    this.selectedComunasCheck = [];
  
    this.areaConcurso = this.region.find(r => r.id_region === region.code)?.areas.map(area => ({
      nombre: area.nombre,
      code: area.id_area
    })) || [];
  
    this.comunasConcurso = [];
    this.emitFocalizacion();
  }
  
  onAreaChange(area: AreaConcurso) {
    this.selectedArea = area;
    this.selectedComuna = []; 
    this.selectedComunasCheck = []; 
  
    this.comunasConcurso = this.region
      .flatMap(r => r.areas)
      .find(a => a.id_area === area.code)?.comunas.map(comuna => ({
        nombre: comuna.nombre,
        idComuna: comuna.id_comuna
      })) || [];
      
    this.emitFocalizacion();
  }
  
  
  onCheckboxChange(event: any, comuna: FocalizacionComuna) {
    if (event.checked) {
      this.selectedComunasCheck.push(comuna);
    } else {
      this.selectedComunasCheck = this.selectedComunasCheck.filter(c => c.idComuna !== comuna.idComuna);
    }
    this.selectedComuna = [...this.selectedComunasCheck];
    this.emitFocalizacion();
  }

  private mapRegionsToFocalizacion(regions: Region[]) {
    this.region = regions;
    this.regiones = regions.map(region => ({
      nombre: region.nombre,
      code: region.id_region
    }));
  
    this.areaConcurso = regions.flatMap(region => region.areas.map(area => ({
      nombre: area.nombre,
      code: area.id_area
    })));
  
    this.comunasConcurso = regions.flatMap(region => region.areas.flatMap(area => area.comunas.map(comuna => ({
      nombre: comuna.nombre,
      idComuna: comuna.id_comuna
    }))));
  }

  private initializeFromInput() {
    const { region, area, comunas } = this.focalizacion;
  
    this.selectedRegion = {
      nombre: region.nombre,
      code: region.cod
    };
  
    this.areaConcurso = this.region.find(r => r.id_region === this.selectedRegion.code)?.areas.map(area => ({
      nombre: area.nombre,
      code: area.id_area
    })) || [];
  
    this.selectedArea = {
      nombre: area.nombre,
      code: area.cod
    };
  
    this.comunasConcurso = this.region
      .flatMap(r => r.areas)
      .find(a => a.id_area === this.selectedArea.code)?.comunas.map(comuna => ({
        nombre: comuna.nombre,
        idComuna: comuna.id_comuna
      })) || [];
  
    this.selectedComuna = comunas;
    this.selectedComunasCheck = [...comunas];
  
    this.comunasConcurso.forEach(comuna => {
      comuna.selected = this.selectedComunasCheck.some(selected => selected.idComuna === comuna.idComuna);
    });
  }

  ngOnInit() {
    if (this.focalizacion) {
      this.initializeFromInput();
      this.initializedWithInput = true;
      this.isDisabled = this.disableFocalizacion;
    } else {
      this.usuarioService.getZonasUsuarios().subscribe(
        (data: Region[]) => {
          this.region = data;
          this.mapRegionsToFocalizacion(data);
          this.initializedWithInput = false;
          if (this.regiones.length > 0) {
            this.selectedRegion = this.regiones[0];
            this.onRegionChange(this.selectedRegion);
  
            if (this.areaConcurso.length > 0) {
              this.selectedArea = this.areaConcurso[0];
              this.onAreaChange(this.selectedArea);
            }
          }
        },
        (error) => {
          console.error('Error al obtener las zonas de usuarios', error);
        }
      );
    }
  }
}
