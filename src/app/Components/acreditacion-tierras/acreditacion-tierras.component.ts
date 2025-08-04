import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextComponent } from '../input-text/input-text.component';
import { AdjuntarArchivosComponent } from '../adjuntar-archivos/adjuntar-archivos.component';
import { AcreditacionTierra, Archivo, Legal, PrediosRut, TipoAgua } from '../../interfaces/proyecto.interfaces';
import { ProyectosService } from '../../services/proyectos.service';
import { ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { fechaUTCFormater } from '../../utils/formatters';

@Component({
  selector: 'app-acreditacion-tierras',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    DropdownModule,
    InputTextComponent,
    AdjuntarArchivosComponent,
    TableModule,
    ButtonModule
  ],
  templateUrl: './acreditacion-tierras.component.html',
  styleUrl: './acreditacion-tierras.component.scss'
})
export class AcreditacionTierrasComponent implements OnInit {

  @Input() data!: AcreditacionTierra;

  @Input() index!: number;

  /** Emite cuando el usuario quiere eliminar esta tarjeta */
  @Output() remove = new EventEmitter<void>();

  @Output() roles_predio = new EventEmitter<number>();
  
  rolAcreditacion: string = '';
  nombrePredio: string = '';
  superficiePredio: string = '';
  regionPredio: string = '';
  comunaPredio: string = '';
  clasificacionUsoSuelo: string = '';
  tenenciaPredio: string = '';
  fechaInicioContrato: string | null = null;
  fechaTerminoContrato: string | null = null;
  rutPostulante: string = '';
  prediosRut: PrediosRut[] = [];
  predioSeleccionado: PrediosRut | null = null;
  idProyectoBorrador: string = '';
  listadoCarpetaTierra: Archivo[] = [];
  numero_roles: number = 0;

  acreditacionTierra: AcreditacionTierra = {
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
 
  constructor(
    private proyectoService: ProyectosService,
    private route: ActivatedRoute
  ) {}

 actualizarAcreditacionTierra() {
    this.acreditacionTierra = {
      rol: this.predioSeleccionado?.rol || '',
      nombreDelPredio: this.nombrePredio,
      superficie: parseFloat(this.superficiePredio),
      region: this.regionPredio,
      regionId: this.predioSeleccionado?.regionId || 0,
      comuna: this.comunaPredio,
      comunaId: this.predioSeleccionado?.comunaId || 0,
      clasificacionUsoDeSuelo: this.clasificacionUsoSuelo,
      tenencia: this.tenenciaPredio,
      fechaInicioContrato: this.fechaInicioContrato? fechaUTCFormater(this.fechaInicioContrato) : '',
      fechaTerminoContrato: this.fechaTerminoContrato? fechaUTCFormater(this.fechaTerminoContrato) : '',
      archivosCarpetaLegal: this.data.archivosCarpetaLegal
    };

  }

  triggerFileInput() {
    const input = document.getElementById(`fileInputTierra${this.index}`) as HTMLInputElement;
    input.click();
    // const fileInput = document.getElementById('fileInput3') as HTMLInputElement;
    // fileInput.click();
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    Array.from(input.files).forEach(file => {

      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('El archivo es demasiado grande. El tamaño máximo permitido es 100 MB.');
        return;
      }

      const archivoExistente = this.data.archivosCarpetaLegal.find(item => item.nombre === file.name);
      if (archivoExistente) {
        alert('El archivo ya ha sido subido.');
        return;
      }

      this.proyectoService.postSubirArchivo(this.idProyectoBorrador, file).subscribe({
        next: (response) => {
          const archivo: Archivo = {
            id: response.id,
            nombre: response.nombre,
            tamaño: response.tamaño,
          };

          this.data.archivosCarpetaLegal.push(archivo);
          input.value = '';
        },
        error: (error) => {
          console.error('Error al subir el archivo:', error);
          alert('No se pudo subir el archivo. Inténtelo nuevamente.');
        },
      });
    });
  }

  guardarArchivo(): void {
    setTimeout(() => {
      alert('El archivo se ha guardado exitosamente');
    }, 5000);
  }

  eliminarArchivo(archivo: Archivo): void {
    const idx = this.data.archivosCarpetaLegal.findIndex(a => a.id === archivo.id);
    if (idx > -1) this.data.archivosCarpetaLegal.splice(idx, 1);
  }

  onRolSeleccionado(event: any) {
    const predioSeleccionado = this.prediosRut.find((predio: PrediosRut) => predio.rol === event.value.rol);

    if (predioSeleccionado) {

      this.predioSeleccionado = predioSeleccionado;
      this.nombrePredio = predioSeleccionado.nombre || '';
      this.superficiePredio = predioSeleccionado.superficieEnHa.toString();
      this.regionPredio = predioSeleccionado.region;
      this.comunaPredio = predioSeleccionado.comuna;
      this.clasificacionUsoSuelo = predioSeleccionado.clasificacionUsoSuelo;
      this.tenenciaPredio = predioSeleccionado.tenencia;
      this.fechaInicioContrato = predioSeleccionado.fechaInicioContrato || null;
      this.fechaTerminoContrato = predioSeleccionado.fechaTerminoContrato || null;

    } else {
      console.warn("No se encontró el predio seleccionado.");
    }
  }

asignarTierrasData(proyectoData: any) {
  const TierrasData: Legal = proyectoData.legal;

  if (TierrasData && TierrasData.acreditacionesTierra && TierrasData.acreditacionesTierra.length > 0) {
    const acreditacionTierra = TierrasData.acreditacionesTierra[0];

    this.rolAcreditacion = acreditacionTierra.rol || '';

    this.predioSeleccionado = this.prediosRut.find((predio: PrediosRut) => predio.rol === acreditacionTierra.rol) || null;

    if (this.predioSeleccionado) {
      this.nombrePredio = acreditacionTierra.nombreDelPredio;
      this.superficiePredio = acreditacionTierra.superficie.toString();
      this.regionPredio = acreditacionTierra.region;
      this.comunaPredio = acreditacionTierra.comuna;
      this.clasificacionUsoSuelo = acreditacionTierra.clasificacionUsoDeSuelo;
      this.tenenciaPredio = acreditacionTierra.tenencia;
      this.fechaInicioContrato = acreditacionTierra.fechaInicioContrato ? new Date(acreditacionTierra.fechaInicioContrato).toLocaleDateString('es-CL') : new Date().toISOString().split('T')[0];
      this.fechaTerminoContrato = acreditacionTierra.fechaTerminoContrato ? new Date(acreditacionTierra.fechaTerminoContrato).toLocaleDateString('es-CL') : new Date().toISOString().split('T')[0];
      this.data.archivosCarpetaLegal = acreditacionTierra.archivosCarpetaLegal || [];
    }
  }
}

  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      this.idProyectoBorrador = params['id'];
      this.proyectoService.getProyectoId(this.idProyectoBorrador).subscribe({
        next: (resp) => {
          console.log("Respuesta proyecto acreditacion tierras", resp);
          let rut = resp?.general?.antecedentesPostulante?.rut;

          if (!rut) {
            console.warn('RUT no encontrado en la respuesta');
            return;
          }
  
          this.rutPostulante = rut;
          this.proyectoService.getPrediosRut(this.rutPostulante).subscribe({
            next: (predios: PrediosRut[] = []) => {
              console.log(predios);
              this.prediosRut = predios;
              this.numero_roles = predios.length;
              this.roles_predio.emit(this.numero_roles);
              this.asignarTierrasData(resp);
            },
            error: (error) => {
              console.error('Error al obtener los predios:', error);
            }
          });
        },
      });
    });

  }

  onRemoveClick() {
    this.remove.emit();
  }
  
}
