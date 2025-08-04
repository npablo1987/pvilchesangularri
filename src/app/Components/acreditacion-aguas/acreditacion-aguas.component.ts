import { CommonModule } from '@angular/common';
import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextComponent } from '../input-text/input-text.component';
import { InputNumberComponent } from '../input-number/input-number.component';
import { AdjuntarArchivosComponent } from '../adjuntar-archivos/adjuntar-archivos.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AcreditacionAgua, Archivo, ArticuloAsociado, EjercicioDerechos, TipoAgua, TipoFuente, TipoTenencia, UnidadMedida } from '../../interfaces/proyecto.interfaces';
import { ProyectosService } from '../../services/proyectos.service';
import { convertToDropdownOptions } from '../../utils/formatters';
import { ActivatedRoute } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-acreditacion-aguas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    DropdownModule,
    InputTextComponent,
    InputNumberComponent,
    AdjuntarArchivosComponent,
    RadioButtonModule,
    TableModule,
    ButtonModule
  ],
  templateUrl: './acreditacion-aguas.component.html',
  styleUrls: ['./acreditacion-aguas.component.scss']
})
export class AcreditacionAguasComponent implements OnInit{

  @Input('data') acreditacionAgua!: AcreditacionAgua;
  @Input('index') index!: number;

  @Input() data!: AcreditacionAgua;

  /** Emite cuando el usuario quiere eliminar esta tarjeta */
  @Output() remove = new EventEmitter<void>();

  tipoFuente: TipoFuente | undefined;
  detalleTipoFuente: string = '';
  tipoTenencia: TipoTenencia | undefined;
  caudalDisponible: string = '';
  unidadMedida: UnidadMedida | undefined;
  articuloAsociado: ArticuloAsociado | undefined ;
  ejercicioDerecho: EjercicioDerechos | undefined;
  derechoConsultivo: boolean = false;

  ejercicioDerechoOpciones: EjercicioDerechos[] = []
  articuloAsociadoOpciones: ArticuloAsociado[] = [];
  unidadAgua: UnidadMedida[] = [];
  TipoTenenciaOpciones: TipoTenencia[] = [];
  groupedTipoAgua: any[] = [];
  groupedTipoFuente: any[] = [];
  selectedTipoFuente: any;
  selectedTipoAgua: any;

  otroTipoAgua: string = '';
  otroTipoFuente: string = '';
  activaTipoAgua: boolean = true;
  activaTipoFuente: boolean = true;

  listadoCarpetaAgua: Archivo[] = [];
  idProyectoBorrador: string = '';
  archivo: Archivo = {} as Archivo;

  listadoTipoAgua: TipoAgua = {} as TipoAgua;

  activaTipoTenencia: boolean = true;
  activaArticuloAsociado: boolean = true;
  activaEjercicioDerecho: boolean = true;
  activaAguaConsultivo: boolean = true;

  alertaCaudalAgua: boolean = false;

  esAPR: boolean = false;
  nombreAPR: string = '';

  activaAPR: boolean = false;

  // acreditacionAgua: AcreditacionAgua = {
  //   tipoAgua: '',
  //   tipoFuente: '',
  //   detalleTipoFuente: '',
  //   tipoTenencia: '',
  //   caudalDisponible: 0,
  //   unidadMedida: '',
  //   articuloAsociado: '',
  //   ejercicioDerecho: '',
  //   esDerechoConsultivo: false,
  //   archivosCarpetaLegal: []
  // };

  constructor(
    private proyectoService: ProyectosService,
    private route: ActivatedRoute
  ) {
   }

   actualizarAcreditacionAgua() {    
    this.acreditacionAgua = {
      tipoAgua: this.selectedTipoAgua || this.otroTipoAgua,
      esAPR: this.esAPR,
      nombreAPR: this.nombreAPR,
      tipoFuente: this.selectedTipoFuente || this.otroTipoFuente,
      detalleTipoFuente: this.detalleTipoFuente,
      tipoTenencia: this.tipoTenencia?.name || '',
      caudalDisponible: parseFloat(this.caudalDisponible),
      unidadMedida: this.unidadMedida?.name || '',
      articuloAsociado: this.articuloAsociado?.name || '',
      ejercicioDerecho: this.ejercicioDerecho?.name || '',
      esDerechoConsultivo: this.derechoConsultivo ? true : false,
      archivosCarpetaLegal: this.data.archivosCarpetaLegal
    };
  }

   handleDropdownChange(event: any): void {
    if (event.value === 'Otra') {
      this.activaTipoAgua = false;
      this.selectedTipoAgua = 'Otra';
      this.otroTipoAgua = '';
    }else {
      this.activaTipoAgua = true;
    }
    this.reglaAguaPotableyReutilizada();
    // this.reglaCaudalAgua();
    // this.reglaTenencia();
  }

  handleDropdownChangeTipoFuente(event: any): void {
    if (event.value === 'Otro' || event.value === 'Otra') {
      this.activaTipoFuente = false;
      this.selectedTipoFuente = 'Otro';
      this.otroTipoFuente = '';
    }else {
      this.activaTipoFuente = true;
    }
  }

  clearOtroTipo(): void {
    this.activaTipoAgua = true;
    this.selectedTipoAgua = null; 
    this.otroTipoAgua = '';
  }

  clearOtroTipoFuente(): void {
    this.activaTipoFuente = true;
    this.selectedTipoFuente = null;
    this.otroTipoFuente = '';
  }

  transformToDropdownFormat(tipoAgua: TipoAgua): any[] {
  return Object.keys(tipoAgua).map(key => ({
    label: key,
    items: [
      ...tipoAgua[key].map(subtipo => ({
        label: subtipo,
        value: subtipo
      })),
      ...(key === 'Otra' ? [{ label: 'Otro tipo', value: 'Otra' }] : [])
      ]
    }));
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

  triggerFileInput() {
    const input = document.getElementById(`fileInputAgua${this.index}`) as HTMLInputElement;
    input.click();
    // const fileInput = document.getElementById('fileInput2') as HTMLInputElement;
    // fileInput.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const archivoExistente = this.data.archivosCarpetaLegal.find(item => item.nombre === file.name);
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

          // this.listadoCarpetaAgua = [...this.listadoCarpetaAgua, archivo];
          this.data.archivosCarpetaLegal.push(archivo);

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
    const index = this.data.archivosCarpetaLegal.indexOf(archivo);
    if (index !== -1) {
      this.data.archivosCarpetaLegal.splice(index, 1);
    }
  }

  asignarAguasData(proyectoData: any) {
    const aguasData = proyectoData.legal;

    if (aguasData && aguasData.acreditacionesAgua && aguasData.acreditacionesAgua.length > 0) {
      const acreditacionAgua = aguasData.acreditacionesAgua[0];

      this.selectedTipoAgua = acreditacionAgua.tipoAgua;
      this.esAPR = acreditacionAgua.esAPR;
      this.nombreAPR = acreditacionAgua.nombreAPR;
      this.selectedTipoFuente = acreditacionAgua.tipoFuente;
      this.detalleTipoFuente = acreditacionAgua.detalleTipoFuente;
      this.tipoTenencia = this.TipoTenenciaOpciones.find(tenencia => tenencia.name === acreditacionAgua.tipoTenencia);
      this.caudalDisponible = acreditacionAgua.caudalDisponible.toString();
      this.unidadMedida = this.unidadAgua.find(unidad => unidad.name === acreditacionAgua.unidadMedida);
      this.articuloAsociado = this.articuloAsociadoOpciones.find(articulo => articulo.name === acreditacionAgua.articuloAsociado);
      this.ejercicioDerecho = this.ejercicioDerechoOpciones.find(derecho => derecho.name === acreditacionAgua.ejercicioDerecho);
      this.derechoConsultivo = acreditacionAgua.esDerechoConsultivo || false;
      this.data.archivosCarpetaLegal = acreditacionAgua.archivosCarpetaLegal || [];

      if (this.selectedTipoAgua === 'Otra') {
        this.activaTipoAgua = false;
        this.otroTipoAgua = acreditacionAgua.tipoAgua;
      }

      if (this.selectedTipoFuente === 'Otro') {
        this.activaTipoFuente = false;
        this.otroTipoFuente = acreditacionAgua.tipoFuente;
      }
    }
  }

  inicializar() {
    const acreditacionAgua = this.acreditacionAgua;

    if (acreditacionAgua) {
      this.selectedTipoAgua = acreditacionAgua.tipoAgua;
      this.esAPR = acreditacionAgua.esAPR;
      this.nombreAPR = acreditacionAgua.nombreAPR;
      this.selectedTipoFuente = acreditacionAgua.tipoFuente;
      this.detalleTipoFuente = acreditacionAgua.detalleTipoFuente;
      this.tipoTenencia = this.TipoTenenciaOpciones.find(tenencia => tenencia.name === acreditacionAgua.tipoTenencia);
      this.caudalDisponible = acreditacionAgua.caudalDisponible.toString();
      this.unidadMedida = this.unidadAgua.find(unidad => unidad.name === acreditacionAgua.unidadMedida);
      this.articuloAsociado = this.articuloAsociadoOpciones.find(articulo => articulo.name === acreditacionAgua.articuloAsociado);
      this.ejercicioDerecho = this.ejercicioDerechoOpciones.find(derecho => derecho.name === acreditacionAgua.ejercicioDerecho);
      this.derechoConsultivo = acreditacionAgua.esDerechoConsultivo || false;
      this.listadoCarpetaAgua = acreditacionAgua.archivosCarpetaLegal || [];

      if (this.selectedTipoAgua === 'Otra') {
        this.activaTipoAgua = false;
        this.otroTipoAgua = acreditacionAgua.tipoAgua;
      }

      if (this.selectedTipoFuente === 'Otro') {
        this.activaTipoFuente = false;
        this.otroTipoFuente = acreditacionAgua.tipoFuente;
      }
    }
  }

  ngOnInit(): void {
    
    this.route.params.subscribe(params => {
      this.idProyectoBorrador = params['id'];

      this.proyectoService.getProyectoId(this.idProyectoBorrador).subscribe({
        next: (resp) => {
          // this.asignarAguasData(resp);
          this.inicializar();
        },
        error: (err) => {
          console.error('Error al obtener proyecto:', err);
        }
      });
    });

    this.proyectoService.getUnidadAgua().subscribe({
      next: (resp) => {
        console.log("unidadAgua", resp);
        this.unidadAgua = convertToDropdownOptions(resp);
      }
    });

    this.proyectoService.getTipoTenencia().subscribe({
      next: (resp) => {
        this.TipoTenenciaOpciones = convertToDropdownOptions(resp);
      }
    });

    this.proyectoService.getArticuloAsociado().subscribe({
      next: (resp) => {
        this.articuloAsociadoOpciones = convertToDropdownOptions(resp);
      }
    });

    this.proyectoService.getEjercicioDerecho().subscribe({
      next: (resp) => {
        this.ejercicioDerechoOpciones = convertToDropdownOptions(resp);
      }
    });

     this.proyectoService.getTipoAgua().subscribe({
      next: (tipoAguaObject: TipoAgua) => {

        console.log("tipoAgua", tipoAguaObject);
      
      if (tipoAguaObject && typeof tipoAguaObject === 'object') {
        this.groupedTipoAgua = this.transformToDropdownFormat(tipoAguaObject);
        this.listadoTipoAgua = tipoAguaObject;
      } else {
        console.error('La respuesta no tiene el formato esperado');
      }
    },
    error: (err: any) => console.error('Error fetching tipoAgua:', err)
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
  
  this.reglaAguaPotableyReutilizada();
  // this.reglaCaudalAgua();
  // this.reglaTenencia();
    
  }
  
  onRemoveClick() {
    this.remove.emit();
  }

  habilitarCampos(): void {
    this.activaTipoFuente = true;
    this.activaTipoTenencia = true;
    this.activaArticuloAsociado = true;
    this.activaEjercicioDerecho = true;
    this.activaAguaConsultivo = true;
    this.activaTipoAgua = true;
    this.alertaCaudalAgua = false;
    this.activaAPR = false;
    this.selectedTipoFuente = null;
    this.otroTipoFuente = '';
  }
  

  //   De seleccionar tipo de agua Potable y Reutilizada no debe mostrar opciones de Tipo de fuente, Tipo de tenencia, Articulo Asociado, Ejercicio del Derecho y pregunta de agua consuntivo 
  reglaAguaPotableyReutilizada() : void {
    this.habilitarCampos();

    //console.log("es potable o reutilizada", this.listadoTipoAgua.Potable.includes(this.selectedTipoAgua) || this.listadoTipoAgua.Reutilizada.includes(this.selectedTipoAgua))

    if(this.listadoTipoAgua.Potable.includes(this.selectedTipoAgua) || this.listadoTipoAgua.Reutilizada.includes(this.selectedTipoAgua)){
      this.activaTipoFuente = false;
      this.activaTipoTenencia = false;
      this.activaArticuloAsociado = false;
      this.activaEjercicioDerecho = false;
      this.activaAguaConsultivo = false;
      this.tipoFuente = undefined;
      this.tipoTenencia = undefined;
      this.articuloAsociado = undefined;
      this.ejercicioDerecho = undefined;
      // this.clearOtroTipoFuente();
    }

    if(this.listadoTipoAgua.Potable.includes(this.selectedTipoAgua)){
      this.activaAPR = true;
    }

    console.log("activaAPR", this.activaAPR);
    console.log("selectedTipoAgua", this.selectedTipoAgua);
    console.log("listadoTipoAgua", this.listadoTipoAgua);
    console.log("activaTipoAgua", this.activaTipoAgua);
    console.log("activaTipoFuente", this.activaTipoFuente);
    console.log("activaTipoTenencia", this.activaTipoTenencia);
    console.log("activaArticuloAsociado", this.activaArticuloAsociado);
    console.log("activaEjercicioDerecho", this.activaEjercicioDerecho);
    console.log("activaAguaConsultivo", this.activaAguaConsultivo);
  }

  // Artículo de código de Aguas solo se despliega si la tenencia es por ministerio de la ley. 
  // Si la tenencia corresponde a Por Ministerio de la Ley no debe mostrar opciones de Ejercicio del Derecho y pregunta de agua consuntivo 
  reglaTenencia() : void {
    if(this.tipoTenencia?.name === 'Por ministerio de la ley'){
      this.activaArticuloAsociado = true;
      this.activaEjercicioDerecho = false;
      this.activaAguaConsultivo = false;
    }else{
      this.activaArticuloAsociado = false;
      this.activaEjercicioDerecho = true;
      this.activaAguaConsultivo = true;
    }
  }

  // Si seleccionó Art. 56 e ingresa un caudal superior a 0,5 l/s, el sistema no debe permitir continuar y entregar "El caudal registrado excede lo estipulado en la normativa vigente relacionadas con el artículo 56 del Código de Aguas”. 
  reglaCaudalAgua() : void {    
    if(this.articuloAsociado?.name === 'Art. 56' && this.unidadMedida?.name === 'L/S' && parseFloat(this.caudalDisponible) > 0.5){
      this.alertaCaudalAgua = true;
    } else {
      this.alertaCaudalAgua = false;
    }
  }

  // Si selecciona agua potable, consultar si corresponde a un APR: SI/NO. Si la respuesta es SI, abrir cuadro de texto que solicite ingresar el nombre del APR.
}
