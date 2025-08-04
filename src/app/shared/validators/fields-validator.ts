// shared/validators/fields-validator.ts
export class FieldsValidator {
  /** Devuelve true si el RUT es válido */
  static isRutValid(rawRut: string): boolean {
    if (!rawRut) { return false; }

    // 1. Limpia el string ➜ solo números + dígito (puede ser K)
    const rut = rawRut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
    if (!/^\d{7,8}[0-9K]$/.test(rut)) { return false; }

    const cuerpo = rut.slice(0, -1);
    const dv     = rut.slice(-1);

    // 2. Algoritmo módulo 11
    let suma = 0, multiplicador = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += +cuerpo[i] * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    const resto = 11 - (suma % 11);
    const dvReal =
      resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);

    return dvReal === dv;
  }
}
