import { CommonModule } from '@angular/common';
import { Component, ComponentRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AdjuntarArchivosComponent } from '../../adjuntar-archivos/adjuntar-archivos.component';
import { AcreditacionTierrasComponent } from '../../acreditacion-tierras/acreditacion-tierras.component';
import { AcreditacionAguasComponent } from '../../acreditacion-aguas/acreditacion-aguas.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProyectosService } from '../../../services/proyectos.service';
import { AcreditacionAgua, AcreditacionTierra, Archivo, Legal, SubidaArchivos } from '../../../interfaces/proyecto.interfaces';
import { ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-legal-tab-estudio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RadioButtonModule,
    AdjuntarArchivosComponent,
    AcreditacionTierrasComponent,
    AcreditacionAguasComponent,
    TableModule,
    ButtonModule
  ],
  templateUrl: './legal-tab-estudio.component.html',
  styleUrls: ['./legal-tab-estudio.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LegalTabEstudioComponent implements OnInit {
  @ViewChild(AcreditacionTierrasComponent) acreditacionTierrasComponent!: AcreditacionTierrasComponent;
  @ViewChild(AcreditacionAguasComponent) acreditacionAguasComponent!: AcreditacionAguasComponent;
  
  acreditacionTierra: AcreditacionTierra | null = null; 
  contemplaDrenaje: boolean = false;
  esOrganizacion: boolean = false;
  listadoCarpetaLegal: Archivo[] = [];
  idProyectoBorrador: string = '';
  archivo: SubidaArchivos = {} as SubidaArchivos;
  
  acreditacionesAgua: AcreditacionAgua[] = [];
  acreditacionesTierra: AcreditacionTierra[] = [];

  maxRoles = 0;
  
  constructor(
    private proyectoService: ProyectosService,
    private route: ActivatedRoute
  ) { }
  
  getLegalData(): Legal {
    const acreditacionesTierra: AcreditacionTierra[] = [];
    const acreditacionesAgua: AcreditacionAgua[] = [];
    
    if (this.acreditacionTierrasComponent) {
      this.acreditacionTierrasComponent.actualizarAcreditacionTierra();
      const acreditacionTierra = this.acreditacionTierrasComponent.acreditacionTierra;
      if (acreditacionTierra.rol) {
        acreditacionesTierra.push(acreditacionTierra);
      }
    }
    
    if (this.acreditacionAguasComponent) {
      this.acreditacionAguasComponent.actualizarAcreditacionAgua(); 
      const acreditacionAgua = this.acreditacionAguasComponent.acreditacionAgua;
      if (acreditacionAgua.tipoAgua) { 
        acreditacionesAgua.push(acreditacionAgua);
      }
    }
    
    const legal: Legal = {
      soloDrenaje: this.contemplaDrenaje? true : false,
      esUsuarioDeAguas: this.esOrganizacion? true : false,
      archivosCarpetaLegal: this.listadoCarpetaLegal,
      acreditacionesTierra: acreditacionesTierra,
      acreditacionesAgua: acreditacionesAgua,
    };
    return legal;
  }
  
  
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      const archivoExistente = this.listadoCarpetaLegal.find(item => item.nombre === file.name);
      if (archivoExistente) {
        alert('El archivo ya ha sido subido.');
        return;
      }
      
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('El archivo es demasiado grande. El tamaño máximo permitido es 10 MB.');
        return;
      }
      
      this.proyectoService.postSubirArchivo(this.idProyectoBorrador, file).subscribe({
        next: (response) => {
          
          const archivo: Archivo = {
            id: response.id,
            nombre: response.nombre,
            tamaño: response.tamaño,
          };
          
          this.listadoCarpetaLegal = [...this.listadoCarpetaLegal, archivo];
          
          input.value = '';
        },
        error: (error) => {
          console.error('Error al subir el archivo:', error);
          alert('No se pudo subir el archivo. Inténtelo nuevamente.');
        },
      });
    }
  }
  
  guardarArchivo(): void {
    setTimeout(() => {
      alert('El archivo se ha guardado exitosamente');
    }, 5000);
  }
  
  eliminarArchivo(archivo: Archivo): void {
    this.listadoCarpetaLegal = this.listadoCarpetaLegal.filter(item => item.id !== archivo.id);
  }
  
  asignarProyectoDataLegal(proyectoData: any) {
    const legalData = proyectoData.legal;
    
    if (legalData) {
      this.contemplaDrenaje = legalData.soloDrenaje;
      this.esOrganizacion = legalData.esUsuarioDeAguas || false;
      this.listadoCarpetaLegal = legalData.archivosCarpetaLegal || [];
      this.acreditacionesAgua = legalData.acreditacionesAgua || [];
      this.acreditacionesTierra = legalData.acreditacionesTierra || [];
    }

    if(this.acreditacionesTierra.length === 0){
      this.acreditacionesTierra.push(this.createEmptyAcreditacionTierra());
    }

    if(this.acreditacionesAgua.length === 0){
      this.acreditacionesAgua.push(this.createEmptyAcreditacionAgua());
    }    
  }
  
  ngOnInit(): void {
    this.listadoCarpetaLegal = [];
    
    this.route.params.subscribe(params => {
      this.idProyectoBorrador = params['id'];

      
      
      this.proyectoService.getProyectoId(this.idProyectoBorrador).subscribe({
        next: (resp) => {
          console.log("resp", resp);
          this.asignarProyectoDataLegal(resp);

          this.proyectoService.getPrediosRut(resp.general.antecedentesPostulante.rut).subscribe({
            next: (predios: any[]) => {
              console.log(predios)
              this.maxRoles = predios?.length;
            },
            error: (error) => {
              console.error('Error al obtener los predios:', error);
            }
          });
        },
        error: (err) => {
          console.error('Error al obtener proyecto:', err);
        }
      });
    });
    
    this.onToggleOUA(this.esOrganizacion);
  }
    
  /**
  * Llamado desde los radioButtons:
  * (change)="onToggleOUA(true)"  y  (change)="onToggleOUA(false)"
  */
  onToggleOUA(show: boolean) {
    this.esOrganizacion = show;
    console.log(this.esOrganizacion);
    
    if (!show) {
      // crea instancias dinámicas
      this.acreditacionesAgua.push(this.createEmptyAcreditacionAgua());
      if(this.maxRoles > 0) {
        this.acreditacionesTierra.push(this.createEmptyAcreditacionTierra());
      } else {
        this.acreditacionesTierra = [];
      }
    } else {
      // destruye y limpia
      this.acreditacionesAgua = [];
      this.acreditacionesTierra = [];
    }
  }
  
  agregarAntecedenteAgua() {
    this.acreditacionesAgua.push(this.createEmptyAcreditacionAgua());
  }

  agregarPredio() {
    if(this.maxRoles > this.acreditacionesTierra.length){
      this.acreditacionesTierra.push(this.createEmptyAcreditacionTierra());
    } else {
      alert('Usuario no cuenta con otros roles disponibles');
    }
  }

  createEmptyAcreditacionAgua(): AcreditacionAgua {
    return {
      tipoAgua: 'Superficial',
      esAPR: false,
      nombreAPR: '',
      tipoFuente: '',
      detalleTipoFuente: '',
      tipoTenencia: '',
      caudalDisponible: 0,
      unidadMedida: '',
      articuloAsociado: '',
      ejercicioDerecho: '',
      esDerechoConsultivo: false,
      archivosCarpetaLegal: [] as Archivo[]
    };
  }

  createEmptyAcreditacionTierra(): AcreditacionTierra {
    return {
      rol: '',
      nombreDelPredio: '',
      superficie: 0,
      region: '',
      regionId: 0,
      comuna: '',
      comunaId: 0,
      clasificacionUsoDeSuelo: '',
      tenencia: '',
      fechaInicioContrato: '',
      fechaTerminoContrato: '',
      archivosCarpetaLegal: [] as Archivo[]
    };
  }

  eliminarAntecedenteAgua(index: number) {
    this.acreditacionesAgua.splice(index, 1);
  }

  eliminarAntecedenteTierra(index: number) {
    this.acreditacionesTierra.splice(index, 1);
  }
}
