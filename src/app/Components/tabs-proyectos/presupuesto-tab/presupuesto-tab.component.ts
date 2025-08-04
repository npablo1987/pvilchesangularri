import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { InputNumberComponent } from '../../input-number/input-number.component';
import { DocumentacionOficialComponent } from '../../documentacion-oficial/documentacion-oficial.component';
import { TEXTOS_DOCUMENTOS_PRESUPUESTO } from '../../../constants/constantes';
import { Archivo, Presupuesto, SubidaArchivos } from '../../../interfaces/proyecto.interfaces';
import { ProyectosService } from '../../../services/proyectos.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmacionDialogComponent } from '../../confirmacion-dialog/confirmacion-dialog.component';
function parseCLP(str: string): number {
 if (!str) return 0;
 const sinPuntos = str.replace(/\./g, '').replace(/,/g, '');
 return parseFloat(sinPuntos);
}
@Component({
 selector: 'app-presupuesto-tab',
 standalone: true,
 imports: [
   CommonModule,
   FormsModule,
   PanelModule,
   InputTextModule,
   InputNumberModule,
   InputNumberComponent,
   DocumentacionOficialComponent,
   ConfirmacionDialogComponent
 ],
 templateUrl: './presupuesto-tab.component.html',
 styleUrls: ['./presupuesto-tab.component.scss'],
 schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PresupuestoTabComponent implements OnInit {
 @Output() presupuestoEmitido = new EventEmitter<Presupuesto>();
 // Variables A, B, C, D, E:
 totalDirecto: string = '';          // A
 utilidad: string = '';              // B
 generalesImprevistos: string = '';  // C
 iva: string = '';                   // D
 costoTotalEjecucion: string = '';   // E
 // Variables F, G, H, I:
 apoyoFormulacion: string = '';
 apoyoEjecucion: string = '';
 apoyoFormulacionIVA: string = '';
 apoyoEjecucionIVA: string = '';
 costoTotalProyecto: string = '';
 porcentajeIncentivoInversion: string = '';
 incentivoInversion: string = '';
 porcentajeIncentivoFormulacion: string = '';
 incentivoFormulacion: string = '';
 porcentajeIncentivoEjecucion: string = '';
 incentivoEjecucion: string = '';
 porcentajeIncentivoApoyo: string = '';
 incentivoApoyo: string = '';
 incentivoTotal: string = '';
 aportePropio: string = '';
 totalIncentivos: string = '';
 documentacionTextos: any[] = TEXTOS_DOCUMENTOS_PRESUPUESTO;
 archivos: Archivo[] = [];
 mensajeAlerta: string = '';
 // Topes
 maxEjecucionPersonaNatural: number = 12000000;  // 12 millones
 maxEjecucionPersonaJuridica: number = 20000000; // 20 millones
 porcentajeMaximoIncentivo: number = 95; // 95%
 tipoPersona: 'natural' | 'juridica' = 'natural';
 tipoTributacion: 'BOLETA_HONORARIOS' | 'SOCIEDAD_PROFESIONALES' | 'SERVICIO_AFECTO_IVA' | 'INDAP' = 'BOLETA_HONORARIOS';

 tamanio: string = '';
 archivoCartaCompromiso: Archivo | undefined;
 archivoDeclaracionSimple: Archivo | undefined;
 archivoDeclaracionSeleccionConsultor: Archivo | undefined;
 archivoSeleccionContratista: Archivo | undefined;
 archivoAutorizacionPagoConsultor: Archivo | undefined;
 archivoAutorizacionPagoContratista: Archivo | undefined;
 listadoArchivosPresupuesto: Archivo[] = [];
 idProyectoBorrador: string = '';

 nombreArchivoDeclaracionJurada: string = '';
 nombreArchivoDeclaracionContratista: string = '';
 nombreArchivoAutorizacionPagoConsultor: string = '';
 nombreArchivoAutorizacionPagoContratista: string = '';
 nombreArchivoDeclaracionSimple: string = '';
 nombreArchivoCartaCompromiso: string = '';
 mostrarNombreArchivoDeclaracionJurada: boolean = false;
 mostrarNombreArchivoDeclaracionContratista: boolean = false;
 mostrarNombreArchivoAutorizacionPagoConsultor: boolean = false;
 mostrarNombreArchivoAutorizacionPagoContratista: boolean = false;
 mostrarNombreArchivoDeclaracionSimple: boolean = false;
 mostrarNombreArchivoCartaCompromiso: boolean = false;
 

 mensajeError: string = '';
 mensajeExito: string = '';
 mostrarDialog: boolean = false;
 esExito: boolean = false;

archivoInicial: Archivo = {
  id: '4a7aa800-9991-4294-82a3-4996c5ae9dad',
  nombre: 'prueba documento.pdf',
  tamaño: 16271.0
}   
 /**
  * Emite el objeto Presupuesto con los valores parseados a número.
  */
  constructor(
    private proyectoService: ProyectosService,
    private route: ActivatedRoute
  ) {  }

  onConfirmar() {
    this.mostrarDialog = false;
  }

  onCerrar() {
    this.mostrarDialog = false;
  }

  getPresupuesto(): Presupuesto {
      return {
        aCostoTotalDirecto: parseCLP(this.totalDirecto),
        bUtilidad: parseCLP(this.utilidad),
        cGastosGenerales: parseCLP(this.generalesImprevistos),
        dIva: parseCLP(this.iva),
        eCostoTotalEjecucion: parseCLP(this.costoTotalEjecucion),
        fApoyoFormulacionProyecto: parseCLP(this.apoyoFormulacion),
        gApoyoEjecucionOCapacitacion: parseCLP(this.apoyoEjecucion),
        hApoyoFormulacionProyectoIva: parseCLP(this.apoyoFormulacionIVA),
        iApoyoEjecucionOCapacitacionIva: parseCLP(this.apoyoEjecucionIVA),
        costoTotalDelProyecto: parseCLP(this.costoTotalProyecto),
        incentivoInversion: parseCLP(this.incentivoInversion),
        incentivoFormulacion: parseCLP(this.incentivoFormulacion),
        incentivoEjecucionOCapacitacion: parseCLP(this.incentivoEjecucion),
        incentivoApoyoParticipacionDeLosUsuarios: parseCLP(this.incentivoApoyo),
        incentivoTotal: parseCLP(this.incentivoTotal),
        aportePropio: parseCLP(this.aportePropio),
        total: parseCLP(this.totalIncentivos),
        declaracionSeleccionConsultor: {
          id: this.archivoDeclaracionSeleccionConsultor?.id || this.archivoInicial.id,
          nombre: this.archivoDeclaracionSeleccionConsultor?.nombre || this.archivoInicial.nombre,
          tamaño: this.archivoDeclaracionSeleccionConsultor?.tamaño || this.archivoInicial.tamaño,
        },
        seleccionContratista: {
          id: this.archivoSeleccionContratista?.id || this.archivoInicial.id,
          nombre: this.archivoSeleccionContratista?.nombre || this.archivoInicial.nombre,
          tamaño: this.archivoSeleccionContratista?.tamaño || this.archivoInicial.tamaño,
        },
        autorizacionPagoConsultor: {
          id: this.archivoAutorizacionPagoConsultor?.id || this.archivoInicial.id,
          nombre: this.archivoAutorizacionPagoConsultor?.nombre || this.archivoInicial.nombre,
          tamaño: this.archivoAutorizacionPagoConsultor?.tamaño || this.archivoInicial.tamaño,
        },
        autorizacionPagoContratista: {
          id: this.archivoAutorizacionPagoContratista?.id || this.archivoInicial.id,
          nombre: this.archivoAutorizacionPagoContratista?.nombre || this.archivoInicial.nombre,
          tamaño: this.archivoAutorizacionPagoContratista?.tamaño || this.archivoInicial.tamaño,
        },
        declaracionSimple: {
          id: this.archivoDeclaracionSimple?.id || this.archivoInicial.id,
          nombre: this.archivoDeclaracionSimple?.nombre || this.archivoInicial.nombre,
          tamaño: this.archivoDeclaracionSimple?.tamaño || this.archivoInicial.tamaño,
        },
        cartaCompromiso: {
          id: this.archivoCartaCompromiso?.id || this.archivoInicial.id,
          nombre: this.archivoCartaCompromiso?.nombre || this.archivoInicial.nombre,
          tamaño: this.archivoCartaCompromiso?.tamaño || this.archivoInicial.tamaño,
        },
      };
    }
  /**
    * Maneja el archivo cargado desde DocumentacionOficialComponent
    */
  manejarArchivoCargado(archivo: Archivo, index: number) {
    this.archivos[index] = archivo;
  }
  // ---------------------------------------------
  //  CÁLCULOS de B, C, D, E basados en A
  // ---------------------------------------------
   calcularUtilidad(): void {
    const a = parseCLP(this.totalDirecto);
    const b = a * 0.10;
    this.utilidad = this.formatearCLP(b.toString()); // Usar formateo aquí
  }

   calcularGeneralesImprevistos(): void {
    const a = parseCLP(this.totalDirecto);
    const c = a * 0.05;
    this.generalesImprevistos = this.formatearCLP(c.toString());
  }

 calcularIVA(): void {
    const a = parseCLP(this.totalDirecto);
    const b = parseCLP(this.utilidad);
    const c = parseCLP(this.generalesImprevistos);
    const base = a + b + c;
    const d = base * 0.19;
    this.iva = this.formatearCLP(d.toString());
  }

  calcularCostoTotalEjecucion(): void {
    const a = parseCLP(this.totalDirecto);
    const b = parseCLP(this.utilidad);
    const c = parseCLP(this.generalesImprevistos);
    const d = parseCLP(this.iva);
    const e = a + b + c + d;
    this.costoTotalEjecucion = this.formatearCLP(e.toString());
  }

  /**
    * Cálculo del costo total del proyecto.
    * Puede ser E + F + G ó E + H + I, dependiendo
    * de la tributación y de la lógica que manejes.
    */
  calcularCostoTotalProyecto(): void {
    const e = parseCLP(this.costoTotalEjecucion);
    let total = e;
    
    if (this.mostrarFG) {
      total += parseCLP(this.apoyoFormulacion);
      total += parseCLP(this.apoyoEjecucion);
    }
    
    if (this.mostrarHI) {
      total += parseCLP(this.apoyoFormulacionIVA);
      total += parseCLP(this.apoyoEjecucionIVA);
    }
    
    this.costoTotalProyecto = this.formatearCLP(total.toString());
  }
  // ---------------------------------------------
  //  EVENTO para cuando cambia A
  // ---------------------------------------------
  onChangeTotalDirecto(): void {
    // Actualiza B, C, D, E
    this.calcularUtilidad();
    this.calcularGeneralesImprevistos();
    this.calcularIVA();
    this.calcularCostoTotalEjecucion();
    this.calcularCostoTotalProyecto();
    // Verifica si se excede E
    this.validarExcesoEjecucion();
  }
  /**
    * Valida si E excede el tope para persona natural (12MM)
    * o jurídica (20MM). Si lo excede, setea el mensaje de alerta
    * y “oculta” F, G, H, I (poniéndolos en 0 si quieres).
    */
  validarExcesoEjecucion(): void {
    this.mensajeAlerta = '';
    const e = parseCLP(this.costoTotalEjecucion);
    if (
      (this.tipoPersona === 'natural' && e > this.maxEjecucionPersonaNatural) ||
      (this.tipoPersona === 'juridica' && e > this.maxEjecucionPersonaJuridica)
    ) {
      this.mensajeAlerta = 'El costo total de ejecución (E) excede el tope. ' +
                            'Se requieren autorizaciones especiales.';
      this.apoyoFormulacion = '0';
      this.apoyoEjecucion = '0';
      this.apoyoFormulacionIVA = '0';
      this.apoyoEjecucionIVA = '0';
    }
  }
  // ---------------------------------------------
  //  INCENTIVOS ( % <-> Monto )
  // ---------------------------------------------
  calcularMontoPorcentaje(porcentaje: number, costo: number): number {
    return (porcentaje / 100) * costo;
  }
  calcularPorcentajeMonto(monto: number, costo: number): number {
    if (costo === 0) return 0;
    return (monto / costo) * 100;
  }
  /**
    * Llamada cuando el usuario edita el % => se recalcula el monto
    */
   actualizarMonto(porcentaje: string, tipo: string) {
    // Eliminar formato para el cálculo
    const porcentajeNumerico = parseFloat(porcentaje.replace(/\./g, ''));
    const costo = parseCLP(this.costoTotalProyecto);
    const monto = this.calcularMontoPorcentaje(porcentajeNumerico, costo);
    
    // Formatear el resultado
    const montoFormateado = this.formatearCLP(monto.toString());
    
    switch (tipo) {
      case 'inversion':
        this.incentivoInversion = montoFormateado;
        break;
      case 'formulacion':
        this.incentivoFormulacion = montoFormateado;
        break;
      case 'ejecucion':
        this.incentivoEjecucion = montoFormateado;
        break;
      case 'apoyo':
        this.incentivoApoyo = montoFormateado;
        break;
    }
    this.calcularIncentivoTotal();
  }
  /**
    * Llamada cuando el usuario edita el Monto => se recalcula el %
    */
    actualizarPorcentaje(monto: string, tipo: string) {
    // Eliminar formato para el cálculo
    const montoNumerico = parseCLP(monto);
    const costo = parseCLP(this.costoTotalProyecto);
    const pct = this.calcularPorcentajeMonto(montoNumerico, costo);
    
    switch (tipo) {
      case 'inversion':
        this.porcentajeIncentivoInversion = pct.toString();
        break;
      case 'formulacion':
        this.porcentajeIncentivoFormulacion = pct.toString();
        break;
      case 'ejecucion':
        this.porcentajeIncentivoEjecucion = pct.toString();
        break;
      case 'apoyo':
        this.porcentajeIncentivoApoyo = pct.toString();
        break;
    }
    this.calcularIncentivoTotal();
  }
  /**
    * Calcula la suma de todos los incentivos (Inversión + Formulación + Ejecución + Apoyo).
    * Luego valida si supera el 95% del costo total.
    */
calcularIncentivoTotal() {
    // Calcular la suma de todos los incentivos
    const inv = parseCLP(this.incentivoInversion);
    const form = parseCLP(this.incentivoFormulacion);
    const ejec = parseCLP(this.incentivoEjecucion);
    const ap = parseCLP(this.incentivoApoyo);
    const totalIncentivos = inv + form + ejec + ap;

    // Formatear el incentivo total
    this.incentivoTotal = this.formatearCLP(totalIncentivos.toString());

    // Calcular el total general (incentivos + aporte propio)
    const aportePropio = parseCLP(this.aportePropio);
    const totalGeneral = totalIncentivos + aportePropio;

    // Formatear el total general
    this.totalIncentivos = this.formatearCLP(totalGeneral.toString());

    // Validar si se excede el tope de incentivos
    const costo = parseCLP(this.costoTotalProyecto);
    if (totalIncentivos > (costo * this.porcentajeMaximoIncentivo / 100)) {
        this.mensajeAlerta = 'El incentivo solicitado supera el 95% del costo total. ' +
                            'Se requiere autorización del Director Regional.';
    } else {
        if (!this.excedioTopeEjecucion()) {
            this.mensajeAlerta = '';
        }
    }
}
  private excedioTopeEjecucion(): boolean {
    const e = parseCLP(this.costoTotalEjecucion);
    if (this.tipoPersona === 'natural' && e > this.maxEjecucionPersonaNatural) return true;
    if (this.tipoPersona === 'juridica' && e > this.maxEjecucionPersonaJuridica) return true;
    return false;
  }
  // ---------------------------------------------
  //  VISIBILIDAD DE CAMPOS F, G, H, I
  // ---------------------------------------------
  get mostrarFG(): boolean {
    // - No mostrar F, G si el consultor tributa con IVA (SERVICIO_AFECTO_IVA) o si es INDAP o si E excedió tope
    if (this.tipoTributacion === 'SERVICIO_AFECTO_IVA') return false;
    if (this.tipoTributacion === 'INDAP') return false;
    if (this.excedioTopeEjecucion()) return false;
    return true;
  }
  get mostrarHI(): boolean {
    // No mostrar H, I si el consultor tributa con boleta honorarios o sociedad profesionales, o si es INDAP o si E excedió tope
    if (this.tipoTributacion === 'BOLETA_HONORARIOS' || this.tipoTributacion === 'SOCIEDAD_PROFESIONALES') return false;
    if (this.tipoTributacion === 'INDAP') return false;
    if (this.excedioTopeEjecucion()) return false;
    return true;
  }

    triggerFileInput(idInput: string): void {
      const fileInput = document.getElementById(idInput) as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      } else {
        console.error(`No se encontró el input de archivo con ID: ${idInput}`);
      }
    }
  private formatearCLP(value: string): string {
      const cleanValue = value.replace(/\./g, '');
      return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

  cartaCompromiso(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];

        const archivoExistente = this.listadoArchivosPresupuesto.find(item => item.nombre === file.name);
        if (archivoExistente) {
          this.mensajeError = 'El archivo ya ha sido subido.';
          this.mostrarDialog = true;
          return;
        }

        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          this.mensajeError = 'El archivo es demasiado grande. El tamaño máximo permitido es 10 MB.';
          this.mostrarDialog = true;
          return;
        }

        this.proyectoService.postSubirArchivo(this.idProyectoBorrador, file).subscribe({
          next: (response) => {

            const archivo: Archivo = {
              id: response.id,
              nombre: response.nombre,
              tamaño: response.tamaño,
            };

            this.nombreArchivoCartaCompromiso = archivo.nombre;
            this.mostrarNombreArchivoCartaCompromiso = true;
            this.archivoCartaCompromiso = archivo;

            this.listadoArchivosPresupuesto = [...this.listadoArchivosPresupuesto, archivo];

            input.value = '';
          },
          error: (error) => {
            console.error('Error al subir el archivo:', error);
            this.mensajeError = 'Error al subir el archivo. ';
            this.mostrarDialog = true;
          },
        });
      }
    }

  declaracionSeleccionConsultor(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const archivoExistente = this.listadoArchivosPresupuesto.find(item => item.nombre === file.name);
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

          this.mostrarNombreArchivoDeclaracionJurada = true;
          this.nombreArchivoDeclaracionJurada = archivo.nombre;
          this.archivoDeclaracionSeleccionConsultor = archivo;

          this.listadoArchivosPresupuesto = [...this.listadoArchivosPresupuesto, archivo];

          input.value = '';
        },
        error: (error) => {
          console.error('Error al subir el archivo:', error);
          alert('No se pudo subir el archivo. Inténtelo nuevamente.');
        },
      });
    }
  }

  declaracionSimple(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const archivoExistente = this.listadoArchivosPresupuesto.find(item => item.nombre === file.name);
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

          this.nombreArchivoDeclaracionSimple = archivo.nombre;
          this.mostrarNombreArchivoDeclaracionSimple = true;
          this.archivoDeclaracionSimple = archivo;

          this.listadoArchivosPresupuesto = [...this.listadoArchivosPresupuesto, archivo];

          input.value = '';
        },
        error: (error) => {
          console.error('Error al subir el archivo:', error);
          alert('No se pudo subir el archivo. Inténtelo nuevamente.');
        },
      });
    }
  }

  seleccionContratista(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const archivoExistente = this.listadoArchivosPresupuesto.find(item => item.nombre === file.name);
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

          this.nombreArchivoDeclaracionContratista = archivo.nombre;
          this.mostrarNombreArchivoDeclaracionContratista = true;
          this.archivoSeleccionContratista = archivo;

          this.listadoArchivosPresupuesto = [...this.listadoArchivosPresupuesto, archivo];

          input.value = '';
        },
        error: (error) => {
          console.error('Error al subir el archivo:', error);
          alert('No se pudo subir el archivo. Inténtelo nuevamente.');
        },
      });
    }
  }

  autorizacionPagoConsultor(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const archivoExistente = this.listadoArchivosPresupuesto.find(item => item.nombre === file.name);
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

          this.nombreArchivoAutorizacionPagoConsultor = archivo.nombre;
          this.mostrarNombreArchivoAutorizacionPagoConsultor = true;
          this.archivoAutorizacionPagoConsultor = archivo;

          this.listadoArchivosPresupuesto = [...this.listadoArchivosPresupuesto, archivo];

          input.value = '';
        },
        error: (error) => {
          console.error('Error al subir el archivo:', error);
          alert('No se pudo subir el archivo. Inténtelo nuevamente.');
        },
      });
    }
  }

  autorizacionPagoContratista(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const archivoExistente = this.listadoArchivosPresupuesto.find(item => item.nombre === file.name);
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

          this.nombreArchivoAutorizacionPagoContratista = archivo.nombre;
          this.mostrarNombreArchivoAutorizacionPagoContratista = true;
          this.archivoAutorizacionPagoContratista = archivo;

          this.listadoArchivosPresupuesto = [...this.listadoArchivosPresupuesto, archivo];

          input.value = '';
        },
        error: (error) => {
          console.error('Error al subir el archivo:', error);
          alert('No se pudo subir el archivo. Inténtelo nuevamente.');
        },
      });
    }
  }

  asignarPresupuestoData(presupuestoData: any) {
  const presupuesto = presupuestoData.presupuesto;

  if (presupuesto) {
    this.totalDirecto = this.formatearCLP(presupuesto.aCostoTotalDirecto?.toString() || '');
      this.utilidad = this.formatearCLP(presupuesto.bUtilidad?.toString() || '');
      this.generalesImprevistos = this.formatearCLP(presupuesto.cGastosGenerales?.toString() || '');
      this.iva = this.formatearCLP(presupuesto.dIva?.toString() || '');
      this.costoTotalEjecucion = this.formatearCLP(presupuesto.eCostoTotalEjecucion?.toString() || '');
      this.apoyoFormulacion = this.formatearCLP(presupuesto.fApoyoFormulacionProyecto?.toString() || '');
      this.apoyoEjecucion = this.formatearCLP(presupuesto.gApoyoEjecucionOCapacitacion?.toString() || '');
      this.apoyoFormulacionIVA = this.formatearCLP(presupuesto.hApoyoFormulacionProyectoIva?.toString() || '');
      this.apoyoEjecucionIVA = this.formatearCLP(presupuesto.iApoyoEjecucionOCapacitacionIva?.toString() || '');
      this.costoTotalProyecto = this.formatearCLP(presupuesto.costoTotalDelProyecto?.toString() || '');
      this.incentivoInversion = this.formatearCLP(presupuesto.incentivoInversion?.toString() || '');
      this.incentivoFormulacion = this.formatearCLP(presupuesto.incentivoFormulacion?.toString() || '');
      this.incentivoEjecucion = this.formatearCLP(presupuesto.incentivoEjecucionOCapacitacion?.toString() || '');
      this.incentivoApoyo = this.formatearCLP(presupuesto.incentivoApoyoParticipacionDeLosUsuarios?.toString() || '');
      this.incentivoTotal = this.formatearCLP(presupuesto.incentivoTotal?.toString() || '');
      this.aportePropio = this.formatearCLP(presupuesto.aportePropio?.toString() || '');
      this.totalIncentivos = this.formatearCLP(presupuesto.total?.toString() || '');

    // Asignar archivos
    this.archivoDeclaracionSeleccionConsultor = presupuesto.declaracionSeleccionConsultor;
    if (this.archivoDeclaracionSeleccionConsultor) {
      this.nombreArchivoDeclaracionJurada = this.archivoDeclaracionSeleccionConsultor.nombre;
      this.mostrarNombreArchivoDeclaracionJurada = true;
    }
    this.archivoSeleccionContratista = presupuesto.seleccionContratista;
    if(this.archivoSeleccionContratista) {
      this.nombreArchivoDeclaracionContratista = this.archivoSeleccionContratista.nombre;
      this.mostrarNombreArchivoDeclaracionContratista = true;
    }
    this.archivoAutorizacionPagoConsultor = presupuesto.autorizacionPagoConsultor;
    if (this.archivoAutorizacionPagoConsultor) {
      this.nombreArchivoAutorizacionPagoConsultor = this.archivoAutorizacionPagoConsultor.nombre;
      this.mostrarNombreArchivoAutorizacionPagoConsultor = true;
    }
    this.archivoAutorizacionPagoContratista = presupuesto.autorizacionPagoContratista;
    if (this.archivoAutorizacionPagoContratista) {
      this.nombreArchivoAutorizacionPagoContratista = this.archivoAutorizacionPagoContratista.nombre;
      this.mostrarNombreArchivoAutorizacionPagoContratista = true;
    }
    this.archivoDeclaracionSimple = presupuesto.declaracionSimple;
    if (this.archivoDeclaracionSimple) {
      this.nombreArchivoDeclaracionSimple = this.archivoDeclaracionSimple.nombre;
      this.mostrarNombreArchivoDeclaracionSimple = true;
    }
    this.archivoCartaCompromiso = presupuesto.cartaCompromiso;
    if (this.archivoCartaCompromiso) {
      this.nombreArchivoCartaCompromiso = this.archivoCartaCompromiso.nombre;
      this.mostrarNombreArchivoCartaCompromiso = true;
    }

    // Actualizar listado de archivos
    this.listadoArchivosPresupuesto = [
      this.archivoDeclaracionSeleccionConsultor,
      this.archivoSeleccionContratista,
      this.archivoAutorizacionPagoConsultor,
      this.archivoAutorizacionPagoContratista,
      this.archivoDeclaracionSimple,
      this.archivoCartaCompromiso
    ].filter(archivo => archivo !== undefined) as Archivo[];
  }
}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
    this.idProyectoBorrador = params['id'];

    this.proyectoService.getProyectoId(this.idProyectoBorrador).subscribe({
      next: (resp) => {
        this.asignarPresupuestoData(resp);
      },
      error: (err) => {
        console.error('Error al obtener proyecto:', err);
      }
    });
  });
  }
}