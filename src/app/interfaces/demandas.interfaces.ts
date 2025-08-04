export interface PreguntasDemanda {
  id: string,
  pregunta: string,
  editable: boolean,
  respuesta: boolean
}

export interface PersonaNatural {
  nombreCompleto: string,
  rut: string,
  sexo: string,
  edad: number,
  estadoAcreditacion: boolean
}

export interface PersonaJuridica {
  razonSocial: string,
  rut: string,
  estadoAcreditacion: boolean,
  representante: string
}

export interface GrupoInformal {
  nombreGrupo: string,
  rut: string,
  representante: string,
}

export interface TipoUsuarioAgricultor {
  idTipoUsuario: number,
  tipoUsuario: string
}

export interface GrupoInformalOPersonaJuridica {
  nombre: string,
  rut: string,
  representante: string
}

export interface Demanda {
  internalid?: string,
  id?: number,
  fechaCreacion?: string,
  fechaCaducidad?: string,
  estadoVigencia?: boolean,
  estado?: string,
  usuario: string,
  rut: string,
  instrumento: string,
  agencia?: string,
  nombreEjecutivo?: string,
  proyectoNombre?: string,
  descripcion: string,
  areaId?: 0,
  regionId?: 0,
  respuestas: RespuestasDemandas[] 
}

export interface RespuestasDemandas {
  id: string,
  pregunta: string,
  respuesta: boolean,
  editable: boolean
}
