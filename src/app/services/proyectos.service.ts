import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { delay, map, Observable, of } from 'rxjs';
import { Archivo, BuscarDemanda, CodigoAreaTelefono, ComunasProyecto, ConcursoPublicado, Especies, PostulacionProyecto, PrediosRut, PreFactibilidad, Proyecto, RegionesProyecto, RespuestaTipologias, Rubros, SectorProyecto, SubidaArchivos, TipoAgua, TipoFuente, TipoTelefono, UnidadMedida, UnidadMedidaEspecies, UsuariosEvaluadores, ValidarProyecto, ProyectoEvaluacion, Concurso, PriorizacionData, Contratistas, TipoApoyo, TipoConsultoria } from "../interfaces/proyecto.interfaces";

@Injectable({
  providedIn: 'root'
})

export class ProyectosService {

   private apiUrl = environment.API_BASE_URL;
  
    constructor(private http: HttpClient, private authService: AuthService) { }
  
    private getHeaders(): HttpHeaders {
      const token = this.authService.getToken();
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return headers;
    }
    
    getComprobanteProyecto(idProyecto: string): Observable<Blob> {
      return this.http.get(`${this.apiUrl}/proyectos/comprobante/${idProyecto}`, { headers: this.getHeaders(), responseType: 'blob' });
    }

    getDocumentoPrefactibilidad(idProyecto: string): Observable<Blob> {
      return this.http.get(`${this.apiUrl}/proyectos/documento/prefactibilidad/${idProyecto}`, { headers: this.getHeaders(), responseType: 'blob' });
    }

    postAsignarProyecto(idProyecto: string, usuarioAsignado: UsuariosEvaluadores): Observable<string> {
      return this.http.post<string>(`${this.apiUrl}/proyectos/asignar/${idProyecto}`, usuarioAsignado, { headers: this.getHeaders() });
    }

    postPreFactibilidadProyecto(proyectoFactible: PreFactibilidad, idProyecto: string): Observable<PreFactibilidad> {
      return this.http.post<PreFactibilidad>(`${this.apiUrl}/proyectos/prefactibilidad/${idProyecto}`, proyectoFactible, { headers: this.getHeaders() });
    }

    postPostularProyecto(idProyecto: string, Concurso: {concursoInternalid: string}): Observable<PostulacionProyecto> {
      return this.http.post<PostulacionProyecto>(`${this.apiUrl}/proyectos/postular/${idProyecto}`, Concurso, { headers: this.getHeaders() });
    }

    postValidarProyecto(idProyecto: string): Observable<ValidarProyecto> {
      return this.http.post<ValidarProyecto>(`${this.apiUrl}/proyectos/validar/${idProyecto}`, {}, { headers: this.getHeaders() });
    }

    getConcursosPublicados(): Observable<ConcursoPublicado[]> {
      return this.http.get<ConcursoPublicado[]>(`${this.apiUrl}/concursos/publicados`, { headers: this.getHeaders() });
    }

    getProyectos(): Observable<Proyecto[]> {
      return this.http.get<Proyecto[]>(`${this.apiUrl}/proyectos/`, { headers: this.getHeaders() });
    }

    getProyectoId(idProyecto: string): Observable<Proyecto> {
      return this.http.get<Proyecto>(`${this.apiUrl}/proyectos/internalid/${idProyecto}`, { headers: this.getHeaders() });
    }

    getDemandaPorPersonaNaturalRutId(rut: string, id: string): Observable<BuscarDemanda[]> { 
      return this.http.get<BuscarDemanda[]>(`${this.apiUrl}/demanda/rut/${rut}/id/${id}`, { headers: this.getHeaders() });
    }

    getDemandaPorPersonaNatural(rut: string): Observable<BuscarDemanda[]> {
      return this.http.get<BuscarDemanda[]>(`${this.apiUrl}/demanda/rut/${rut}`, { headers: this.getHeaders() });
    }

    getDemandaPorPersonaJuridica(rut: string): Observable<BuscarDemanda[]> {
      return this.http.get<BuscarDemanda[]>(`${this.apiUrl}/demanda/rut/${rut}`, { headers: this.getHeaders() });
    }

    getDemandaPorGrupoInformal(nombre: string, id:string): Observable<[]> {
      return this.http.get<[]>(`${this.apiUrl}/demanda/nombre/${nombre}/id/${id}`, { headers: this.getHeaders() });
    }

    getDemandaPorRepresentante(rut : string, id: string): Observable<[]> {
      return this.http.get<[]>(`${this.apiUrl}/demanda/rutRepresentante/${rut}/id/${id}`, { headers: this.getHeaders() });
    }

    postProyectosBorrador(proyectoBorrador: any): Observable<Proyecto> {
      return this.http.post<Proyecto>(`${this.apiUrl}/proyectos/borrador`, proyectoBorrador, { headers: this.getHeaders() });
    }

    putProyectos(proyectoBorrador: Proyecto, idProyecto: string): Observable<Proyecto> {
      return this.http.put<Proyecto>(`${this.apiUrl}/proyectos/internalid/${idProyecto}`, proyectoBorrador, { headers: this.getHeaders() });
    }

    postSubirArchivo(proyectoId: string, archivo: File): Observable<Archivo> {
      return this.postSubirArchivoCarpeta(proyectoId, archivo, 'predio');
    }

    postSubirArchivoCarpeta(proyectoId: string, archivo: File, tipoCarpeta: string): Observable<Archivo> {
      const formData = new FormData();
      formData.append('file', archivo);

      const url = `${this.apiUrl}/proyectos/proyecto/${proyectoId}/archivo?tipoCarpeta=${tipoCarpeta}`;

      return this.http.post<SubidaArchivos>(url, formData, { headers: this.getHeaders() }).pipe(
        map((response: SubidaArchivos) => {
          return {
            id: response.id, 
            nombre: response.nombre,
            tamaño: response.tamaño,
          } as Archivo;
        })
      );
    }

    getPrediosRut(rut: string): Observable<PrediosRut[]> {
      return this.http.get<PrediosRut[]>(`${this.apiUrl}/agricultores/predios/${rut}`, { headers: this.getHeaders() });
    }

    postProyectoEvaluar(proyectoEvaluar: ProyectoEvaluacion ): Observable<string> {
      return this.http.post<string>(`${this.apiUrl}/proyectos/evaluar`, proyectoEvaluar, { headers: this.getHeaders() })
    }

    getResumenProyecto(id: string): Observable<HttpResponse<Blob>> {
      return this.http.get(`${this.apiUrl}/proyectos/resumenProyecto/${id}`, {
        headers: this.getHeaders(),
        observe: 'response',
        responseType: 'blob'
      });
    }

     postProyectoSolicitarEvaluar(id: string, proyectoAEvaluar: Proyecto): Observable<string> {
      return this.http.post<string>(`${this.apiUrl}/proyectos/solicitarEvaluar/${id}`, proyectoAEvaluar, { headers: this.getHeaders() })
    }

    getProyectoCriterios(idConcurso: string): Observable<Concurso[]> {
      return this.http.get<Concurso[]>(`${this.apiUrl}/concursos/${idConcurso}`, { 
        headers: this.getHeaders() 
      }).pipe(
        map(response => {
          // Filtramos concursos sin criterios
          return response.filter(concurso => 
            concurso.criterios && concurso.criterios.length > 0
          );
        })
      );
    }

    getProyectosConcurso(idConcurso: string): Observable<PriorizacionData> {
      return this.http.get<PriorizacionData>(`${this.apiUrl}/proyectos/concurso/${idConcurso}` , { headers: this.getHeaders() });
    }




    /** For Dropdowns */

    getRegionesProyecto(): Observable<RegionesProyecto[]> {
      return this.http.get<RegionesProyecto[]>(`${this.apiUrl}/zona_indap/regiones`, { headers: this.getHeaders() });
    }

    getComunasProyecto(idregion: number): Observable<ComunasProyecto[]> {
      return this.http.get<ComunasProyecto[]>(`${this.apiUrl}/zona_indap/comunas/region/${idregion}`, { headers: this.getHeaders() });
    }

    getSectorProyecto(idComuna: number): Observable<SectorProyecto[]> {
      return this.http.get<SectorProyecto[]>(`${this.apiUrl}/zona_indap/area/comuna/${idComuna}`, { headers: this.getHeaders() });
    }

    getCodigoAreaTelefono(): Observable<CodigoAreaTelefono[]> {
      return this.http.get<CodigoAreaTelefono[]>(`${this.apiUrl}/zona_indap/codigoTelefono`, { headers: this.getHeaders() });
    }

    getTipoTelefono(): Observable<TipoTelefono[]> {
      return this.http.get<TipoTelefono[]>(`${this.apiUrl}/zona_indap/tipoTelefono`, { headers: this.getHeaders() });
    }

    getTipoAgua(): Observable<TipoAgua> {
      return this.http.get<TipoAgua>(`${this.apiUrl}/proyectos/tipoAgua`, { headers: this.getHeaders() });
    }

    getUnidadAgua(): Observable<string[]> {
      return this.http.get<string[]>(`${this.apiUrl}/proyectos/unidadAgua`, { headers: this.getHeaders() });
    }
    
    getTipoTenencia(): Observable<string[]> {
      return this.http.get<string[]>(`${this.apiUrl}/proyectos/tipoTenencia`, { headers: this.getHeaders() });
    }

    getArticuloAsociado(): Observable<string[]> {
      return this.http.get<string[]>(`${this.apiUrl}/proyectos/articuloAsociado`, { headers: this.getHeaders() });
    }

    getEjercicioDerecho(): Observable<string[]> {
      return this.http.get<string[]>(`${this.apiUrl}/proyectos/ejercicioDerecho`, { headers: this.getHeaders() });
    }

    getMetodoRiego(): Observable<[]> {
      return this.http.get<[]>(`${this.apiUrl}/proyectos/metodoRiego`, { headers: this.getHeaders() });
    }

    getFuenteEnergia(): Observable<TipoFuente> {
      return this.http.get<TipoFuente>(`${this.apiUrl}/proyectos/fuenteEnergia`, { headers: this.getHeaders() });
    }

    getRubrosProyecto(): Observable<Rubros[]> {
      return this.http.get<Rubros[]>(`${this.apiUrl}/agricultores/rubros`, { headers: this.getHeaders() });
    }

    getEspecieProyecto(rubroId: string): Observable<Especies[]> {
      return this.http.get<Especies[]>(`${this.apiUrl}/agricultores/especie/${rubroId}`, { headers: this.getHeaders() });
    }

    getUnidadMedida(idEspecie: string): Observable<UnidadMedidaEspecies[]> {
      return this.http.get<UnidadMedidaEspecies[]>(`${this.apiUrl}/agricultores/unidadMedida/${idEspecie}`, { headers: this.getHeaders() });
    }

    getTipoInversion(): Observable<RespuestaTipologias> {
      return this.http.get<RespuestaTipologias>(`${this.apiUrl}/proyectos/tipoInversion`, { headers: this.getHeaders() });
    }

    getUsuariosEvaluadores(): Observable<UsuariosEvaluadores[]> {
      return this.http.get<UsuariosEvaluadores[]>(`${this.apiUrl}/usuarios/evaluadoresDeProyectos`, { headers: this.getHeaders() });
    }

    // to implement
    getContratistas(): Observable<Contratistas[]> {
        const contratistas: Contratistas[] = Array.from({ length: 5 }, (_, i) => ({
        nombre: `Contratista ${i + 1}`,
        email: `contratista${i + 1}@example.com`,
        rut: `${Math.floor(Math.random() * 90000000 + 10000000)}-${Math.floor(Math.random() * 10)}`
      }));
      return of(contratistas).pipe(delay(100));
    }
   
    getTipoApoyo(): Observable<TipoApoyo[]> {
      return this.http.get<TipoApoyo[]>(`${this.apiUrl}/proyectos/tipoApoyo`, { headers: this.getHeaders() });
    }

    getTipoConsultoria(): Observable<TipoConsultoria[]> {
      return this.http.get<TipoConsultoria[]>(`${this.apiUrl}/proyectos/tipoConsultoria`, { headers: this.getHeaders() });
    }

}