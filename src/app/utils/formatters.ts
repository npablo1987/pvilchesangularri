import { ConcursoPublicado, Proyecto, ProyectoPostulado } from "../interfaces/proyecto.interfaces";

export const convertToDropdownOptions = (strings: string[]): { id: string, name: string }[] => {
  return strings.map((str, index) => ({
    id: (index + 1).toString(),
    name: str
  }));
}

export const fechaUTCFormater = (fechaStr: string, horas = 22, minutos = 8, segundos = 1, milisegundos = 52) => {
  let partesFecha = fechaStr.split(/[-\/]/);
  let dia = parseInt(partesFecha[0], 10);
  let mes = parseInt(partesFecha[1], 10) - 1;
  let anio = parseInt(partesFecha[2], 10);

  let fecha = new Date(anio, mes, dia);

  fecha.setHours(horas);
  fecha.setMinutes(minutos);
  fecha.setSeconds(segundos);
  fecha.setMilliseconds(milisegundos);

  let fechaFormateada = fecha.toISOString();

  return fechaFormateada;
}

export const formatRut = (rut: string): string => {
  let cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();

  let cuerpo = cleanRut.slice(0, -1);
  let dv = cleanRut.slice(-1);
  cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${cuerpo}-${dv}`;
}

// TODO: Eliminar estas 2 funciones una vez el endpoint devuelva el Concurso!!
// Función para agregar un proyecto postulado al listado y guardarlo en el localStorage
export const agregarProyectoPostulado =(idProyecto: string, selectedConcurso: ConcursoPublicado): void => {
  // Obtener el listado actual del localStorage
  const proyectosPostulados: ProyectoPostulado[] = JSON.parse(localStorage.getItem('proyectosPostulados') || '[]');

  // Crear el nuevo proyecto postulado
  const nuevoProyectoPostulado: ProyectoPostulado = {
    idProyecto: idProyecto,
    concursoAsignado: {
      idConcurso: selectedConcurso.internalid,
      nombreConcurso: selectedConcurso.nombre
    }
  };

  // Agregar el nuevo proyecto al listado
  proyectosPostulados.push(nuevoProyectoPostulado);

  // Guardar el listado actualizado en el localStorage
  localStorage.setItem('proyectosPostulados', JSON.stringify(proyectosPostulados));
}

// Función para asignar concursos a proyectos
export const asignarConcursosAProyectos = (proyectos: Proyecto[], proyectosPostulados: ProyectoPostulado[]): Proyecto[] =>{
  return proyectos.map(proyecto => {
    // Buscar el concurso asignado en el listado de proyectos postulados
    const proyectoPostulado = proyectosPostulados.find(pp => pp.idProyecto === proyecto.internalid);

    // Si se encuentra un concurso asignado, agregarlo al proyecto
    if (proyectoPostulado) {
      proyecto.concurso = {
        internalid: proyectoPostulado.concursoAsignado.idConcurso,
        nombre: proyectoPostulado.concursoAsignado.nombreConcurso,
        instrumento: 'PRI',
        criterios: [],
        id: 0 // Puedes ajustar este valor según sea necesario
      };
    }

    return proyecto;
  });
}