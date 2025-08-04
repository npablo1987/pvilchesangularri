import { TiposDocumentos } from "../interfaces/ceroPapel.interfaces";
import { Instrumentos, VariablesCriterio } from "../interfaces/concursos.interfaces";

export const TIPOS_DOCUMENTOS: TiposDocumentos = {
  7300: "Acuerdo Complementario",
  3002: "Autorización de pago",
  1040: "Carta",
  1018: "Certificado",
  1027: "Circular",
  7100: "Contrato",
  7200: "Convenio",
  1025: "Hoja de envio",
  1010: "Memorandum",
  9080: "Minuta de distribución",
  1020: "Oficio Ordinario",
  7000: "Otros Documentos",
  3007: "Registro de Conformidad en Mercado Público",
  3003: "Registro de egreso",
  1035: "Resolución Afecta",
  1050: "Cierre de Actividad",
  1030: "Resolución Exenta",
  3000: "Solicitud de pago"
};

export const VARIABLES_BASE: VariablesCriterio[] = [
  { nombre: 'Usuario con asesoría hace menos de un año', puntaje: 10, opciones: '' },
  { nombre: 'Usuario con asesoría hace más de un año', puntaje: 30, opciones: '' },
  { nombre: 'Usuario con asesoría hace más de dos años', puntaje: 50, opciones: '' },
]

export const AMBITO_USUARIO: { [key: string]: string } = {
  '1': 'Nacional',
  '2': 'Regional',
  '4': 'Area',
};

export const TIPO_USUARIO: { [key: string]: string } = {
  '2': 'jefe de area',
  '3': 'ejecutivo de área',
  '76': 'encargado nacional',
  '77': 'encargado regional'
};

export const ACCIONES_NOTIFICACIONES = {
  solicitaAprobacion: 'SOLICITAR_APROBAR_CONCURSO',
  concursoRechazado: 'CONCURSO_RECHAZADO',
  concursoAprobado: 'CONCURSO_APROBADO',
}

export const INSTRUMENTOS: Instrumentos[] = [
  { name: "PRI" },
  { name: "PRA" },
  { name: "PROM" },
  { name: "BLA" },
  { name: "Estudios" }
];

export const TEXTOS_DOCUMENTOS_PRESUPUESTO = [
  {
    subTitulo: 'Declaración de selección del consultor.',
    subTexto: 'tipo y luego adjunta la versión firmada por el usuario:',
    textoFormato: 'Descarga el formato',
    tamanio: '5'
  },
  {
    subTitulo: 'Declaración de selección del contratista.',
    subTexto: 'tipo y luego adjunta la versión firmada por el usuario:',
    textoFormato: 'Descarga el formato',
    tamanio: '5'
  },
  {
    subTitulo: 'Autorización de pago consultor.',
    subTexto: 'tipo y luego adjunta la versión firmada por el usuario:',
    textoFormato: 'Descarga el formato',
    tamanio: '5'
  },
  {
    subTitulo: 'Autorización de pago contratista.',
    subTexto: 'tipo y luego adjunta la versión firmada por el usuario:',
    textoFormato: 'Descarga el formato',
    tamanio: '5'
  },
  {
    subTitulo: 'Declaración Simple. ',
    subTexto: 'Declaración de cumplimiento de requisitos para solicitud de incentivos firmado:',
    textoFormato: '',
    tamanio: '5'
  },
  {
    subTitulo: 'Carta de compromiso.',
    subTexto: 'Carta de compromiso firmado:',
    textoFormato: '',
    tamanio: '5'
  },
]