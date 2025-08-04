import { Component, HostListener } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ACCIONES_NOTIFICACIONES, AMBITO_USUARIO } from '../../constants/constantes';
import { environment } from '../../../environments/environment';
import { NotificacionesService } from '../../services/notificaciones.service';
import { Notificaciones } from '../../interfaces/notificaciones.interfaces';
import { Usuario } from '../../interfaces/usuario.interfaces';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [DividerModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  tokenContent!: Usuario;
  isDropdownOpen: boolean = false;
  nombreUsuario: string = '';
  ambitoUsuario: string = '';
  imgUsuario: string = '';
  notificaciones: Notificaciones[] = [];
  unreadNotificationsCount: number = 0;
  notificationsVisible = false;
  token!: string;

  constructor(private authService: AuthService, private notificacionService: NotificacionesService) {

  }

  toggleNotifications(event: Event) {
    this.notificationsVisible = !this.notificationsVisible;
    event.stopPropagation();
  }

  toggleDropdown(event: Event) {
    this.isDropdownOpen = !this.isDropdownOpen;
    event.stopPropagation(); 
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const clickedElement = event.target as HTMLElement;
    const avatarElement = document.querySelector('.nav-item') as HTMLElement;

    if (avatarElement && !avatarElement.contains(clickedElement)) {
      this.isDropdownOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  closeNotificationsDropdown(event: Event) {
    const clickedElement = event.target as HTMLElement;
    const notificationsElement = document.querySelector('.notifications-dropdown') as HTMLElement;
  
    if (notificationsElement && !notificationsElement.contains(clickedElement)) {
      this.notificationsVisible = false;
    }
  }  

  abrirNotificacion(id: string | undefined, accion: string, leida: boolean, idConcurso: string) {
    if (!id) {
      console.error('ID de la notificación es inválido.');
      return;
    }

    if (!leida) {
      this.notificacionService.leerNotificacion(id).subscribe(() => {});
    }

    if (accion === ACCIONES_NOTIFICACIONES.solicitaAprobacion && leida) {
      window.location.href = '/formulario-llamados/revision/' + idConcurso;
    }

    if (accion === ACCIONES_NOTIFICACIONES.concursoRechazado && leida) {
      window.location.href = '/formulario-llamados/' + idConcurso
    }

    if (accion === ACCIONES_NOTIFICACIONES.concursoAprobado && leida) {
      window.location.href = '/formulario-llamados/' + idConcurso
    }
  }

  ngOnInit() {
    this.notificacionService.getNotificaciones().subscribe((notificaciones: Notificaciones[]) => {
      this.notificaciones = notificaciones;
      this.unreadNotificationsCount = this.notificaciones.filter(notificacion => !notificacion.leida).length;
    });
    this.token = this.authService.getToken();
    this.authService.getUsuario(this.token).subscribe(
      (data: Usuario) => {
        this.tokenContent = data;
        this.nombreUsuario = this.tokenContent.data.nombre_completo;
        this.ambitoUsuario = AMBITO_USUARIO[this.tokenContent.data.ambitoActivo] || 'No Data';
        this.imgUsuario = environment.INDAP_BASE_URL + this.tokenContent.data.avatar;
      },
      (error) => {
        console.error('Error al obtener el usuario:', error);
      }
    );
  }

  
}
