
export interface Concurso {
  internalid?:                string;
  id?:                         number;
  nombre:                     string;
  creadoPor?:                  string;
  motivoRechazo?:              string;
  origenFondos:               string;
  instrumento:                string;
  tipoConcurso:               string;
  presupuesto:                number;
  montoMaximo:                number;
  porcentajeMaximo:           number;
  fechaInicioPostulacion:     Date;
  fechaCierrePostulacion:     Date;
  fechaEstimadaResultados:    Date;
  añoPresupuestario:          number;
  esLlamadoOperacionTemprana: boolean;
  estado:                     string;
  identificadorResolucion:    string;
  criterios:                  Criterio[];
  focalizacionRegion:         string;
  focalizacionIdRegion:      number;
  focalizacionArea:           string;
  focalizacionIdArea:        number;
  focalizacionComunas:        FocalizacionComuna[];
}

export interface Criterio {
  nombre:      string;
  tipo?:       string;
  caracter?:    string;
  activar:     boolean;
  ponderacion: number;
  variables:   VariablesCriterio[];
}

export interface CriterioGet {
  nombre:      string;
  tipo?:       string;
  caracter?:   string;
  activar:     boolean;
  ponderacion: number;
  variables:   VariablesCriterio[];
}

export interface FocalizacionComuna {
  nombre:   string;
  idComuna: number;
  selected?: boolean;
}

export interface FocalizacionConcurso {
  region: {
    nombre: string;
    cod: number;
  };
  area: {
    nombre: string;
    cod: number;
  };
  comunas: FocalizacionComuna[];
}

export interface VariablesCriterio {
  nombre: string;
  puntaje:  number;
  opciones: string;
}
export interface FondosConcurso {
  name: string;
}

export interface Instrumentos {
  name: string;
}

export interface TipoConcurso {
  name: string;
}

export interface RegionConcurso {
  nombre: string;
  code: number;
}

export interface AreaConcurso {
  nombre: string;
  code: number;
}

export interface BreadMenuItem {
  label: string;
  url:   string;
}

export interface AprobarRechazar {
  estado: string;
  textoRechazo: string;
}