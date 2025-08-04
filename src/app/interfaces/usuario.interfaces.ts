export interface Usuario {
  data: Data;
  exp:  number;
  iat:  number;
  iss:  string;
}

export interface Data {
  ambitoActivo:     string;
  apellido_materno: string;
  apellido_paterno: string;
  area:             string;
  avatar:           string;
  comunasActivas:   any[];
  email:            string;
  id:               string;
  macroZonaActiva:  string;
  metodoAcceso:     string;
  nick:             string;
  nombre_completo:  string;
  nombres:          string;
  perfilActual:     string[];
  rut:              string;
}


export interface Region {
  id_region:  number;
  cod_region: number;
  nombre:     string;
  areas:      Area[];
}

export interface Area {
  id_area:    number;
  cod_area:   number;
  cod_region: number;
  nombre:     string;
  comunas:    Comuna[];
}

export interface Comuna {
  id_comuna:      number;
  id_region:      number;
  nombre:         string;
  id_tipo_comuna: number;
}