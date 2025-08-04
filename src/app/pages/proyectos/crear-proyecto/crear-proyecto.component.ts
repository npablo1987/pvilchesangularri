import { Component } from '@angular/core';
import { BreadMenuItem } from '../../../interfaces/concursos.interfaces';
import { HeaderComponent } from '../../../Components/header/header.component';
import { BreadcrumbComponent } from '../../../Components/breadcrumb/breadcrumb.component';
import { TitleComponent } from '../../../Components/title/title.component';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonsComponent } from '../../../Components/buttons/buttons.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextComponent } from '../../../Components/input-text/input-text.component';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';
import { IdentificacionAgricultoresComponent } from '../../../Components/demandas/identificacion-agricultores/identificacion-agricultores.component';
import { TableModule } from 'primeng/table';
import { ChipComponent } from '../../../Components/chip/chip.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RadioButtonComponent } from '../../../Components/radio-button/radio-button.component';
import { Borrador, BuscarDemanda, Proyecto, RadioOpciones } from '../../../interfaces/proyecto.interfaces';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProyectosService } from '../../../services/proyectos.service';
import { ConfirmacionDialogComponent } from '../../../Components/confirmacion-dialog/confirmacion-dialog.component';

@Component({
  selector: 'app-crear-proyecto',
  standalone: true,
  imports: [
    HeaderComponent,
    BreadcrumbComponent,
    TitleComponent,
    CommonModule,
    InputTextModule,
    ButtonsComponent,
    FormsModule,
    InputTextComponent,
    DropdownModule,
    InputTextareaModule,
    DividerModule,
    IdentificacionAgricultoresComponent,
    TableModule,
    ChipComponent,
    ReactiveFormsModule,
    RadioButtonModule,
    RadioButtonComponent,
    DialogModule,
    ConfirmacionDialogComponent
  ],
  templateUrl: './crear-proyecto.component.html',
  styleUrls: ['./crear-proyecto.component.scss']
})
export class CrearProyectoComponent {
  subtitle: string = 'Ingresa el rut del usuario y el número de la demanda para poder iniciar la formulación del proyecto de riego.'
  textAreaPlaceholder = 'Un proyecto de riego busca optimizar el suministro de agua a cultivos mediante la instalación de sistemas de riego como goteo, aspersión o surcos. Se enfoca en maximizar la eficiencia del uso del agua, mejorar la productividad agrícola y reducir el desperdicio.'
  identificador: string = '';
  breadcrumb: BreadMenuItem[] = [];
  tipoUsuarioOpciones: RadioOpciones[] = [
    { id: '1', name: 'Persona natural', respuesta: false },
    { id: '2', name: 'Persona jurídica', respuesta: false },
    { id: '3', name: 'Grupo Informal (sin RUT)', respuesta: false }
  ];
  displayDialog: boolean = false;
  descripcionProyecto: string = '';
  nombreProyecto: string = '';
  estadoDemanda: string = 'ADMISIBLE';
  activaBuscarPor: boolean = false;
  selectedTipoUsuario: string = '';
  selectedBuscarPor: string = ''; 

  rutUsuario: string = ''; 
  numeroDemanda: string = '';

  nombreUsuarioDemanda: string = '';
  rutUsuarioDemanda: string = '';
  respuestaNumeroDemanda: string = '';
  instrumentoDemanda: string = '';
  idDemanda: string = '';
  demandaBuscadaNatural: BuscarDemanda[] = [];
  demandaBuscada: BuscarDemanda[] = [];
  proyectoBorrador: Borrador | undefined ;
  idProyectoBorrador: string = '';
  proyecto: Proyecto | undefined;
  mostrarDialog: boolean = false;
  mostrarConfirmacion: boolean = false;
  esExito: boolean = false;
  mensajeExito: string = '';
  mensajeError: string = '';
  


  constructor(
    private proyectoService: ProyectosService, 
    private router: Router, 
    private usuarioService: UsuariosService, 
    private route: ActivatedRoute,
  ) {}

  onConfirmar() {
    this.mostrarDialog = false;
  }

  onCerrar() {
    this.mostrarDialog = false;
  }

  onTipoUsuarioChange() {
    if (this.selectedTipoUsuario === '2') {
      this.activaBuscarPor = true;
    } else {
      this.activaBuscarPor = false;
    }
  }

  get chipColor(): 'success' | 'error' {
    return 'success';
  }

 guardarProyecto() {
  
  this.proyectoBorrador = {
    descripcion: this.descripcionProyecto,
    nombre: this.nombreProyecto,
    demanda: {
      internalid: this.idDemanda
    }
  }

  this.proyectoService.postProyectosBorrador(this.proyectoBorrador).subscribe({
    next: response => {
      this.proyecto = response;
      this.idProyectoBorrador = this.proyecto.internalid!;

      this.router.navigate([`/formulario-proyectos/${this.idProyectoBorrador}`]).then(() => {
      window.location.reload();
    });
    },
    error: error => {
      console.error('Error al guardar el proyecto borrador:', error);
    }
  });
}


  buscar() {
    if (this.selectedTipoUsuario === '1') {
      if(this.rutUsuario && this.numeroDemanda) {
        this.proyectoService.getDemandaPorPersonaNaturalRutId(this.rutUsuario, this.numeroDemanda).subscribe({
        next: response => {
          this.demandaBuscada = response;
          this.handleServicioRespuesta(response);
          this.displayDialog = true;
        },
        error: error => {
          console.error('Error en la solicitud:', error);
        }
        });
      }else {
        this.proyectoService.getDemandaPorPersonaNatural(this.rutUsuario).subscribe({
        next: response => {
          this.demandaBuscadaNatural = response;
          this.handleServicioRespuesta(this.demandaBuscadaNatural[0]);
          this.displayDialog = true;
        },
        error: error => {
           this.mostrarConfirmacion = true;
           this.esExito = false;
           this.mensajeError = 'Debe almenos ingresar un Rut';
          console.error('Error en la solicitud:', error);
        }
        });
      }
    } else if (this.selectedTipoUsuario === '2') {
      this.proyectoService.getDemandaPorPersonaJuridica(this.rutUsuario).subscribe({
      next: response => {
        this.handleServicioRespuesta(response);
        this.displayDialog = true;
      },
      error: error => {
        console.error('Error en la solicitud:', error);
      }
      });
    } else if (this.selectedTipoUsuario === '3') {
      this.proyectoService.getDemandaPorGrupoInformal(this.rutUsuario, this.numeroDemanda).subscribe({
      next: response => {
        this.handleServicioRespuesta(response);
        this.displayDialog = true;
      },
      error: error => {
        console.error('Error en la solicitud:', error);
      }
      });
    } else {
      this.mostrarConfirmacion = true;
      this.esExito = false;
      this.mensajeError = 'Debe seleccionar un tipo de usuario.';
    }
  }
  
  handleServicioRespuesta(response: any) {
    this.nombreUsuarioDemanda = response.usuario
    this.rutUsuarioDemanda = response.rut;
    this.respuestaNumeroDemanda = response.id;
    this.instrumentoDemanda = response.instrumento;
    this.estadoDemanda = response.estado;
    this.displayDialog = true;
    this.idDemanda = response.internalid;
  }

  volver() {
    window.location.href = '/proyectos-home';
  }
 
  verDemanda(demandaId: string) {
    this.router.navigate(['/formulario-demandas/revision'], { 
      queryParams: { id: demandaId, esRevision: true }
    });
  }
  
  handleValueChange(selectedOption: boolean) {
  }

  ngOnInit() { 
  
    this.selectedTipoUsuario = '';
    this.activaBuscarPor = this.selectedTipoUsuario === 'personaJuridica';
    
    this.route.queryParams.subscribe(params => {
      const isEdit = params['editar'] === 'true';
      if (isEdit) {
      console.log('estas editando')
      }
    });

    this.breadcrumb = [
      { label: 'Escritorio', url: '/riego-home' },
      { label: 'Proyectos', url: '/proyectos-home' },
      { label: 'Crear proyecto', url: '/crear-proyecto' }
    ]  
  }
}
