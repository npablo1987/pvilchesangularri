import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonsComponent } from '../../buttons/buttons.component';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { InputTextComponent } from '../../input-text/input-text.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

import {
  CodigoAreaTelefono,
  ComunasProyecto,
  Contacto,
  Direccion,
  General,
  Proyecto,
  RegionesProyecto,
  SectorProyecto,
  TipoTelefono,
} from '../../../interfaces/proyecto.interfaces';
import { ProyectosService } from '../../../services/proyectos.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../interfaces/usuario.interfaces';

@Component({
  selector: 'app-general-tab',
  standalone: true,
  imports: [
    ButtonsComponent,
    CommonModule,
    DropdownModule,
    FormsModule,
    InputTextComponent,
    InputNumberModule,
    CheckboxModule,
    TableModule,
    RadioButtonModule,
    ButtonModule,
    DividerModule,
  ],
  templateUrl: './general-tab.component.html',
  styleUrl: './general-tab.component.scss',
})
export class GeneralTabComponent implements OnInit {
  @Output() generalData = new EventEmitter<General>();
  @Input() generalDataRevisar: General | null = null;

  infoUsuario: Usuario | null = null;

  nombrePostulante: string = '';
  rutPostulante: string = '';
  estadoVigencia: string = '';
  estadoAcreditacion: string = '';
  rendicionesPendientes: string = '';
  rutRepresentante: string = '';
  nombreRepresentante: string = '';
  tipoUsuarioPostulante: string = '';

  nombreConsultor: string = '';
  rutConsultor: string = '';

  nombreContratista: string = '';
  rutContratista: string = '';

  regionesProyectoPostulanteOpciones: RegionesProyecto[] = [];
  regionesProyectoFormuladorOpciones: RegionesProyecto[] = [];
  regionesProyectoContratistaOpciones: RegionesProyecto[] = [];

  selectedRegionPostulante: RegionesProyecto | null = null;
  selectedRegionFormulador: RegionesProyecto | null = null;
  selectedRegionContratista: RegionesProyecto | null = null;

  comunaProyectoPostulanteOpciones: ComunasProyecto[] = [];
  comunaProyectoFormuladorOpciones: ComunasProyecto[] = [];
  comunaProyectoContratistaOpciones: ComunasProyecto[] = [];

  selectedComunaPostulante: ComunasProyecto | null = null;
  selectedComunaFormulador: ComunasProyecto | null = null;
  selectedComunaContratista: ComunasProyecto | null = null;

  sectorProyectoPostulanteOpciones: SectorProyecto[] = [];
  sectorProyectoFormuladorOpciones: SectorProyecto[] = [];
  sectorProyectoContratistaOpciones: SectorProyecto[] = [];

  selectedSectorPostulante: SectorProyecto | null = null;
  selectedSectorFormulador: SectorProyecto | null = null;
  selectedSectorContratista: SectorProyecto | null = null;

  codigoAreaOptions: CodigoAreaTelefono[] = [];
  tipoTelefonoOpciones: TipoTelefono[] = [];

  selectedCodigoAreaPostulante: CodigoAreaTelefono | null = null;
  selectedTipoTelefonoPostulante: TipoTelefono | null = null;
  numeroContactoPostulante: string = '';
  esWhatsappPostulante: boolean = false;
  dataContactosPostulante: {
    codigoArea: number;
    numero: string;
    tipoTelefono: string;
    whatsapp: boolean;
  }[] = [];
  emailPostulante: string = '';
  direccionPostulante: string = '';
  numeroDireccionPostulante: string = '';
  direccionSinNumeroPostulante: boolean = false;

  selectedCodigoAreaFormulador: CodigoAreaTelefono | null = null;
  selectedTipoTelefonoFormulador: TipoTelefono | null = null;
  numeroContactoFormulador: string = '';
  esWhatsappFormulador: boolean = false;
  dataContactosFormulador: {
    codigoArea: number;
    numero: string;
    tipoTelefono: string;
    whatsapp: boolean;
  }[] = [];
  emailFormulador: string = '';
  direccionFormulador: string = '';
  numeroDireccionFormulador: string = '';
  direccionSinNumeroFormulador: boolean = false;

  selectedCodigoAreaContratista: CodigoAreaTelefono | null = null;
  selectedTipoTelefonoContratista: TipoTelefono | null = null;
  numeroContactoContratista: string = '';
  esWhatsappContratista: boolean = false;
  dataContactosContratista: {
    codigoArea: number;
    numero: string;
    tipoTelefono: string;
    whatsapp: boolean;
  }[] = [];
  emailContratista: string = '';
  direccionContratista: string = '';
  numeroDireccionContratista: string = '';
  direccionSinNumeroContratista: boolean = false;

  tipoTributacion: boolean = false;

  contratistaFormulador: boolean = false;

  idProyectoBorrador: string = '';

  constructor(
    private proyectoService: ProyectosService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = this.authService.getToken();
    this.authService.getUsuario(token).subscribe({
      next: (data) => {
        this.infoUsuario = data;
      },
      error: (error) => {
        console.error('Error al obtener el usuario:', error);
      },
    });

    this.route.params.subscribe((params) => {
      this.idProyectoBorrador = params['id'];

      this.proyectoService.getProyectoId(this.idProyectoBorrador).subscribe({
        next: (resp) => {
          this.asignarProyectoDataGeneral(resp);
        },
        error: (err) => {
          console.error('Error al obtener proyecto:', err);
        },
      });
    });

    this.proyectoService.getRegionesProyecto().subscribe({
      next: (response) => {
        this.regionesProyectoPostulanteOpciones = response;
        this.regionesProyectoFormuladorOpciones = response;
        this.regionesProyectoContratistaOpciones = response;
      },
      error: (error) => {
        console.error('Error al obtener las regiones:', error);
      },
    });

    this.proyectoService.getCodigoAreaTelefono().subscribe({
      next: (response) => {
        this.codigoAreaOptions = response;
      },
      error: (error) => {
        console.error('Error al obtener los códigos de área:', error);
      },
    });

    this.proyectoService.getTipoTelefono().subscribe({
      next: (response) => {
        this.tipoTelefonoOpciones = response;
      },
      error: (error) => {
        console.error('Error al obtener los tipos de teléfono:', error);
      },
    });
  }

  asignarProyectoDataGeneral(proyectoData: Proyecto) {
    const generalData = proyectoData.general;

    this.nombrePostulante =
      generalData.antecedentesPostulante?.nombre || 'No encontrado';
    this.rutPostulante =
      generalData.antecedentesPostulante?.rut || 'No encontrado';
    this.estadoVigencia =
      generalData.antecedentesPostulante?.situacionCrediticia ||
      'No encontrado';
    this.estadoAcreditacion =
      generalData.antecedentesPostulante?.estadoAcreditacion || 'No encontrado';
    this.rendicionesPendientes =
      generalData.antecedentesPostulante?.rendicionesPendientes ||
      'No encontrado';
    this.rutRepresentante =
      generalData.antecedentesPostulante?.rutRepresentante || 'No encontrado';
    this.nombreRepresentante =
      generalData.antecedentesPostulante?.nombreRepresentante ||
      'No encontrado';
    this.emailPostulante = generalData.antecedentesPostulante?.email || '';

    const direccionPostulante = generalData.antecedentesPostulante?.direccion;
    if (direccionPostulante) {
      this.direccionPostulante = direccionPostulante.direccion || '';
      this.numeroDireccionPostulante = direccionPostulante.numero || '';
      this.direccionSinNumeroPostulante =
        direccionPostulante.esSinNumero || false;

      this.selectedRegionPostulante =
        this.regionesProyectoPostulanteOpciones.find(
          (region) => region.id_region === direccionPostulante.regionId
        ) || null;

      if (this.selectedRegionPostulante) {
        this.proyectoService
          .getComunasProyecto(this.selectedRegionPostulante.id_region)
          .subscribe({
            next: (comunas) => {
              this.comunaProyectoPostulanteOpciones = comunas;
              this.selectedComunaPostulante =
                comunas.find(
                  (comuna) => comuna.id_comuna === direccionPostulante.comunaId
                ) || null;

              if (this.selectedComunaPostulante) {
                this.proyectoService
                  .getSectorProyecto(this.selectedComunaPostulante.id_comuna)
                  .subscribe({
                    next: (sectores) => {
                      this.sectorProyectoPostulanteOpciones = sectores;
                      this.selectedSectorPostulante =
                        sectores.find(
                          (sector) =>
                            sector.id_area === direccionPostulante.sectorId
                        ) || null;
                    },
                    error: (error) => {
                      console.error('Error al obtener sectores:', error);
                    },
                  });
              }
            },
            error: (error) => {
              console.error('Error al obtener comunas:', error);
            },
          });
      }
    }

    if (generalData.antecedentesPostulante?.datosDeContacto) {
      this.dataContactosPostulante =
        generalData.antecedentesPostulante.datosDeContacto.map((contacto) => ({
          codigoArea: +contacto.codigoDeArea,
          numero: contacto.numero,
          tipoTelefono: contacto.tipoTelefono,
          whatsapp: contacto.conWhatsapp,
        }));
    }

    if (generalData.contratistaMismoQueFormulador) {
      this.contratistaFormulador = generalData.contratistaMismoQueFormulador;
    }

    this.nombreConsultor =
      generalData.antecedentesFormulador?.nombre ||
      this.infoUsuario?.data.nombre_completo ||
      'No encontrado';
    this.rutConsultor =
      generalData.antecedentesFormulador?.rut ||
      this.infoUsuario?.data.rut ||
      '';
    this.emailFormulador = generalData.antecedentesFormulador?.email || '';

    const direccionFormulador = generalData.antecedentesFormulador?.direccion;
    if (direccionFormulador) {
      this.direccionFormulador = direccionFormulador.direccion || '';
      this.numeroDireccionFormulador = direccionFormulador.numero || '';
      this.direccionSinNumeroFormulador =
        direccionFormulador.esSinNumero || false;

      this.selectedRegionFormulador =
        this.regionesProyectoFormuladorOpciones.find(
          (region) => region.id_region === direccionFormulador.regionId
        ) || null;

      if (this.selectedRegionFormulador) {
        this.proyectoService
          .getComunasProyecto(this.selectedRegionFormulador.id_region)
          .subscribe({
            next: (comunas) => {
              this.comunaProyectoFormuladorOpciones = comunas;
              this.selectedComunaFormulador =
                comunas.find(
                  (comuna) => comuna.id_comuna === direccionFormulador.comunaId
                ) || null;

              if (this.selectedComunaFormulador) {
                this.proyectoService
                  .getSectorProyecto(this.selectedComunaFormulador.id_comuna)
                  .subscribe({
                    next: (sectores) => {
                      this.sectorProyectoFormuladorOpciones = sectores;
                      this.selectedSectorFormulador =
                        sectores.find(
                          (sector) =>
                            sector.id_area === direccionFormulador.sectorId
                        ) || null;
                    },
                    error: (error) => {
                      console.error(
                        'Error al obtener sectores del formulador:',
                        error
                      );
                    },
                  });
              }
            },
            error: (error) => {
              console.error('Error al obtener comunas del formulador:', error);
            },
          });
      }
    }

    if (generalData.antecedentesFormulador?.datosDeContacto) {
      this.dataContactosFormulador =
        generalData.antecedentesFormulador.datosDeContacto.map((contacto) => ({
          codigoArea: +contacto.codigoDeArea,
          numero: contacto.numero,
          tipoTelefono: contacto.tipoTelefono,
          whatsapp: contacto.conWhatsapp,
        }));
    }

    this.nombreContratista = generalData.antecedentesContratista?.nombre || '';
    this.rutContratista = generalData.antecedentesContratista?.rut || '';
    this.emailContratista = generalData.antecedentesContratista?.email || '';

    const direccionContratista = generalData.antecedentesContratista?.direccion;
    if (direccionContratista) {
      this.direccionContratista = direccionContratista.direccion || '';
      this.numeroDireccionContratista = direccionContratista.numero || '';
      this.direccionSinNumeroContratista =
        direccionContratista.esSinNumero || false;
      this.selectedRegionContratista =
        this.regionesProyectoContratistaOpciones.find(
          (region) => region.id_region === direccionContratista.regionId
        ) || null;

      if (this.selectedRegionContratista) {
        this.proyectoService
          .getComunasProyecto(this.selectedRegionContratista.id_region)
          .subscribe({
            next: (comunas) => {
              this.comunaProyectoContratistaOpciones = comunas;
              this.selectedComunaContratista =
                comunas.find(
                  (comuna) => comuna.id_comuna === direccionContratista.comunaId
                ) || null;

              if (this.selectedComunaContratista) {
                this.proyectoService
                  .getSectorProyecto(this.selectedComunaContratista.id_comuna)
                  .subscribe({
                    next: (sectores) => {
                      this.sectorProyectoContratistaOpciones = sectores;
                      this.selectedSectorContratista =
                        sectores.find(
                          (sector) =>
                            sector.id_area === direccionContratista.sectorId
                        ) || null;
                    },
                    error: (error) => {
                      console.error(
                        'Error al obtener sectores del contratista:',
                        error
                      );
                    },
                  });
              }
            },
            error: (error) => {
              console.error('Error al obtener comunas del contratista:', error);
            },
          });
      }
    }

    if (generalData.antecedentesContratista?.datosDeContacto) {
      this.dataContactosContratista =
        generalData.antecedentesContratista.datosDeContacto.map((contacto) => ({
          codigoArea: +contacto.codigoDeArea,
          numero: contacto.numero,
          tipoTelefono: contacto.tipoTelefono,
          whatsapp: contacto.conWhatsapp,
        }));
    }
  }

  agregarContactoPostulante() {
    const codigoArea = this.selectedCodigoAreaPostulante?.codigo
    const numero = this.numeroContactoPostulante
    const tipoTelefono = this.selectedTipoTelefonoPostulante?.tipoTelefono 
    const whatsapp = this.esWhatsappPostulante

    //Validaciones para tabla Contratista
    if (!codigoArea || !numero || !tipoTelefono) {
      console.warn('Debe completar todos los campos del contacto.');
      alert('Debe completar todos los campos del contacto antes de agregarlo.');
      return;
    }

    const exists = this.dataContactosPostulante.some(
      (c) => c.codigoArea === codigoArea && c.numero === c.numero
    );

    if (exists) {
      alert('Este contacto ya fue agregado');
      return;
    }

    const nuevoContacto = {
      codigoArea: codigoArea || 0,
      numero: numero,
      tipoTelefono: tipoTelefono || '',
      whatsapp: whatsapp,
    };
    this.dataContactosPostulante.push(nuevoContacto);
  }

  eliminarContactoPostulante(index: number) {
    this.dataContactosPostulante.splice(index, 1);
  }

  agregarContactoFormulador() {
    const codigoArea = this.selectedCodigoAreaFormulador?.codigo
    const numero = this.numeroContactoFormulador
    const tipoTelefono = this.selectedTipoTelefonoFormulador?.tipoTelefono 
    const whatsapp = this.esWhatsappFormulador

    //Validaciones para tabla Contratista
    if (!codigoArea || !numero || !tipoTelefono) {
      console.warn('Debe completar todos los campos del contacto.');
      alert('Debe completar todos los campos del contacto antes de agregarlo.');
      return;
    }

    const exists = this.dataContactosFormulador.some(
      (c) => c.codigoArea === codigoArea && c.numero === c.numero
    );

    if (exists) {
      alert('Este contacto ya fue agregado');
      return;
    }

    const nuevoContacto = {
      codigoArea: codigoArea || 0,
      numero: numero,
      tipoTelefono: tipoTelefono || '',
      whatsapp: whatsapp,
    };
    this.dataContactosFormulador.push(nuevoContacto);
  }

  eliminarContactoFormulador(index: number) {
    this.dataContactosFormulador.splice(index, 1);
  }

  agregarContactoContratista() {
    const codigoArea = this.selectedCodigoAreaContratista?.codigo;
    const numero = this.numeroContactoContratista;
    const tipoTelefono = this.selectedTipoTelefonoContratista?.tipoTelefono;
    const whatsapp = this.esWhatsappContratista;

    //Validaciones para tabla Contratista
    if (!codigoArea || !numero || !tipoTelefono) {
      console.warn('Debe completar todos los campos del contacto.');
      alert('Debe completar todos los campos del contacto antes de agregarlo.');
      return;
    }

    const exists = this.dataContactosContratista.some(
      (c) => c.codigoArea === codigoArea && c.numero === c.numero
    );

    if (exists) {
      alert('Este contacto ya fue agregado');
      return;
    }

    const nuevoContacto = {
      codigoArea,
      numero,
      tipoTelefono,
      whatsapp,
    };

    this.dataContactosContratista.push(nuevoContacto);
  }

  eliminarContactoContratista(index: number) {
    this.dataContactosContratista.splice(index, 1);
  } 

  onRegionChangePostulante() {
    if (this.selectedRegionPostulante) {
      this.proyectoService
        .getComunasProyecto(this.selectedRegionPostulante.id_region)
        .subscribe({
          next: (response) => {
            this.comunaProyectoPostulanteOpciones = response;
            this.selectedComunaPostulante = null;
            this.sectorProyectoPostulanteOpciones = [];
            this.selectedSectorPostulante = null;
          },
          error: (error) => {
            console.error('Error al obtener comunas del postulante:', error);
          },
        });
    }
  }

  onRegionChangeFormulador() {
    if (this.selectedRegionFormulador) {
      this.proyectoService
        .getComunasProyecto(this.selectedRegionFormulador.id_region)
        .subscribe({
          next: (response) => {
            this.comunaProyectoFormuladorOpciones = response;
            this.selectedComunaFormulador = null;
            this.sectorProyectoFormuladorOpciones = [];
            this.selectedSectorFormulador = null;
          },
          error: (error) => {
            console.error('Error al obtener comunas del formulador:', error);
          },
        });
    }
  }

  onRegionChangeContratista() {
    if (this.selectedRegionContratista) {
      this.proyectoService
        .getComunasProyecto(this.selectedRegionContratista.id_region)
        .subscribe({
          next: (response) => {
            this.comunaProyectoContratistaOpciones = response;
            this.selectedComunaContratista = null;
            this.sectorProyectoContratistaOpciones = [];
            this.selectedSectorContratista = null;
          },
          error: (error) => {
            console.error('Error al obtener comunas del contratista:', error);
          },
        });
    }
  }

  onComunaChange(tipo: 'postulante' | 'formulador' | 'contratista') {
    if (this.selectedComunaPostulante && tipo === 'postulante') {
      this.proyectoService
        .getSectorProyecto(this.selectedComunaPostulante.id_comuna)
        .subscribe({
          next: (response) => {
            this.sectorProyectoPostulanteOpciones = response;
            this.selectedSectorPostulante = null;
          },
          error: (error) => {
            console.error('Error al obtener sectores del postulante:', error);
          },
        });
    }

    if (this.selectedComunaFormulador && tipo === 'formulador') {
      this.proyectoService
        .getSectorProyecto(this.selectedComunaFormulador.id_comuna)
        .subscribe({
          next: (response) => {
            this.sectorProyectoFormuladorOpciones = response;
            this.selectedSectorFormulador = null;
          },
          error: (error) => {
            console.error('Error al obtener sectores del formulador:', error);
          },
        });
    }

    if (this.selectedComunaContratista && tipo === 'contratista') {
      this.proyectoService
        .getSectorProyecto(this.selectedComunaContratista.id_comuna)
        .subscribe({
          next: (response) => {
            this.sectorProyectoContratistaOpciones = response;
            this.selectedSectorContratista = null;
          },
          error: (error) => {
            console.error('Error al obtener sectores del contratista:', error);
          },
        });
    }
  }

  getGeneralData(): General {
    const datosDeContactoPostulante: Contacto[] =
      this.dataContactosPostulante.map((contacto) => ({
        codigoDeArea: contacto.codigoArea.toString(),
        numero: contacto.numero,
        tipoTelefono: contacto.tipoTelefono,
        conWhatsapp: contacto.whatsapp,
      }));

    const datosDeContactoFormulador: Contacto[] =
      this.dataContactosFormulador.map((contacto) => ({
        codigoDeArea: contacto.codigoArea.toString(),
        numero: contacto.numero,
        tipoTelefono: contacto.tipoTelefono,
        conWhatsapp: contacto.whatsapp,
      }));

    const datosDeContactoContratista: Contacto[] =
      this.dataContactosContratista.map((contacto) => ({
        codigoDeArea: contacto.codigoArea.toString(),
        numero: contacto.numero,
        tipoTelefono: contacto.tipoTelefono,
        conWhatsapp: contacto.whatsapp,
      }));

    const direccionPostulante: Direccion = {
      region: this.selectedRegionPostulante?.nombre || '',
      regionId: this.selectedRegionPostulante?.id_region || 0,
      comuna: this.selectedComunaPostulante?.nombre || '',
      comunaId: this.selectedComunaPostulante?.id_comuna || 0,
      sector: this.selectedSectorPostulante?.nombre || '',
      sectorId: this.selectedSectorPostulante?.id_area || 0,
      direccion: this.direccionPostulante,
      numero: this.numeroDireccionPostulante,
      esSinNumero: this.direccionSinNumeroPostulante,
    };

    const direccionFormulador: Direccion = {
      region: this.selectedRegionFormulador?.nombre || '',
      regionId: this.selectedRegionFormulador?.id_region || 0,
      comuna: this.selectedComunaFormulador?.nombre || '',
      comunaId: this.selectedComunaFormulador?.id_comuna || 0,
      sector: this.selectedSectorFormulador?.nombre || '',
      sectorId: this.selectedSectorFormulador?.id_area || 0,
      direccion: this.direccionFormulador,
      numero: this.numeroDireccionFormulador,
      esSinNumero: this.direccionSinNumeroFormulador,
    };

    const direccionContratista: Direccion = {
      region: this.selectedRegionContratista?.nombre || '',
      regionId: this.selectedRegionContratista?.id_region || 0,
      comuna: this.selectedComunaContratista?.nombre || '',
      comunaId: this.selectedComunaContratista?.id_comuna || 0,
      sector: this.selectedSectorContratista?.nombre || '',
      sectorId: this.selectedSectorContratista?.id_area || 0,
      direccion: this.direccionContratista,
      numero: this.numeroDireccionContratista,
      esSinNumero: this.direccionSinNumeroContratista,
    };

    const contratistaEsFormulador = this.contratistaFormulador

    const antecedentesFormulador = {
      nombre: this.nombreConsultor,
      rut: this.rutConsultor,
      tipoTributacion: this.tipoTributacion
        ? 'Boleta de honorarios'
        : 'Afecto a IVA',
      datosDeContacto: datosDeContactoFormulador,
      email: this.emailFormulador,
      direccion: direccionFormulador,
    };

    const antecedentesContratista = contratistaEsFormulador
      ? {
          nombre: this.nombreConsultor,
          rut: this.rutConsultor,
          datosDeContacto: datosDeContactoContratista,
          email: this.emailFormulador,
          direccion: direccionFormulador,
        }
      : {
          nombre: this.nombreContratista,
          rut: this.rutContratista,
          datosDeContacto: datosDeContactoContratista,
          email: this.emailContratista,
          direccion: direccionContratista,
        };

    const antecedentesPostulante = {
      nombre: this.nombrePostulante,
      rut: this.rutPostulante,
      estadoAcreditacion: this.estadoAcreditacion,
      situacionCrediticia: this.estadoVigencia,
      rendicionesPendientes: this.rendicionesPendientes,
      rutRepresentante: this.rutRepresentante,
      nombreRepresentante: this.nombreRepresentante,
      datosDeContacto: datosDeContactoPostulante,
      email: this.emailPostulante,
      direccion: direccionPostulante,
      tipoUsuario: this.tipoUsuarioPostulante,
    };

    const general: General = {
      antecedentesFormulador,
      antecedentesContratista,
      antecedentesPostulante,
      contratistaMismoQueFormulador: contratistaEsFormulador,
    };

    return general;
  }

  guardarEmail() {
    alert('Email guardado');
  }

  verIntegrantes() {}

  onCheckboxWhatsappChange() {}

  onCheckboxNoNumberChange(tipo: 'postulante' | 'formulador' | 'contratista') {
    switch (tipo) {
      case 'postulante':
        if (this.direccionSinNumeroPostulante) {
          this.numeroDireccionPostulante = '';
        }
        break;
      case 'formulador':
        if (this.direccionSinNumeroFormulador) {
          this.numeroDireccionFormulador = '';
        }
        break;
      case 'contratista':
        if (this.direccionSinNumeroContratista) {
          this.numeroDireccionContratista = '';
        }
        break;
    }
  }

  onContratistaFormuladorChange(value: boolean): void {
    this.contratistaFormulador = value

    const contactoFormulador = {
      codigoArea: this.selectedCodigoAreaFormulador?.codigo || 0,
      numero: this.numeroContactoFormulador,
      tipoTelefono: this.selectedTipoTelefonoFormulador?.tipoTelefono || '',
      whatsapp: this.esWhatsappFormulador,
    }

    if (value) {
      this.dataContactosContratista.push(contactoFormulador)
    } else {
      this.dataContactosContratista = this.dataContactosContratista.filter(
        (c) =>
          !(
            c.codigoArea === contactoFormulador.codigoArea &&
            c.numero === contactoFormulador.numero
          )
      );
    }
  }

}
