import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CeroPapelResponse } from '../interfaces/ceroPapel.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CeroPapelService {

  private apiUrl = 'https://api.indap.cl/devel/ceropapel/resolucion?folio=';

  constructor(private http: HttpClient) { }

  getVincularCeroPapel(folio: string): Observable<CeroPapelResponse> {
    const url = `${this.apiUrl}${folio}`;
    return this.http.get<CeroPapelResponse>(url);
  }
}
