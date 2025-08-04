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

export const esRutValido = (rut: string): boolean => {
    const cleanRut = limpiarRut(rut).toUpperCase();

    if (!/^\d{7,8}[0-9K]$/.test(cleanRut)) {
        return false;
    }

    const cuerpo = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);

    let suma = 0;
    let mult = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i], 10) * mult;
        mult = mult === 7 ? 2 : mult + 1;
    }

    const resto = 11 - (suma % 11);
    const dvReal = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);

    return dv === dvReal;
}