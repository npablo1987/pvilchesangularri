import { RespuestasDemandas } from './demandas.interfaces';

export interface RadioOpciones {
  id: string;
  name: string;
  respuesta: boolean;
}

export interface Borrador {
  nombre: string;
  descripcion: string;
  demanda: {
    internalid: string;
  };
}

export interface BuscarDemanda {
  agencia: string;
  areaId: number;
  descripcion: string;
  estado: string;
  estadoVigencia: boolean;
  fechaCaducidad: string;
  fechaCreacion: string;
  id: number;
  instrumento: string;
  internalid: string;
  nombreEjecutivo: string;
  regionId: number;
  representantes: any[];
  respuestas: RespuestasDemandas[];
  rut: string;
  tipoUsuario: string;
  usuario: string;
}

export interface TipoAgua {
  [key: string]: string[];
  Superficial: string[];
  Subterránea: string[];
  Potable: string[];
  Reutilizada: string[];
  Otra: string[];
}

export interface TipoFuente {
  [key: string]: string[];
  RedElectrica: string[];
  Combustible: string[];
  ERNC: string[];
}

export interface UnidadMedida {
  id: string;
  name: string;
}

export interface TipoTenencia {
  id: string;
  name: string;
}

export interface ArticuloAsociado {
  id: string;
  name: string;
}

export interface EjercicioDerechos {
  id: string;
  name: string;
}

export interface SubidaArchivos {
  id: string;
  nombre: string;
  ubicacion?: string;
  tamaño: number;
}

export interface PrediosRut {
  rol: string;
  nombre: string;
  superficieEnHa: number;
  region: string;
  regionId: number;
  comuna: string;
  comunaId: number;
  clasificacionUsoSuelo: string;
  codigoSuelo: string;
  tenencia: string;
  codigoTenencia: string;
  fechaInicioContrato?: string | null;
  fechaTerminoContrato?: string | null;
  superficieHecFisicasTotal: number;
  superficieHecRiegoBasicoTotal: number;
  superficieHecFisicasSuelo: number;
  superficieHecRiegoBasicoSuelo: number;
}

export interface RegionesProyecto {
  id_region: number;
  cod_region: string;
  nombre: string;
}

export interface ComunasProyecto {
  id_comuna: number;
  id_region: number;
  nombre: string;
  id_tipo_comuna: number;
}

export interface SectorProyecto {
  id_area: number;
  cod_area: string;
  cod_region: string;
  id_region: number;
  nombre: string;
}

export interface CodigoAreaTelefono {
  codigo: number;
  nombre: string;
}

export interface TipoTelefono {
  idTipoTelefono: number;
  tipoTelefono: string;
}

export interface Proyecto {
  nombre: string;
  descripcion: string;
  fechaCreacion?: string;
  estado?: string;
  general: General;
  legal: Legal;
  tecnico: Tecnico;
  presupuesto: Presupuesto;
  concurso?: Concurso;
  demanda: Demanda;
  esFormulacionInterna: boolean;
  internalid?: string;
  evaluacion?: ProyectoEvaluacion;
}

// TODO: Eliminar una vez el endpoint devuelva el concurso!!
export interface ProyectoPostulado {
  idProyecto: string;
  concursoAsignado: {
    idConcurso: string;
    nombreConcurso: string;
  };
}

export interface General {
  antecedentesPostulante: AntecedentesPostulante;
  antecedentesFormulador?: AntecedentesFormulador;
  antecedentesContratista?: AntecedentesContratista;
  contratistaMismoQueFormulador: boolean;
}

export interface AntecedentesPostulante {
  nombre: string;
  rut: string;
  sexo?: string;
  estadoCivil?: string;
  puebloOriginario?: string;
  estadoAcreditacion: string;
  situacionCrediticia: string;
  rendicionesPendientes: string;
  razonSocial?: string;
  rutRepresentante: string;
  nombreRepresentante: string;
  datosDeContacto: Contacto[];
  email: string;
  direccion: Direccion;
  tipoUsuario: string;
}

export interface AntecedentesFormulador {
  nombre: string;
  rut: string;
  tipoTributacion: string;
  datosDeContacto: Contacto[];
  email: string;
  direccion: Direccion;
}

export interface AntecedentesContratista {
  nombre: string;
  rut: string;
  datosDeContacto: Contacto[];
  email: string;
  direccion: Direccion;
}

export interface Contacto {
  codigoDeArea: string;
  numero: string;
  tipoTelefono: string;
  conWhatsapp: boolean;
}

export interface Direccion {
  region: string;
  regionId: number;
  comuna: string;
  comunaId: number;
  sector: string;
  sectorId: number;
  direccion: string;
  numero: string;
  esSinNumero: boolean;
}

export interface Legal {
  soloDrenaje: boolean;
  esUsuarioDeAguas: boolean;
  archivosCarpetaLegal: Archivo[];
  acreditacionesTierra: AcreditacionTierra[];
  acreditacionesAgua: AcreditacionAgua[];
}

export interface Archivo {
  id: string;
  nombre: string;
  tamaño: number;
}

export interface AcreditacionTierra {
  rol: string;
  nombreDelPredio: string;
  superficie: number;
  region: string;
  regionId: number;
  comuna: string;
  comunaId: number;
  clasificacionUsoDeSuelo: string;
  tenencia: string;
  fechaInicioContrato?: string | null;
  fechaTerminoContrato?: string | null;
  archivosCarpetaLegal: Archivo[];
}

export interface AcreditacionAgua {
  tipoAgua: string;
  esAPR: boolean;
  nombreAPR: string;
  tipoFuente: string;
  detalleTipoFuente: string;
  tipoTenencia: string;
  caudalDisponible: number;
  unidadMedida: string;
  articuloAsociado: string;
  ejercicioDerecho: string;
  esDerechoConsultivo: boolean;
  archivosCarpetaLegal: Archivo[];
}

export interface TipoApoyo {
  id: string;
  tipo_apoyo: string;
  id_tipo_consultoria: string;
}

export interface TipoConsultoria {
  id: string;
  tipo_consultoria: string;
  seleccionado: boolean;
}

export interface Tecnico {
  georeferenciacion: Coordenadas;
  sueloEsAgricola: boolean;
  tipoConsultoria: TipoConsultoria[];
  tiposApoyo: TipoApoyo[];
  cultivos: Cultivo[];
  riega: boolean;
  metodoRiego: string;
  fuenteEnergia: string;
  cuentaConAcumuladorDeAgua: boolean;
  capacidadAcumulador: number;
  futuroUsoDeSuelo: Cultivo[];
  capacidadMaximaDelDiseño: number;
  tiposInversion: TipoInversion[];
  contemplaInversionEnergia: boolean;
  fuenteEnergiaInversion: string;
  tipoFuenteEnergia: string;
  potenciaPeakDeFuenteEnergia: number;
  configuracionDeFuenteEnergia: string;
  archivosCarpetaTecnica: Archivo[];
  archivosCarpetaPlano: Archivo[];
  archivosBoletasElectricas: Archivo[];
}

export interface Cultivo {
  rubro: string;
  especie: string;
  superficie: number;
  unidadMedida: string;
}

export interface CultivoExtendido {
  rubro: Rubros | null;
  especie: Especies | null;
  superficie: number;
  unidadMedida: UnidadMedidaEspecies | null;
  especieOpciones: Especies[];
  unidadOpciones: UnidadMedidaEspecies[];
}

export interface TipoInversion {
  tipoInversion: string;
  unidadDeMedida: string;
  tipologia: string;
  tamaño: number;
  ancho?: number;
  alto?: number;
  largo?: number;
  pendiente?: number;
  caudal?: number;
  talud?: number;
  diametro?: number;
  profundidad?: number;
  descripcion?: string;
}

export interface InversionForm {
  tipo: {
    nombre: string;
    selected: boolean;
    tipologias: TipologiaObra[];
  } | null;
  tipologia: TipologiaObra | null;
  descripcionTipologiaOtra: string;
  tamanioLabel: string;
  unidadMedidaLabel: string;
  tamanioValor: number | null;
  ancho: number | null;
  alto: number | null;
  talud: number | null;
  pendienteInclinacion: number | null;
  caudal: number | null;
  diametro: number | null;
  profundidadNivelEstatico: number | null;
  largo: number | null;
}

export interface Presupuesto {
  aCostoTotalDirecto: number;
  bUtilidad: number;
  cGastosGenerales: number;
  dIva: number;
  eCostoTotalEjecucion: number;
  fApoyoFormulacionProyecto: number;
  gApoyoEjecucionOCapacitacion: number;
  hApoyoFormulacionProyectoIva: number;
  iApoyoEjecucionOCapacitacionIva: number;
  costoTotalDelProyecto: number;
  incentivoInversion: number;
  incentivoFormulacion: number;
  incentivoEjecucionOCapacitacion: number;
  incentivoApoyoParticipacionDeLosUsuarios: number;
  incentivoTotal: number;
  aportePropio: number;
  total: number;
  declaracionSeleccionConsultor: Archivo;
  seleccionContratista: Archivo;
  autorizacionPagoConsultor: Archivo;
  autorizacionPagoContratista: Archivo;
  declaracionSimple: Archivo;
  cartaCompromiso: Archivo;
}

export interface Demanda {
  internalid: string;
  id?: number;
  fechaCreacion?: string;
  estado?: string;
  usuario?: string;
  tipoUsuario?: string;
  rut?: string;
  instrumento?: string;
  agencia?: string;
  areaId?: number;
  regionId?: number;
  representantes?: Representante[];
  proyecto?: string;
}

export interface Representante {
  nombre: string;
  rut: string;
}

export interface ConcursoPublicado {
  internalid: string;
  id: number;
  nombre: string;
  fechaCreacion: string;
  fechaInicioPostulacion: string;
  fechaCierrePostulacion: string;
  fechaEstimadaResultados: string;
  estado: string;
}

export interface ValidarProyecto {
  internalid: string;
  resultado: string;
  detalles: Detalles;
  detallesCamposRequeridos: DetallesCamposRequeridos;
}

export interface Detalles {
  'Todos los campos requeridos estan completados.': string;
  'Proyecto con prefactibilidad': string;
  'Cuenta con carta de selección del consultor.': string;
  'Cuenta con carta de selección del contratista.': string;
  'Cuenta con carta de conocimiento de aporte personal': string;
}

export interface DetallesCamposRequeridos {
  'El proyecto se encuentra en estado Borrador.': string;
  'Antecedentes del formulador.': string;
  'Formulador tiene email.': string;
  'Formulador tiene al menos un dato de contacto.': string;
  'Usuario con admisibilidad.': string;
}

export interface PostulacionProyecto {
  concursoInternalid: string;
}

export interface Rubros {
  idRubro: number;
  rubro: string;
  idClaseRubro: number;
}

export interface Especies {
  idEspecie: number;
  especie: string;
}

export interface UnidadMedidaEspecies {
  idUnidadMedida: number;
  unidadMedida: string;
}

export interface TipologiaObra {
  tipologia: string;
  tamaño: string;
  unidadDeMedida: string;
}

export interface RespuestaTipologias {
  [key: string]: TipologiaObra[];
}

export interface PreFactibilidad {
  archivoId: string;
  nombreArchivo: string;
  tamañoArchivo: number;
  esPrefactible: boolean;
}

export interface UsuariosEvaluadores {
  nombre: string;
  email: string;
  rut: string;
}

export interface Contratistas {
  nombre: string;
  email: string;
  rut: string;
}

export interface ProyectoEvaluacion {
  idArchivoResumenProyecto?: string;
  fecha?: string;
  proyectoInternalid: string;
  decision: string;
  observaciones?: string;
  criterioRegionalParaPriorizacion?: number;
  criterioSustentabilidadAgroambiental?: number;
  respuestasCriterios: RespuestaCriterio[];
}

export interface RespuestaCriterio {
  nombre: string;
  ponderacion: number;
  variableSeleccionada: string;
  variableSeleccionadaPuntaje: number;
}

/**Concurso en proyecto */
export interface Variable {
  nombre: string;
  puntaje: number;
  disponible?: boolean;
}

export interface Criterio {
  nombre: string;
  activar: boolean;
  ponderacion: number;
  variables: Variable[];
  orden?: number;
}

export interface Concurso {
  internalid: string;
  id: number;
  nombre: string;
  instrumento: 'PRI' | 'OTRO';
  criterios: Criterio[];
  fechaCreacion?: string;
}

export interface PriorizacionProyectos {
  internalid: string;
  id: number;
  estado: 'BORRADOR' | string; // Puedes ampliar los posibles valores del enum si conoces más estados
  nombre: string;
  priorizacion: number;
  usuario: string;
  rut: string;
  fechaPostulacion: string; // O usar tipo Date si planeas convertirlo
  puntaje: number;
}

export interface PriorizacionData {
  estadoTemporal: boolean;
  puedeVerPriorizacionPrevia: boolean;
  puedeVerEnvioAComite: boolean;
  puedeVerPriorizacionFinal: boolean;
  esPriorizacionTemporal: boolean;
  detalle: string;
  proyectos: PriorizacionProyectos[];
  documentoPriorizacion: string;
  documentoPriorizacionFinal: string;
}

export interface MontoValues {
  aportePropio: number;
  totalIncentivos: number;
  incentivoTotal: number;
}

export interface Registro {
  usuario: string;
  rut: string;
  instrumento: string;
  codigoProyecto: string;
  llamado: string;
  area: string;
  postulacion: string;
  estado: string;
}

export interface Coordenadas {
  lat: number;
  lng: number;
  utmE: number;
  utmN: number;
  zone: number;
}