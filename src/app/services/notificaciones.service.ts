import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Notificaciones } from '../interfaces/notificaciones.interfaces';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private apiUrl = environment.API_BASE_URL;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return headers;
  }

  getNotificaciones(): Observable<Notificaciones[]> {
    return this.http.get<Notificaciones[]>(`${this.apiUrl}/notificaciones`, { headers: this.getHeaders() });
  }

  leerNotificacion(id: string): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/notificaciones/limpiar/${id}`, {id}, { headers: this.getHeaders() });
  }
}
