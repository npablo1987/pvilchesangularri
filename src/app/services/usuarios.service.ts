import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Region } from '../interfaces/usuario.interfaces';
import { TipoUsuarioAgricultor } from '../interfaces/demandas.interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = environment.API_BASE_URL;

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return headers;
  }

  constructor(private http: HttpClient, private authService: AuthService) { }

  getZonasUsuarios(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.apiUrl}/zona_indap/zonas_usuario`, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  getTipoUsuarioAgricultor(): Observable<TipoUsuarioAgricultor[]> {
    return this.http.get<TipoUsuarioAgricultor[]>(`${this.apiUrl}/usuarios/tiposUsuario`, { headers: this.getHeaders() });
  }

}
