export interface Notificaciones {
  id?:            string;
  fechaCreacion?: Date;
  titulo?:        string;
  descripcion?:   string;
  leida?:         boolean;
  accion:        string;
  detalles:      Detalles;
}

export interface Detalles {
  concurso_internalid: string;
  concurso_nombre:     string;
  concurso_region_id?:  number;
  id_usuario_creador_concurso?: string;
}
