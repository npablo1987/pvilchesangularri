import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Concurso, CriterioGet, FondosConcurso, Instrumentos, TipoConcurso } from '../interfaces/concursos.interfaces';
import { Observable, tap, map, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ConcursoService {

  public listConcurso: Concurso[] = [];
  public listadoInstrumentos: Instrumentos[] = [];
  public listadoTipos: TipoConcurso[] = [];
  public listadoFondos: FondosConcurso[] = [];

  private apiUrl = environment.API_BASE_URL;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return headers;
  }


  getConcurso(): Observable<Concurso[]> {
    return this.http.get<Concurso[]>(`${this.apiUrl}/concursos/`, { headers: this.getHeaders() }).pipe(
      tap(resp => {
        this.listConcurso = this.listConcurso.concat(resp);
      })
    );
  }

  getFondoConcurso(): Observable<FondosConcurso[]> {
    return this.http.get<string[]>(`${this.apiUrl}/concursos/origenFondos`, { headers: this.getHeaders() }).pipe(
      map(resp => resp.map(item => ({ name: item }))),
      tap(fondos => {
        this.listadoFondos = this.listadoFondos.concat(fondos);
      })
    );
  }

  getInstrumentos(): Observable<Instrumentos[]> {
    return this.http.get<string[]>(`${this.apiUrl}/concursos/instrumentos`, { headers: this.getHeaders() }).pipe(
      map(resp => resp.map(item => ({ name: item }))),
      tap(instrumentos => {
        this.listadoInstrumentos = this.listadoInstrumentos.concat(instrumentos);
      })
    );
  }

  getTipoConcurso(): Observable<TipoConcurso[]> {
    return this.http.get<string[]>(`${this.apiUrl}/concursos/tipo`, { headers: this.getHeaders() }).pipe(
      map(resp => resp.map(item => ({ name: item }))),
      tap(tipos => {
        this.listadoTipos = this.listadoTipos.concat(tipos);
      })
    );
  }

  getEstados(estado: string): Observable<Concurso[]> {
    return this.http.get<Concurso[]>(`${this.apiUrl}/concursos/estado/${estado}`, { headers: this.getHeaders() }).pipe(
      tap(resp => {
      })
    );
  }

  getCriterios(criterio: string): Observable<CriterioGet[]> {
    return this.http.get<CriterioGet[]>(`${this.apiUrl}/concursos/criterios/instrumento/${criterio}`, { headers: this.getHeaders() }).pipe(
      tap(resp => {
      })
    );
  }

  postCrearConcurso(concurso: Concurso): Observable<Concurso> {
    return this.http.post<Concurso>(`${this.apiUrl}/concursos/`, concurso, { headers: this.getHeaders() });
  }

  postGuardarConcurso(borrador: Concurso): Observable<Concurso> {
    return this.http.post<Concurso>(`${this.apiUrl}/concursos/borrador`, borrador, { headers: this.getHeaders() });
  }

  putConcurso(concurso: Concurso): Observable<Concurso> {
    return this.http.put<Concurso>(`${this.apiUrl}/concursos/${concurso.internalid}`, concurso, { headers: this.getHeaders() });
  }

  aprobarConcurso(id: string): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/concursos/aprobar/${id}`, {}, { headers: this.getHeaders() });
  }

  rechazarConcurso(id: string, motivo: string): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/concursos/rechazar/${id}`, { motivo }, { headers: this.getHeaders() });
  }

  getConcursoPorId(id: string): Observable<Concurso> {
    return this.http.get<Concurso>(`${this.apiUrl}/concursos/${id}`, { headers: this.getHeaders() });
  }

  deleteConcurso(id: string): Observable<Concurso> {
    return this.http.put<Concurso>(`${this.apiUrl}/concursos/eliminar/${id}`, {}, { headers: this.getHeaders() });
  }
}
