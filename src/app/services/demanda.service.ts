import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { map, Observable, tap } from 'rxjs';
import { Demanda, GrupoInformal, GrupoInformalOPersonaJuridica, PersonaJuridica, PersonaNatural, PreguntasDemanda } from '../interfaces/demandas.interfaces';
import { Instrumentos } from '../interfaces/concursos.interfaces';

@Injectable({
  providedIn: 'root'
})
export class DemandaService {

  private apiUrl = environment.API_BASE_URL;
  public listadoInstrumentos: Instrumentos[] = [];

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return headers;
  }

  getPreguntasDemandas(rut: string): Observable<PreguntasDemanda[]> {
    return this.http.get<PreguntasDemanda[]>(`${this.apiUrl}/demanda/preguntas/${rut}`, { headers: this.getHeaders() });
  }

  getPersonaNatural(rut: string): Observable<PersonaNatural> {
    return this.http.get<PersonaNatural>(`${this.apiUrl}/agricultores/personaNatural/${rut}`, { headers: this.getHeaders() });
  }

  estaFallecido(rut: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/agricultores/estaFallecido/${rut}`, { headers: this.getHeaders() });
  }

  getPersonaJuridica(rut: string): Observable<PersonaJuridica> {
    return this.http.get<PersonaJuridica>(`${this.apiUrl}/agricultores/personaJuridica/${rut}`, { headers: this.getHeaders() });
  }

  getGrupoInformal(rut: string): Observable<GrupoInformal> {
    return this.http.get<GrupoInformal>(`${this.apiUrl}/agricultores/grupoInformal/${rut}`, { headers: this.getHeaders() });
  }

  getRepresentanteLegal(rutONombre: string): Observable<GrupoInformalOPersonaJuridica[]> {
    return this.http.get<GrupoInformalOPersonaJuridica[]>(`${this.apiUrl}/agricultores/representante/${rutONombre}`, { headers: this.getHeaders() });
  }

  getNombreAgrupacion(nombre: string): Observable<GrupoInformalOPersonaJuridica[]> {
    return this.http.get<GrupoInformalOPersonaJuridica[]>(`${this.apiUrl}/agricultores/nombreOrganizacion/${nombre}`, { headers: this.getHeaders() });
  }

  getInstrumentoDemanda(rut: string): Observable<Instrumentos[]> {
    return this.http.get<string[]>(`${this.apiUrl}/demanda/instrumentos/rut/${rut}`, { headers: this.getHeaders() }).pipe(
      map(resp => resp.map(item => ({ name: item }))),
      tap(instrumentos => {
        this.listadoInstrumentos = this.listadoInstrumentos.concat(instrumentos);
      })
    ); 
  }

  getDemandaPorId(id: string): Observable<Demanda> {
    return this.http.get<Demanda>(`${this.apiUrl}/demanda/internalid/${id}`, { headers: this.getHeaders() });
  }

  postDemandaDesdeBorrador(demanda: Demanda, idDemanda: string): Observable<Demanda> {
    return this.http.post<Demanda>(`${this.apiUrl}/demanda/internalid/${idDemanda}`, demanda, { headers: this.getHeaders() });
  }

  getDemandas(): Observable<Demanda[]> {
    return this.http.get<Demanda[]>(`${this.apiUrl}/demanda`, { headers: this.getHeaders() });
  }

  postDemanda(demanda: Demanda): Observable<Demanda> {
    return this.http.post<Demanda>(`${this.apiUrl}/demanda`, demanda, { headers: this.getHeaders() });
  }

  putDemanda(demanda: Demanda, idDemanda: string): Observable<Demanda> {
    return this.http.put<Demanda>(`${this.apiUrl}/demanda/internalid/${idDemanda}`, demanda, { headers: this.getHeaders() });
  }

  postDemandaBorrador(demanda: Demanda): Observable<Demanda> {
    return this.http.post<Demanda>(`${this.apiUrl}/demanda/borrador`, demanda, { headers: this.getHeaders() });
  }

  deleteDemanda(id: string): Observable<Demanda> {
    return this.http.delete<Demanda>(`${this.apiUrl}/demanda/internalid/${id}`, { headers: this.getHeaders() });
  }
  
  getDemandasVigentes(rut: string): Observable<Demanda[]> {
    return this.http.get<Demanda[]>(`${this.apiUrl}/demanda/rut/${rut}`, { headers: this.getHeaders() });
  }
  
  getDocumentoDeclaracionJurada(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/demanda/declaracionJurada/internalid/${id}`, { headers: this.getHeaders(), responseType: 'blob' });
  }

  getDocumentoCartaCompromiso(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/demanda/cartaCompromiso/internalid/${id}`, { headers: this.getHeaders(), responseType: 'blob' });
  }

  getDocumentoListadoConsultores(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/demanda/listadoConsultores/internalid/${id}`, { headers: this.getHeaders(), responseType: 'blob' });
  }

  getDocumentoComprobanteDemanda(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/demanda/comprobante/internalid/${id}`, { headers: this.getHeaders(), responseType: 'blob' });
  }

}