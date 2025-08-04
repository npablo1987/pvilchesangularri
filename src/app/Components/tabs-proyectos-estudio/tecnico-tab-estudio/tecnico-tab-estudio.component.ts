import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonsComponent } from '../../buttons/buttons.component';
import { InputTextComponent } from '../../input-text/input-text.component';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { AdjuntarArchivosComponent } from '../../adjuntar-archivos/adjuntar-archivos.component';
import { Archivo, Coordenadas, Cultivo, Especies, RadioOpciones, RespuestaTipologias, Rubros, Tecnico, TipoApoyo, TipoConsultoria, TipoFuente, TipoInversion, TipologiaObra, UnidadMedidaEspecies } from '../../../interfaces/proyecto.interfaces';
import { ProyectosService } from '../../../services/proyectos.service';
import { ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { convertToDropdownOptions } from '../../../utils/formatters';
import { switchMap } from 'rxjs';
import proj4 from 'proj4';
import { RouterOutlet } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapPickerComponent } from '../../map-picker/map-picker.component';
import { RadioButtonComponent } from '../../radio-button/radio-button.component';

@Component({
  selector: 'app-tecnico-tab-estudio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonsComponent,
    InputTextComponent,
    InputTextModule,
    RadioButtonModule,
    CardModule,
    DropdownModule,
    CheckboxModule,
    AdjuntarArchivosComponent,
    TableModule,
    ButtonModule,
    RouterOutlet,
    GoogleMapsModule,
    MapPickerComponent,
    RadioButtonComponent
  ],
  templateUrl: './tecnico-tab-estudio.component.html',
  styleUrl: './tecnico-tab-estudio.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TecnicoTabEstudioComponent implements OnInit {
  
  textoGeoreferenciacion: string = 'Por favor posicione geográficamente el origen del agua, para eso haga click en el botón [Buscar en el mapa], mueva el mapa y ubique la cruz roja en el punto de origen de agua del proyecto.';
  sueloAgricola: boolean = false;
  tipoConsultoria: TipoConsultoria[] = [];
  tipoConsultoriaSeleccionado: string = '';
  tiposApoyo: TipoApoyo[] = [];
  tipoApoyoSeleccionado: TipoApoyo | null = null;
  superficie: string = '';
  unidadMedida: string = '';
  rubro: string = '';
  especie: string = '';
  riega: boolean = false;
  acomuladorDeAgua: boolean = false;
  capacidadMetrosCubicos: string = '';
  caudalMaximo: string = '';
  tipologia: string = '';
  tamanio: string = '';
  ancho: string = '';
  alto: string = '';
  largo: string = '';
  pendienteInclinacion: string = '';
  caudal: string = '';
  talud: string = '';
  fuenteEnergiaInversion: string = '';
  tipoFuente: string = '';
  potenciaPeak: string = '';
  configuracion: { id: number; name: string; } | undefined;
  listadoCarpetaTecnica: Archivo[] = [];
  listadoCarpetaPlanos: Archivo[] = [];
  listadoCarpetaElectrica: Archivo[] = [];
  idProyectoBorrador: string = '';

  metodoRiegoOpciones: { id: string;  name: string;}[] = [];
  metodoRiego: { id: string;  name: string;} | undefined;
  fuenteEnergia: string[] = [];
  selectedFuenteEnergia: any
  groupedTipoFuente: any[] = [];
  activaTipoFuente: boolean = true;
  selectedTipoFuente: any;

  configuracionOpciones: { id: number;  name: string;}[] = [];

  rubroOpciones: Rubros[] = [];
  especieOpciones: Especies[] = [];
  unidadMedidaOpciones: UnidadMedidaEspecies[] = [];
  tipologiaOpciones: TipologiaObra[] = [];
  tipologiaSeleccionada: TipologiaObra | null = null;
  tipoInversiones: { nombre: string, selected: boolean, tipologias: TipologiaObra[] }[] = [];
  tipoInversionSeleccionado: any = null;
  selectedTipoFuenteInversion: string = '';
  superficieFuruta: string = '';
  rubroOpcionesFuturo: Rubros[] = [];
  especieOpcionesFuturo: Especies[] = [];
  unidadMedidaOpcionesFuturo: UnidadMedidaEspecies[] = [];

  rubroSeleccionadoFutura: Rubros | null = null;
  especieSeleccionadaFutura: Especies | null = null;
  unidadMedidaSeleccionadaFutura: UnidadMedidaEspecies | null = null;

  rubroSeleccionado: Rubros | null = null;
  especieSeleccionada: Especies | null = null;
  unidadMedidaSeleccionada: UnidadMedidaEspecies | null = null;
  listaSeleccionadaTipoInversiones: { nombre: string, selected: boolean, tipologias: TipologiaObra[] }[] = [];

  visibleModal: boolean = false;
  zoom: number = 12;
  coordenadas: Coordenadas = {
    lat: -18.417557789731365,
    lng: -70.29701184374956,
    utmE: 0,
    utmN: 0,
    zone: 0
  };
  latLngInput: string = '';

  radioTipoConsultoria: RadioOpciones[] = [];
  tiposApoyoOriginal: TipoApoyo[] = [];

  otroTipoApoyo: string = '';

  constructor(
    private proyectoService: ProyectosService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  getTecnicoData(): Tecnico {
    const cultivos: Cultivo[] = [];
    if (this.rubroSeleccionado && this.especieSeleccionada && this.unidadMedidaSeleccionada) {
      cultivos.push({
        rubro: this.rubroSeleccionado.rubro,
        especie: this.especieSeleccionada.especie,
        superficie: parseFloat(this.superficie),
        unidadMedida: this.unidadMedidaSeleccionada.unidadMedida,
      });
    }

    const cultivosFuturos: Cultivo[] = [];
    if (this.rubroSeleccionadoFutura && this.especieSeleccionadaFutura && this.unidadMedidaSeleccionadaFutura) {
      cultivosFuturos.push({
        rubro: this.rubroSeleccionadoFutura.rubro,
        especie: this.especieSeleccionadaFutura.especie,
        superficie: parseFloat(this.superficieFuruta),
        unidadMedida: this.unidadMedidaSeleccionadaFutura.unidadMedida,
      });
    }

    const tiposInversion: TipoInversion[] = [];
    if (this.tipologiaSeleccionada) {
      tiposInversion.push({
        tipoInversion: this.tipoInversionSeleccionado?.nombre || '',
        unidadDeMedida: this.unidadMedidaSeleccionada?.unidadMedida || '',
        tipologia: this.tipologiaSeleccionada.tipologia,
        tamaño: parseFloat(this.tamanio),
        ancho: parseFloat(this.ancho),
        alto: parseFloat(this.alto),
        largo: parseFloat(this.largo),
        pendiente: parseFloat(this.pendienteInclinacion),
        caudal: parseFloat(this.caudal),
        talud: parseFloat(this.talud),
      });
    }

    const tecnico: Tecnico = {
      georeferenciacion: this.coordenadas,
      sueloEsAgricola: this.sueloAgricola? true : false,
      tipoConsultoria: this.tipoConsultoria,
      tiposApoyo: this.tiposApoyo,
      cultivos: cultivos,
      riega: this.riega? true : false,
      metodoRiego: this.metodoRiego?.name || '',
      fuenteEnergia: this.selectedTipoFuente,
      cuentaConAcumuladorDeAgua: this.acomuladorDeAgua? true : false,
      capacidadAcumulador: parseFloat(this.capacidadMetrosCubicos),
      futuroUsoDeSuelo: cultivosFuturos,
      capacidadMaximaDelDiseño: parseFloat(this.caudalMaximo),
      tiposInversion: tiposInversion,
      contemplaInversionEnergia: this.fuenteEnergiaInversion !== '',
      fuenteEnergiaInversion: this.fuenteEnergiaInversion,
      tipoFuenteEnergia: this.selectedTipoFuenteInversion,
      potenciaPeakDeFuenteEnergia: parseFloat(this.potenciaPeak),
      configuracionDeFuenteEnergia: this.configuracion?.name || '',
      archivosCarpetaTecnica: this.listadoCarpetaTecnica,
      archivosCarpetaPlano: this.listadoCarpetaPlanos,
      archivosBoletasElectricas: this.listadoCarpetaElectrica,
    };

    return tecnico;
  }

  showModal() {
    console.log("clack");
    this.visibleModal = true;
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    this.zoom = 15;
    this.coordenadas.lat = event.latLng!.lat();
    this.coordenadas.lng = event.latLng!.lng();
    console.log(this.coordenadas)
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput4') as HTMLInputElement;
    fileInput.click();
  }

  triggerFileInput2() {
    const fileInput = document.getElementById('fileInput5') as HTMLInputElement;
    fileInput.click();
  }

  triggerFileInput3() {
    const fileInput = document.getElementById('fileInput6') as HTMLInputElement;
    fileInput.click();
  }

 onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const archivoExistente = this.listadoCarpetaTecnica.find(item => item.nombre === file.name);
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

          this.listadoCarpetaTecnica = [...this.listadoCarpetaTecnica, archivo];

          input.value = '';
        },
        error: (error) => {
          console.error('Error al subir el archivo:', error);
          alert('No se pudo subir el archivo. Inténtelo nuevamente.');
        },
      });
    }
  }
  
   onFileSelected2(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const archivoExistente = this.listadoCarpetaPlanos.find(item => item.nombre === file.name);
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

          this.listadoCarpetaPlanos = [...this.listadoCarpetaPlanos, archivo];

          input.value = '';
        },
        error: (error) => {
          console.error('Error al subir el archivo:', error);
          alert('No se pudo subir el archivo. Inténtelo nuevamente.');
        },
      });
    }
  }

  onFileSelected3(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const archivoExistente = this.listadoCarpetaElectrica.find(item => item.nombre === file.name);
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

          this.listadoCarpetaElectrica = [...this.listadoCarpetaElectrica, archivo];

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
  guardarArchivo2(): void {
    setTimeout(() => {
      alert('El archivo se ha guardado exitosamente');
    }, 5000);
  }
  guardarArchivo3(): void {
    setTimeout(() => {
      alert('El archivo se ha guardado exitosamente');
    }, 5000);
  }

  eliminarArchivo(archivo: Archivo): void {
    const index = this.listadoCarpetaTecnica.indexOf(archivo);
    if (index !== -1) {
      this.listadoCarpetaTecnica.splice(index, 1);
    }
  }
  eliminarArchivo2(archivo: Archivo): void {
    const index = this.listadoCarpetaPlanos.indexOf(archivo);
    if (index !== -1) {
      this.listadoCarpetaPlanos.splice(index, 1);
    }
  }
  
  eliminarArchivo3(archivo: Archivo): void {
    const index = this.listadoCarpetaElectrica.indexOf(archivo);
    if (index !== -1) {
      this.listadoCarpetaElectrica.splice(index, 1);
    }
  }

   handleDropdownChangeTipoFuente(event: any): void {
    if (event.value === 'Otro' || event.value === 'Otra') {
      this.activaTipoFuente = false;
      // FIX: Esto es para que cambie a input, implemetar
      // this.selectedTipoFuente = 'Otro';
      // this.otroTipoFuente = '';
    }else {
      this.activaTipoFuente = true;
    }
  }

  transformToDropdownFormatTipoFuente(tipoFuente: TipoFuente): any[] {
    return Object.keys(tipoFuente).map(key => ({
      label: key,
      items: [
        ...tipoFuente[key].map(subtipo => ({
          label: subtipo,
          value: subtipo
        })),
        ...(key === 'Otro'  ? [{ label: 'Otro tipo', value: 'Otro' }] : [])
        ]
      }));
    }
  
    onRubroSeleccionado(event: any): void {
      this.rubroSeleccionado = event.value;
      const rubroId = this.rubroSeleccionado ? this.rubroSeleccionado.idRubro : null;
      if (rubroId === null) {
        console.error('No se ha seleccionado ningún rubro.');
        return;
      }

      this.proyectoService.getEspecieProyecto(rubroId.toString()).subscribe({
        next: (resp) => {
          this.especieOpciones = resp;
          this.especieSeleccionada = null;
          this.unidadMedidaOpciones = [];
        },
        error: (err) => {
          console.error('Error al obtener las especies:', err);
        }
      });
    }

    onRubroSeleccionadoFuturo(event: any): void {
      this.rubroSeleccionadoFutura = event.value;
      const rubroId = this.rubroSeleccionadoFutura ? this.rubroSeleccionadoFutura.idRubro : null;
      if (rubroId === null) {
        console.error('No se ha seleccionado ningún rubro.');
        return;
      }

      this.proyectoService.getEspecieProyecto(rubroId.toString()).subscribe({
        next: (resp) => {
          this.especieOpcionesFuturo = resp;
          this.especieSeleccionadaFutura = null;
          this.unidadMedidaOpcionesFuturo = [];
        },
        error: (err) => {
          console.error('Error al obtener las especies:', err);
        }
      });
    }

    onEspecieSeleccionada(event: any): void {
      this.especieSeleccionada = event.value;
      const especieId = this.especieSeleccionada!.idEspecie;

      this.proyectoService.getUnidadMedida(especieId.toString()).subscribe({
        next: (resp) => {
          if (resp.length > 0) {
            this.unidadMedidaOpciones = resp;
          } else {
            this.unidadMedidaOpciones = [{
              idUnidadMedida: -1,
              unidadMedida: 'No aplica unidad de medida'
            }];
          }

          this.unidadMedidaSeleccionada = this.unidadMedidaOpciones[0];
        },
        error: (err) => {
          console.error('Error al obtener las unidades de medida:', err);
        }
      });
    }

     onEspecieSeleccionadaFuturo(event: any): void {
      this.especieSeleccionadaFutura = event.value;
      const especieId = this.especieSeleccionadaFutura!.idEspecie;

      this.proyectoService.getUnidadMedida(especieId.toString()).subscribe({
        next: (resp) => {
          if (resp.length > 0) {
            this.unidadMedidaOpcionesFuturo = resp;
          } else {
            this.unidadMedidaOpcionesFuturo = [{
              idUnidadMedida: -1,
              unidadMedida: 'No aplica unidad de medida'
            }];
          }

          this.unidadMedidaSeleccionadaFutura = this.unidadMedidaOpcionesFuturo[0];
        },
        error: (err) => {
          console.error('Error al obtener las unidades de medida:', err);
        }
      });
    }

    onUnidadMedidaSeleccionada(event: any): void {
      this.unidadMedidaSeleccionada = event.value;
    }

     onUnidadMedidaSeleccionadaFuturo(event: any): void {
      this.unidadMedidaSeleccionadaFutura = event.value;
    }

  onCheckboxChange(tipo: any): void {
    // Desmarcar todos
    this.tipoInversiones.forEach(t => t.selected = false);
    
    // Marcar solo el seleccionado
    tipo.selected = !tipo.selected;
    
    if (tipo.selected) {
        this.tipoInversionSeleccionado = tipo;
        this.tipologiaOpciones = tipo.tipologias;
    } else {
        this.tipoInversionSeleccionado = null;
        this.tipologiaOpciones = [];
    }
    
    this.tipologiaSeleccionada = null;
    this.cd.detectChanges();
}
  //FIX: queda pendiente de implementacion
  // onTipoInversionSeleccionada(nombreTipo: string): void {
    
  //   const tipoSeleccionado = this.tipoInversiones.find(t => t.nombre === nombreTipo);
  //   if (tipoSeleccionado) {
  //     this.tipoInversionSeleccionado = tipoSeleccionado.tipologias;
  //   }
  // }

  onTipologiaSeleccionada(event: any): void {
    this.tipologiaSeleccionada = event.value;
  }
    
  // onTipologiaSeleccionada(tipologia: TipologiaObra): void {
  //   this.tipologiaSeleccionada = tipologia;
  // }

//   getDatosSeleccionados() {
//   return {
//     tipoInversion: this.tipoInversiones.find(t => t.selected),
//     tipologia: this.tipologiaSeleccionada
//   };
// }

  async asignarProyectoDataTecnico(proyectoData: any) {
  const tecnicoData = proyectoData.tecnico;

  if (tecnicoData) {
    this.coordenadas = tecnicoData.georeferenciacion || '';
    this.sueloAgricola = tecnicoData.sueloEsAgricola || false;
    this.tipoConsultoria = tecnicoData.tipoConsultoria || false;
    this.riega = tecnicoData.riega || false;
    this.metodoRiego = this.metodoRiegoOpciones.find(option => option.name === tecnicoData.metodoRiego) || undefined;
    this.selectedTipoFuente = tecnicoData.fuenteEnergia || '';
    this.acomuladorDeAgua = tecnicoData.cuentaConAcumuladorDeAgua || false;
    this.capacidadMetrosCubicos = tecnicoData.capacidadAcumulador?.toString() || '';
    this.caudalMaximo = tecnicoData.capacidadMaximaDelDiseño?.toString() || '';
    this.fuenteEnergiaInversion = tecnicoData.fuenteEnergiaInversion || '';
    this.selectedTipoFuenteInversion = tecnicoData.tipoFuenteEnergia || '';
    this.potenciaPeak = tecnicoData.potenciaPeakDeFuenteEnergia?.toString() || '';
    this.configuracion = this.configuracionOpciones.find(option => option.name === tecnicoData.configuracionDeFuenteEnergia) || undefined;

    this.listadoCarpetaTecnica = tecnicoData.archivosCarpetaTecnica || [];
    this.listadoCarpetaPlanos = tecnicoData.archivosCarpetaPlano || [];
    this.listadoCarpetaElectrica = tecnicoData.archivosBoletasElectricas || [];

    if (tecnicoData?.tiposInversion?.length > 0) {
    const tipoInversionBackend = tecnicoData.tiposInversion[0];

    // Buscar el tipo de inversión correspondiente
    this.tipoInversionSeleccionado = this.tipoInversiones.find(
      t => t.nombre === tipoInversionBackend.tipoInversion
    );
    

    if (this.tipoInversionSeleccionado) {

      this.tipoInversiones.forEach(t => t.selected = t === this.tipoInversionSeleccionado);
      // Cargar tipologías asociadas
      this.tipologiaOpciones = this.tipoInversionSeleccionado.tipologias;
      
      // Buscar la tipología específica
      this.tipologiaSeleccionada = this.tipologiaOpciones.find(
        t => t.tipologia === tipoInversionBackend.tipologia
      ) || null;

      this.tipoInversiones.forEach(tipo => {
      if (tipo.nombre === this.tipoInversionSeleccionado?.nombre) {
        tipo.selected = true;
      }
    });

    this.listaSeleccionadaTipoInversiones = this.tipoInversiones;
    }

    // Asignar resto de propiedades
    this.tamanio = tipoInversionBackend.tamaño?.toString() || '';

      this.tamanio = tipoInversionBackend.tamaño?.toString() || '';
      this.ancho = tipoInversionBackend.ancho?.toString() || '';
      this.alto = tipoInversionBackend.alto?.toString() || '';
      this.largo = tipoInversionBackend.largo?.toString() || '';
      this.pendienteInclinacion = tipoInversionBackend.pendiente?.toString() || '';
      this.caudal = tipoInversionBackend.caudal?.toString() || '';
      this.talud = tipoInversionBackend.talud?.toString() || '';
    }

  }
}

async cargarCultivo(cultivo: any) {
  this.rubroSeleccionado = this.rubroOpciones.find(rubro => rubro.rubro === cultivo.rubro) || null;

  if (this.rubroSeleccionado) {
    this.especieOpciones = await this.proyectoService.getEspecieProyecto(this.rubroSeleccionado.idRubro.toString()).toPromise() || [];

    this.especieSeleccionada = this.especieOpciones.find(especie => especie.especie === cultivo.especie) || null;

    if (this.especieSeleccionada) {
      this.unidadMedidaOpciones = await this.proyectoService.getUnidadMedida(this.especieSeleccionada.idEspecie.toString()).toPromise() || [];

      this.unidadMedidaSeleccionada = this.unidadMedidaOpciones.find(unidad => unidad.unidadMedida === cultivo.unidadMedida) || null;
    }
  }

  this.superficie = cultivo.superficie?.toString() || '';
}

async cargarCultivoFuturo(cultivoFuturo: any) {
  this.rubroSeleccionadoFutura = this.rubroOpcionesFuturo.find(rubro => rubro.rubro === cultivoFuturo.rubro) || null;

  if (this.rubroSeleccionadoFutura) {
    this.especieOpcionesFuturo = await this.proyectoService.getEspecieProyecto(this.rubroSeleccionadoFutura.idRubro.toString()).toPromise() || [];

    this.especieSeleccionadaFutura = this.especieOpcionesFuturo.find(especie => especie.especie === cultivoFuturo.especie) || null;

    if (this.especieSeleccionadaFutura) {
      this.unidadMedidaOpcionesFuturo = await this.proyectoService.getUnidadMedida(this.especieSeleccionadaFutura.idEspecie.toString()).toPromise() || [];

      this.unidadMedidaSeleccionadaFutura = this.unidadMedidaOpcionesFuturo.find(unidad => unidad.unidadMedida === cultivoFuturo.unidadMedida) || null;
    }
  }

  this.superficieFuruta = cultivoFuturo.superficie?.toString() || '';
}



  ngOnInit(): void {

     this.route.params.pipe(
    switchMap(params => {
      this.idProyectoBorrador = params['id'];
      return this.proyectoService.getTipoInversion();
    }),
    switchMap((respuestaTipologias: RespuestaTipologias) => {
      this.tipoInversiones = Object.keys(respuestaTipologias).map(nombre => ({
        nombre,
        selected: false,
        tipologias: respuestaTipologias[nombre]
      }));
      return this.proyectoService.getProyectoId(this.idProyectoBorrador);
    })
  ).subscribe({
    next: (proyecto) => {
      this.asignarProyectoDataTecnico(proyecto);
      this.cd.detectChanges(); // Forzar detección de cambios
    },
    error: (err) => console.error('Error:', err)
  });

    this.proyectoService.getRubrosProyecto().subscribe({
      next: (resp) => {
        this.rubroOpciones = resp;
        this.rubroOpcionesFuturo = resp;
      },
      error: (err) => {
        console.error('Error al obtener los rubros:', err);
      }
    });

    this.proyectoService.getMetodoRiego().subscribe({
      next: (resp) => {
        this.metodoRiegoOpciones = convertToDropdownOptions(resp);
      }
    });

    this.proyectoService.getFuenteEnergia().subscribe({
          next: (tipofuente: TipoFuente) => {
          
          if (tipofuente && typeof tipofuente === 'object') {
            this.groupedTipoFuente = this.transformToDropdownFormatTipoFuente(tipofuente);
          } else {
            console.error('La respuesta no tiene el formato esperado');
          }
        },
        error: (err: any) => console.error('Error fetching tipoFuente:', err)
      });

      this.proyectoService.getTipoApoyo().subscribe({
        next: (resp) => {
          if (resp && typeof resp === 'object') {
            this.tiposApoyo = resp;
            this.tiposApoyoOriginal = resp;
            console.log('tipos apoyo', this.tiposApoyo);
          } else {
            console.error('La respuesta no tiene el formato esperado');
          }
        },
        error: (err: any) => console.error('Error fetching tipoApoyo:', err)
      });

    this.proyectoService.getTipoConsultoria().subscribe({
      next: (resp) => {
        if (resp && typeof resp === 'object') {
          this.tipoConsultoria = resp;
          this.radioTipoConsultoria = resp.map(tc => ({
            name: tc.tipo_consultoria,
            id: tc.id,
            respuesta:  tc.id === this.tipoConsultoriaSeleccionado
          }));
          console.log('tipos consultoria', this.tipoConsultoria);
        } else {
          console.error('La respuesta no tiene el formato esperado');
        }
      },
      error: (err: any) => console.error('Error fetching tipoConsultoria:', err)
    });

    this.route.params.subscribe(params => {
      this.idProyectoBorrador = params['id'];

      this.proyectoService.getProyectoId(this.idProyectoBorrador).subscribe({
        next: (resp) => {
          this.asignarProyectoDataTecnico(resp);
        },
        error: (err) => {
          console.error('Error al obtener proyecto:', err);
        }
      });
    });

    this.proyectoService.getTipoInversion().subscribe({
      next: (resp: RespuestaTipologias) => {

        this.tipoInversiones = Object.keys(resp).map((nombre) => ({
          nombre,
          selected: false,
          tipologias: resp[nombre]
        }));

      },
      error: (err) => {
        console.error('Error al obtener los tipos de inversión:', err);
      }
    });

    this.configuracionOpciones = [
    { name: 'Off-grid', id: 1 },
    { name: 'On-grid sin inyección', id: 2 },
    { name: 'On-grid con inyección', id: 3 }
    ]
  }

  onLocation(loc: { lat:number; lng:number; utmE:number; utmN:number; zone:number }) {
    console.log('Seleccionaste:', loc);
    this.coordenadas = loc

    this.latLngInput = `${this.coordenadas.lat},${this.coordenadas.lng}`;
  }

  debug(event: any) {
    console.log('event', event);
  }

  filtrarTipoApoyo(event: any) {
    console.log('event', event);
  }

  filtrarListaTipoApoyo(idTipoConsultoria: string) {
    this.tiposApoyo = this.tiposApoyoOriginal;
    this.tiposApoyo = this.tiposApoyo.filter(t => t.id_tipo_consultoria === idTipoConsultoria);
  }
}
