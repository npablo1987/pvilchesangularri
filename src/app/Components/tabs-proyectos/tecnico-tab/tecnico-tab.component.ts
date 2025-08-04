import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonsComponent } from '../../buttons/buttons.component';
import { InputTextComponent } from '../../input-text/input-text.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { AdjuntarArchivosComponent } from '../../adjuntar-archivos/adjuntar-archivos.component';
import {
  Archivo,
  Coordenadas,
  Cultivo,
  Especies,
  RespuestaTipologias,
  Rubros,
  Tecnico,
  TipoApoyo,
  TipoConsultoria,
  TipoFuente,
  TipoInversion,
  TipologiaObra,
  UnidadMedidaEspecies,
  CultivoExtendido,
} from '../../../interfaces/proyecto.interfaces';
import { ProyectosService } from '../../../services/proyectos.service';
import { ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { convertToDropdownOptions } from '../../../utils/formatters';
import { switchMap } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapPickerComponent } from '../../map-picker/map-picker.component';
import { RadioButtonComponent } from '../../radio-button/radio-button.component';
import { InputNumberComponent } from '../../input-number/input-number.component';

@Component({
  selector: 'app-tecnico-tab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonsComponent,
    InputTextComponent,
    InputNumberComponent,
    RadioButtonModule,
    CardModule,
    DropdownModule,
    CheckboxModule,
    AdjuntarArchivosComponent,
    TableModule,
    ButtonModule,
    GoogleMapsModule,
    MapPickerComponent,
    RadioButtonComponent,
    RouterOutlet,
  ],
  templateUrl: './tecnico-tab.component.html',
  styleUrl: './tecnico-tab.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TecnicoTabComponent implements OnInit {
  textoGeoreferenciacion: string =
    'Por favor posicione geográficamente el origen del agua, para eso haga click en el botón [Buscar en el mapa], mueva el mapa y ubique la cruz roja en el punto de origen de agua del proyecto.';
  cultivos: CultivoExtendido[] = [
    {
      rubro: null,
      especie: null,
      superficie: 0,
      unidadMedida: null,
      especieOpciones: [],
      unidadOpciones: [],
    },
  ];

  cultivosFuturos: CultivoExtendido[] = [
    {
      rubro: null,
      especie: null,
      superficie: 0,
      unidadMedida: null,
      especieOpciones: [],
      unidadOpciones: [],
    },
  ];

  sueloAgricola: boolean = false;
  tipoConsultoria: TipoConsultoria[] = [];
  tiposApoyo: TipoApoyo[] = [];
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
  configuracion: { id: number; name: string } | undefined;
  listadoCarpetaTecnica: Archivo[] = [];
  listadoCarpetaPlanos: Archivo[] = [];
  listadoCarpetaElectrica: Archivo[] = [];
  idProyectoBorrador: string = '';

  metodoRiegoOpciones: { id: string; name: string }[] = [];
  metodoRiego: { id: string; name: string } | undefined;
  fuenteEnergia: string[] = [];
  selectedFuenteEnergia: any;
  groupedTipoFuente: any[] = [];
  activaTipoFuente: boolean = true;
  selectedTipoFuente: any;

  configuracionOpciones: { id: number; name: string }[] = [];

  rubroOpciones: Rubros[] = [];
  especieOpciones: Especies[] = [];
  unidadMedidaOpciones: UnidadMedidaEspecies[] = [];
  tipologiaOpciones: TipologiaObra[] = [];
  tipologiaSeleccionada: TipologiaObra | null = null;
  public descripcionTipologiaOtra: string = '';
  tipoInversiones: {
    nombre: string;
    selected: boolean;
    tipologias: TipologiaObra[];
  }[] = [];
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
  listaSeleccionadaTipoInversiones: {
    nombre: string;
    selected: boolean;
    tipologias: TipologiaObra[];
  }[] = [];
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

  public tamanioLabel = '';
  public unidadMedidaLabel = '';
  public tamanioValor: number | null = null;
  public fuenteEnergiaOptions: { label: string; value: string }[] = [];
  public diametro: string = '';
  public profundidadNivelEstatico: string = '';
  contemplaInversionEnergia: boolean = false;
  selectedFuenteEnergiaInversion: string = '';

  constructor(
    private proyectoService: ProyectosService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  agregarCultivo(): void {
    this.cultivos.push({
      rubro: null,
      especie: null,
      superficie: 0,
      unidadMedida: null,
      especieOpciones: [],
      unidadOpciones: [],
    });
  }

  agregarCultivoFuturo(): void {
    this.cultivosFuturos.push({
      rubro: null,
      especie: null,
      superficie: 0,
      unidadMedida: null,
      especieOpciones: [],
      unidadOpciones: [],
    });
  }

  quitarCultivo(index: number): void {
    this.cultivos.splice(index, 1);
  }

  quitarCultivoFuturo(index: number) {
    this.cultivosFuturos.splice(index, 1);
  }

  private toCultivo(c: CultivoExtendido): Cultivo {
    return {
      rubro: c.rubro?.rubro ?? '',
      especie: c.especie?.especie ?? '',
      superficie: Number(c.superficie) || 0,
      unidadMedida: c.unidadMedida?.unidadMedida ?? '',
    };
  }

  getTecnicoData(): Tecnico {
    const cultivos = this.cultivos
      .filter((c) => c.rubro && c.especie)
      .map((c) => this.toCultivo(c));

    const futuroUsoDeSuelo = this.cultivosFuturos
      .filter((c) => c.rubro && c.especie)
      .map((c) => this.toCultivo(c));

    const tiposInversion: TipoInversion[] = this.tipologiaSeleccionada
      ? [
          {
            tipoInversion: this.tipoInversionSeleccionado?.nombre || '',
            unidadDeMedida: this.unidadMedidaSeleccionada?.unidadMedida || '',
            tipologia: this.tipologiaSeleccionada.tipologia,
            tamaño: Number(this.tamanio) || 0,
            ancho: Number(this.ancho) || 0,
            alto: Number(this.alto) || 0,
            largo: Number(this.largo) || 0,
            pendiente: Number(this.pendienteInclinacion) || 0,
            caudal: Number(this.caudal) || 0,
            talud: Number(this.talud) || 0,
            diametro: Number(this.diametro) || 0,
            profundidad: Number(this.profundidadNivelEstatico) || 0,
            descripcion: this.descripcionTipologiaOtra || '',
          },
        ]
      : [];

    return {
      georeferenciacion: this.coordenadas,
      sueloEsAgricola: !!this.sueloAgricola,
      tipoConsultoria: this.tipoConsultoria,
      tiposApoyo: this.tiposApoyo,
      cultivos,
      riega: !!this.riega,
      metodoRiego: this.metodoRiego?.name || '',
      fuenteEnergia: this.selectedTipoFuente || '',
      cuentaConAcumuladorDeAgua: !!this.acomuladorDeAgua,
      capacidadAcumulador: Number(this.capacidadMetrosCubicos) || 0,
      futuroUsoDeSuelo,
      capacidadMaximaDelDiseño: Number(this.caudalMaximo) || 0,
      tiposInversion,
      potenciaPeakDeFuenteEnergia: Number(this.potenciaPeak) || 0,
      configuracionDeFuenteEnergia: this.configuracion?.name || '',
      archivosCarpetaTecnica: this.listadoCarpetaTecnica,
      archivosCarpetaPlano: this.listadoCarpetaPlanos,
      archivosBoletasElectricas: this.listadoCarpetaElectrica,
      contemplaInversionEnergia: this.contemplaInversionEnergia,
      fuenteEnergiaInversion: this.selectedFuenteEnergiaInversion,
      tipoFuenteEnergia: this.selectedTipoFuenteInversion,
    };
  }

  buscarMapa() {}

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

      const archivoExistente = this.listadoCarpetaTecnica.find(
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

            this.listadoCarpetaTecnica = [
              ...this.listadoCarpetaTecnica,
              archivo,
            ];

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

      const archivoExistente = this.listadoCarpetaPlanos.find(
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

      const archivoExistente = this.listadoCarpetaElectrica.find(
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

            this.listadoCarpetaElectrica = [
              ...this.listadoCarpetaElectrica,
              archivo,
            ];

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
    } else {
      this.activaTipoFuente = true;
    }
  }

  transformToDropdownFormatTipoFuente(tipoFuente: TipoFuente): any[] {
    return Object.keys(tipoFuente).map((key) => ({
      label: key,
      items: [
        ...tipoFuente[key].map((subtipo) => ({
          label: subtipo,
          value: subtipo,
        })),
        ...(key === 'Otro' ? [{ label: 'Otro tipo', value: 'Otro' }] : []),
      ],
    }));
  }
  onRubroSeleccionadoDinamico(index: number): void {
    const cultivo = this.cultivos[index];
    const rubro = cultivo.rubro;
    if (!rubro) return;

    this.proyectoService
      .getEspecieProyecto(rubro.idRubro.toString())
      .subscribe({
        next: (especies) => {
          cultivo.especieOpciones = especies;
          cultivo.especie = null;
          cultivo.unidadMedida = null;
          cultivo.unidadOpciones = [];
        },
        error: (err) => console.error('Error al obtener especies:', err),
      });
  }

  onEspecieSeleccionadaDinamico(index: number): void {
    const cultivo = this.cultivos[index];
    const especie = cultivo.especie;
    if (!especie) return;

    this.proyectoService
      .getUnidadMedida(especie.idEspecie.toString())
      .subscribe({
        next: (unidadMedidas) => {
          cultivo.unidadOpciones =
            unidadMedidas.length > 0
              ? unidadMedidas
              : [
                  {
                    idUnidadMedida: -1,
                    unidadMedida: 'No aplica unidad de medida',
                  },
                ];
          cultivo.unidadMedida = cultivo.unidadOpciones[0];
        },
        error: (err) =>
          console.error('Error al obtener unidades de medida:', err),
      });
  }

  onRubroSeleccionadoFuturoDinamico(index: number): void {
    const cultivo = this.cultivosFuturos[index];
    const rubro = cultivo.rubro;
    if (!rubro) return;

    this.proyectoService
      .getEspecieProyecto(rubro.idRubro.toString())
      .subscribe({
        next: (especies) => {
          cultivo.especieOpciones = especies;
          cultivo.especie = null;
          cultivo.unidadMedida = null;
          cultivo.unidadOpciones = [];
        },
        error: (err) => console.error('Error al obtener especies:', err),
      });
  }

  onEspecieSeleccionadaFuturoDinamico(index: number): void {
    const cultivo = this.cultivosFuturos[index];
    const especie = cultivo.especie;
    if (!especie) return;

    this.proyectoService
      .getUnidadMedida(especie.idEspecie.toString())
      .subscribe({
        next: (unidadMedidas) => {
          cultivo.unidadOpciones =
            unidadMedidas.length > 0
              ? unidadMedidas
              : [
                  {
                    idUnidadMedida: -1,
                    unidadMedida: 'No aplica unidad de medida',
                  },
                ];
          cultivo.unidadMedida = cultivo.unidadOpciones[0];
        },
        error: (err) =>
          console.error('Error al obtener unidades de medida:', err),
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
    this.tipoInversiones.forEach((t) => (t.selected = false));

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
    if (this.tipologiaSeleccionada?.tipologia !== 'Otro') {
      this.descripcionTipologiaOtra = '';
    }

    const defs = this.tipoInversionSeleccionado?.tipologias || [];
    const sel = defs.find(
      (t: TipologiaObra) =>
        t.tipologia === this.tipologiaSeleccionada?.tipologia
    );
    if (sel) {
      this.tamanioLabel = sel.tamaño;
      this.unidadMedidaLabel = sel.unidadDeMedida;
      this.tamanioValor = null;
    } else {
      this.tamanioLabel = '';
      this.unidadMedidaLabel = '';
      this.tamanioValor = null;
    }
  }

  async asignarProyectoDataTecnico(proyectoData: any) {
    const tecnicoData = proyectoData.tecnico;
    if (!tecnicoData) return;
    this.contemplaInversionEnergia = !!tecnicoData.contemplaInversionEnergia;
    this.fuenteEnergiaInversion = tecnicoData.fuenteEnergiaInversion || '';
    this.selectedTipoFuenteInversion = tecnicoData.tipoFuenteEnergia || '';
    this.coordenadas = tecnicoData.georeferenciacion || '';
    this.sueloAgricola = tecnicoData.sueloEsAgricola || false;
    this.riega = tecnicoData.riega || false;
    this.metodoRiego =
      this.metodoRiegoOpciones.find(
        (o) => o.name === tecnicoData.metodoRiego
      ) || undefined;
    this.selectedTipoFuente = tecnicoData.fuenteEnergia || '';

    this.acomuladorDeAgua = tecnicoData.cuentaConAcumuladorDeAgua || false;
    this.capacidadMetrosCubicos =
      tecnicoData.capacidadAcumulador?.toString() || '';
    this.caudalMaximo = tecnicoData.capacidadMaximaDelDiseño?.toString() || '';

    // --- INVERSIÓN ENERGÍA ---
    this.contemplaInversionEnergia =
      tecnicoData.contemplaInversionEnergia || false;
    this.selectedFuenteEnergiaInversion =
      tecnicoData.fuenteEnergiaInversion || '';
    this.selectedTipoFuenteInversion = tecnicoData.tipoFuenteEnergia || '';
    this.potenciaPeak =
      tecnicoData.potenciaPeakDeFuenteEnergia?.toString() || '';
    this.configuracion =
      this.configuracionOpciones.find(
        (o) => o.name === tecnicoData.configuracionDeFuenteEnergia
      ) || undefined;

    this.listadoCarpetaTecnica = tecnicoData.archivosCarpetaTecnica || [];
    this.listadoCarpetaPlanos = tecnicoData.archivosCarpetaPlano || [];
    this.listadoCarpetaElectrica = tecnicoData.archivosBoletasElectricas || [];

    if (tecnicoData?.tiposInversion?.length > 0) {
      const tipoInv = tecnicoData.tiposInversion[0];
      this.tipoInversionSeleccionado =
        this.tipoInversiones.find((t) => t.nombre === tipoInv.tipoInversion) ||
        null;

      if (this.tipoInversionSeleccionado) {
        this.tipoInversiones.forEach(
          (t) => (t.selected = t === this.tipoInversionSeleccionado)
        );
        this.tipologiaOpciones = this.tipoInversionSeleccionado.tipologias;
        this.tipologiaSeleccionada =
          this.tipologiaOpciones.find(
            (t) => t.tipologia === tipoInv.tipologia
          ) || null;
        this.listaSeleccionadaTipoInversiones = this.tipoInversiones;
      }

      this.tamanio = tipoInv.tamaño?.toString() || '';
      this.ancho = tipoInv.ancho?.toString() || '';
      this.alto = tipoInv.alto?.toString() || '';
      this.largo = tipoInv.largo?.toString() || '';
      this.pendienteInclinacion = tipoInv.pendiente?.toString() || '';
      this.caudal = tipoInv.caudal?.toString() || '';
      this.talud = tipoInv.talud?.toString() || '';
    }

    // --- REHIDRATAR CULTIVOS (actuales y futuros) ---
    const mapCultivo = async (
      c: Cultivo,
      rubrosList: Rubros[]
    ): Promise<CultivoExtendido> => {
      const rubroSel = rubrosList.find((r) => r.rubro === c.rubro) || null;
      let especieOps: Especies[] = [];
      let especieSel: Especies | null = null;
      let unidadOps: UnidadMedidaEspecies[] = [];
      let unidadSel: UnidadMedidaEspecies | null = null;

      if (rubroSel) {
        especieOps =
          (await this.proyectoService
            .getEspecieProyecto(rubroSel.idRubro.toString())
            .toPromise()) || [];
        especieSel = especieOps.find((e) => e.especie === c.especie) || null;
        if (especieSel) {
          unidadOps =
            (await this.proyectoService
              .getUnidadMedida(especieSel.idEspecie.toString())
              .toPromise()) || [];
          unidadSel =
            unidadOps.find((u) => u.unidadMedida === c.unidadMedida) || null;
        }
      }

      return {
        rubro: rubroSel,
        especie: especieSel,
        superficie: c.superficie,
        unidadMedida: unidadSel,
        especieOpciones: especieOps,
        unidadOpciones: unidadOps,
      };
    };

    this.cultivos = await Promise.all(
      (tecnicoData.cultivos || []).map((c: Cultivo) =>
        mapCultivo(c, this.rubroOpciones)
      )
    );

    this.cultivosFuturos = await Promise.all(
      (tecnicoData.futuroUsoDeSuelo || []).map((c: Cultivo) =>
        mapCultivo(c, this.rubroOpcionesFuturo)
      )
    );

    this.cd.detectChanges();
  }

  async cargarCultivo(cultivo: any) {
    this.rubroSeleccionado =
      this.rubroOpciones.find((rubro) => rubro.rubro === cultivo.rubro) || null;

    if (this.rubroSeleccionado) {
      this.especieOpciones =
        (await this.proyectoService
          .getEspecieProyecto(this.rubroSeleccionado.idRubro.toString())
          .toPromise()) || [];

      this.especieSeleccionada =
        this.especieOpciones.find(
          (especie) => especie.especie === cultivo.especie
        ) || null;

      if (this.especieSeleccionada) {
        this.unidadMedidaOpciones =
          (await this.proyectoService
            .getUnidadMedida(this.especieSeleccionada.idEspecie.toString())
            .toPromise()) || [];

        this.unidadMedidaSeleccionada =
          this.unidadMedidaOpciones.find(
            (unidad) => unidad.unidadMedida === cultivo.unidadMedida
          ) || null;
      }
    }

    this.superficie = cultivo.superficie?.toString() || '';
  }

  async cargarCultivoFuturo(cultivoFuturo: any) {
    this.rubroSeleccionadoFutura =
      this.rubroOpcionesFuturo.find(
        (rubro) => rubro.rubro === cultivoFuturo.rubro
      ) || null;

    if (this.rubroSeleccionadoFutura) {
      this.especieOpcionesFuturo =
        (await this.proyectoService
          .getEspecieProyecto(this.rubroSeleccionadoFutura.idRubro.toString())
          .toPromise()) || [];

      this.especieSeleccionadaFutura =
        this.especieOpcionesFuturo.find(
          (especie) => especie.especie === cultivoFuturo.especie
        ) || null;

      if (this.especieSeleccionadaFutura) {
        this.unidadMedidaOpcionesFuturo =
          (await this.proyectoService
            .getUnidadMedida(
              this.especieSeleccionadaFutura.idEspecie.toString()
            )
            .toPromise()) || [];

        this.unidadMedidaSeleccionadaFutura =
          this.unidadMedidaOpcionesFuturo.find(
            (unidad) => unidad.unidadMedida === cultivoFuturo.unidadMedida
          ) || null;
      }
    }

    this.superficieFuruta = cultivoFuturo.superficie?.toString() || '';
  }

  get mostrarCampos1_1(): boolean {
    const inv = this.tipoInversionSeleccionado?.nombre?.toLowerCase() || '';
    const tip = this.tipologiaSeleccionada?.tipologia;
    return (
      inv === 'obras de conducción' &&
      (tip === 'Canal revestido' || tip === 'Loseta')
    );
  }
  onFuenteEnergiaChange(event: any): void {
    this.selectedFuenteEnergia = event.value;
    this.selectedTipoFuente = '';
  }

  get tipoFuenteDropdownOptions(): any[] {
    return this.groupedTipoFuente.filter(
      (grupo) => grupo.label === this.selectedFuenteEnergia
    );
  }

  get mostrarCamposTuberia(): boolean {
    const inv = this.tipoInversionSeleccionado?.nombre?.toLowerCase() || '';
    const tip = this.tipologiaSeleccionada?.tipologia;
    return (
      (inv === 'obras de conducción' || inv === 'obras de captación') &&
      tip === 'Tubería'
    );
  }
  get mostrarCampoProfundidad(): boolean {
    const inv = this.tipoInversionSeleccionado?.nombre?.toLowerCase() || '';
    const tip = this.tipologiaSeleccionada?.tipologia;
    return (
      inv === 'obras de captación' &&
      ['Pozo Profundo', 'Pozo Noria', 'Pozo zanja', 'Puntera'].includes(
        tip || ''
      )
    );
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.idProyectoBorrador = params['id'];
          return this.proyectoService.getTipoInversion();
        }),
        switchMap((respuestaTipologias: RespuestaTipologias) => {
          this.tipoInversiones = Object.keys(respuestaTipologias).map(
            (nombre) => ({
              nombre,
              selected: false,
              tipologias: respuestaTipologias[nombre],
            })
          );
          return this.proyectoService.getProyectoId(this.idProyectoBorrador);
        })
      )
      .subscribe({
        next: (proyecto) => {
          this.asignarProyectoDataTecnico(proyecto);
          this.cd.detectChanges();
        },
        error: (err) => console.error('Error:', err),
      });

    this.proyectoService.getRubrosProyecto().subscribe({
      next: (resp) => {
        this.rubroOpciones = resp;
        this.rubroOpcionesFuturo = resp;
      },
      error: (err) => {
        console.error('Error al obtener los rubros:', err);
      },
    });

    this.proyectoService.getMetodoRiego().subscribe({
      next: (resp) => {
        this.metodoRiegoOpciones = convertToDropdownOptions(resp);
      },
    });

    this.proyectoService.getFuenteEnergia().subscribe({
      next: (tipofuente: TipoFuente) => {
        this.fuenteEnergiaOptions = Object.keys(tipofuente).map((f) => ({
          label: f,
          value: f,
        }));
        this.groupedTipoFuente =
          this.transformToDropdownFormatTipoFuente(tipofuente);
      },
      error: (err) => console.error(err),
    });

    this.route.params.subscribe((params) => {
      this.idProyectoBorrador = params['id'];

      this.proyectoService.getProyectoId(this.idProyectoBorrador).subscribe({
        next: (resp) => {
          this.asignarProyectoDataTecnico(resp);
        },
        error: (err) => {
          console.error('Error al obtener proyecto:', err);
        },
      });
    });

    this.proyectoService.getTipoInversion().subscribe({
      next: (resp: RespuestaTipologias) => {
        this.tipoInversiones = Object.keys(resp).map((nombre) => ({
          nombre,
          selected: false,
          tipologias: resp[nombre],
        }));
      },
      error: (err) => {
        console.error('Error al obtener los tipos de inversión:', err);
      },
    });

    this.configuracionOpciones = [
      { name: 'Off-grid', id: 1 },
      { name: 'On-grid sin inyección', id: 2 },
      { name: 'On-grid con inyección', id: 3 },
    ];
  }
}
