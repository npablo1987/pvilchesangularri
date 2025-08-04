import { VariablesCriterio } from "../interfaces/concursos.interfaces";

export const isPuntajeValido = (variables: VariablesCriterio[], nuevoPuntaje: number, selectedVariableIndex: number | null = null): boolean => {
  const puntajeExistente = variables.reduce((sum, variable, index) => {
      if (selectedVariableIndex !== undefined && selectedVariableIndex === index) {
          return sum; 
      }
      return sum + (variable.puntaje || 0); 
  }, 0);

  const totalPuntaje = puntajeExistente + nuevoPuntaje;

  if (totalPuntaje > 100) {
      return false; 
  } 
  return true;
}

export const limpiarRut = (rut: string): string => {
    if (!rut) return '';
    return rut.replace(/[\.\-\s]/g, '');
}