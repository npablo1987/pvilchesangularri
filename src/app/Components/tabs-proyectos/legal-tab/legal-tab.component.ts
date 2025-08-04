import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AdjuntarArchivosComponent } from '../../adjuntar-archivos/adjuntar-archivos.component';
import { AcreditacionTierrasComponent } from '../../acreditacion-tierras/acreditacion-tierras.component';
import { AcreditacionAguasComponent } from '../../acreditacion-aguas/acreditacion-aguas.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProyectosService } from '../../../services/proyectos.service'
import {
  AcreditacionAgua,
  AcreditacionTierra,
  Archivo,
  Legal,
  SubidaArchivos,
} from '../../../interfaces/proyecto.interfaces';
import { ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-legal-tab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RadioButtonModule,
    AdjuntarArchivosComponent,
    AcreditacionTierrasComponent,
    AcreditacionAguasComponent,
    TableModule,
    ButtonModule,
  ],
  templateUrl: './legal-tab.component.html',
  styleUrls: ['./legal-tab.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LegalTabComponent implements OnInit {
  @ViewChild(AcreditacionTierrasComponent) acreditacionTierrasComponent!: AcreditacionTierrasComponent;
  @ViewChild(AcreditacionAguasComponent) acreditacionAguasComponent!: AcreditacionAguasComponent;

  acreditacionTierra: AcreditacionTierra | null = null;
  contemplaDrenaje: boolean = false;
  esOrganizacion: boolean = false;
  listadoCarpetaLegal: Archivo[] = [];
  idProyectoBorrador: string = '';
  archivo: SubidaArchivos = {} as SubidaArchivos;

  acreditacionesTierra: AcreditacionTierra[] = [];
  acreditacionesAgua: AcreditacionAgua[] = [];

  maxRoles = 0;

  constructor(
    private proyectoService: ProyectosService,
    private route: ActivatedRoute
  ) {}
  private toISO(v: string | null | undefined): string | undefined {
    if (!v) return undefined;
    const d = new Date(v);
    return Number.isNaN(d.getTime())
      ? undefined
      : d.toISOString().split('T')[0];
  }

  private normalizarTierras(arr: AcreditacionTierra[]): AcreditacionTierra[] {
    return arr.map((a) => {
      const rolValue =
        typeof a.rol === 'object' && a.rol
          ? (a.rol as any).rol.replace(/-/g, '')
          : String(a.rol).replace(/-/g, '');

      return {
        ...a,
        rol: rolValue,
        fechaInicioContrato: this.toISO(a.fechaInicioContrato),
        fechaTerminoContrato: this.toISO(a.fechaTerminoContrato),
      };
    });
  }

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

    const parseFecha = (v: string | null | undefined): string | null => {
      if (!v) return null;
      if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
      const [d, m, y] = v.split(/[\/\-]/);
      if (!d || !m || !y) return null;
      return `${y.padStart(4, '0')}-${m.padStart(2, '0')}-${d.padStart(
        2,
        '0'
      )}`;
    };

    const acreditacionesTierraFormateadas = acreditacionesTierra.map((a) => {
      const rolValue =
        typeof a.rol === 'object' && a.rol
          ? (a.rol as any).rol.replace(/-/g, '')
          : String(a.rol).replace(/-/g, '');

      return {
        ...a,
        rol: rolValue,
        fechaInicioContrato: parseFecha(a.fechaInicioContrato),
        fechaTerminoContrato: parseFecha(a.fechaTerminoContrato),
      };
    });

    const acreditacionesAguaFormateadas = acreditacionesAgua.map((a) => ({
      ...a,
      tipoTenencia: (a as any).tipoTenencia?.name ?? a.tipoTenencia,
      unidadMedida: (a as any).unidadMedida?.name ?? a.unidadMedida,
      articuloAsociado: (a as any).articuloAsociado?.name ?? a.articuloAsociado,
      ejercicioDerecho: (a as any).ejercicioDerecho?.name ?? a.ejercicioDerecho,
    }));

    return {
      soloDrenaje: this.contemplaDrenaje ? true : false,
      esUsuarioDeAguas: this.esOrganizacion ? true : false,
      archivosCarpetaLegal: this.listadoCarpetaLegal,
      acreditacionesTierra: acreditacionesTierraFormateadas,
      acreditacionesAgua: acreditacionesAguaFormateadas,
    };
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const archivoExistente = this.listadoCarpetaLegal.find(
        (item) => item.nombre === file.name
      );
      if (archivoExistente) {
        alert('El archivo ya ha sido subido.');
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(
          'El archivo es demasiado grande. El tamaño máximo permitido es 10 MB.'
        );
        return;
      }

      this.proyectoService
        .postSubirArchivo(this.idProyectoBorrador, file)
        .subscribe({
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
    this.listadoCarpetaLegal = this.listadoCarpetaLegal.filter(
      (item) => item.id !== archivo.id
    );
  }

  onDrenajeChange(value: boolean) {
    this.contemplaDrenaje = value;
  }

  asignarProyectoDataLegal(proyectoData: any) {
    const legalData = proyectoData.legal;

    if (legalData) {
      this.contemplaDrenaje = legalData.soloDrenaje;
      this.esOrganizacion = legalData.esUsuarioDeAguas || false;
      this.listadoCarpetaLegal = legalData.archivosCarpetaLegal || [];
    }
  }

  ngOnInit(): void {
    this.listadoCarpetaLegal = [];

    this.route.params.subscribe((params) => {
      this.idProyectoBorrador = params['id'];

      this.proyectoService.getProyectoId(this.idProyectoBorrador).subscribe({
        next: (resp) => {
          this.asignarProyectoDataLegal(resp);
        },
        error: (err) => {
          console.error('Error al obtener proyecto:', err);
        },
      });
    });
  }
}
