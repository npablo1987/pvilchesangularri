export interface CeroPapelResponse {
  cant:       number;
  documentos: Documento[];
  mensaje:    string;
  success:    string;
}

export interface Documento {
  numero_resolucion: string;
  fecha_resolucion:  string;
  observacion:       string;
  tipo:              string;
  pdf:               string;
  estado:            string;
  docMensaje:        string;
}

export interface TiposDocumentos {
  [key: number]: string;
}
