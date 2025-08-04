import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../Components/header/header.component';
import { TitleComponent } from '../../../Components/title/title.component';
import { BreadcrumbComponent } from '../../../Components/breadcrumb/breadcrumb.component';
import { BreadMenuItem } from '../../../interfaces/concursos.interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonsComponent } from '../../../Components/buttons/buttons.component';
import { Demanda } from '../../../interfaces/demandas.interfaces';
import { CommonModule } from '@angular/common';
import { DemandaService } from '../../../services/demanda.service';
import { formatRut } from '../../../utils/formatters';

@Component({
  selector: 'app-demandas-confirmacion',
  standalone: true,
  imports: [HeaderComponent, TitleComponent, BreadcrumbComponent, ButtonsComponent, CommonModule],
  templateUrl: './demandas-confirmacion.component.html',
  styleUrl: './demandas-confirmacion.component.scss'
})
export class DemandasConfirmacionComponent implements OnInit {
  breadcrumb: BreadMenuItem[] = [];
  subtitle: string = '';
  redireccion: string = '';
  nombreUsuario: string = '';
  rutUsuario: string = '';
  estadoDemanda: string = '';
  idDemanda: string = '';
  demandaInternalId: string = '';

  constructor(private router: Router, private demandaService: DemandaService, private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { demandaCreada: Demanda, estadoDemanda: string, idDemanda: string, id: string }; 
    
    this.demandaInternalId = this.route.snapshot.queryParams['id'];
    this.estadoDemanda = state?.estadoDemanda;
    this.idDemanda = state?.idDemanda;
    this.nombreUsuario = state?.demandaCreada.usuario; 
    this.rutUsuario = formatRut(state?.demandaCreada.rut);
  }

  descargarDocumentoDeclaracionJurada(): void {
    if (this.demandaInternalId) {
      this.demandaService.getDocumentoDeclaracionJurada(this.demandaInternalId).subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'declaracion_jurada.pdf';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error al descargar el archivo:', err);
        },
      });
    }
  }

  descargarDocumentoCartaCompromiso(): void {
    if (this.demandaInternalId) {
      this.demandaService.getDocumentoCartaCompromiso(this.demandaInternalId).subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'carta_compromiso.pdf';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error al descargar el archivo:', err);
        },
      });
    }
 }

  descargarDocumentoListadoConsultores(): void {
    if (this.demandaInternalId) {
      this.demandaService.getDocumentoListadoConsultores(this.demandaInternalId).subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'listado_consultores.pdf';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error al descargar el archivo:', err);
        },
      });
    }
 }

  descargarDocumentoComprobanteDemanda(): void {
    if (this.demandaInternalId) {
      this.demandaService.getDocumentoComprobanteDemanda(this.demandaInternalId).subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'comprobante_demanda.pdf';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error al descargar el archivo:', err);
        },
      });
    }
 }

  ngOnInit() {
    const hasReloaded = sessionStorage.getItem('hasReloaded');

    if (!hasReloaded) {
      sessionStorage.setItem('hasReloaded', 'true');
      
      window.location.reload();
    }

    this.subtitle = 'Busca el rut del usuario y luego responde las preguntas para generar la demanda de este usuario a los programas de riego.'
    this.breadcrumb = [
      { label: 'Escritorio', url: '/riego-home' },
      { label: 'Demandas', url: '/demandas-home' },
      { label: 'Crear demanda', url: '/formulario-demandas' }
    ]
  }
}

