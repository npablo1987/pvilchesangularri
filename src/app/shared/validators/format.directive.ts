// shared/validators/format.directive.ts
import {
  Directive, HostListener, ElementRef, Output, EventEmitter
} from '@angular/core';
import { FieldsValidator } from './fields-validator';

@Directive({
  selector: '[rutFormatter]'
})
export class RutFormatterDirective {
  @Output() validState = new EventEmitter<boolean>();

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event.target.value'])
  onInput(val: string): void {
    const limpio = val.replace(/\./g, '').replace(/-/g, '').toUpperCase();
    const cuerpo = limpio.slice(0, -1);
    const dv     = limpio.slice(-1);

    // Inserta puntos cada 3 y guion antes del DV
    let formato = '';
    let i = 0;
    for (let j = cuerpo.length - 1; j >= 0; j--) {
      formato = cuerpo[j] + formato;
      i++;
      if (i === 3 && j !== 0) {
        formato = '.' + formato;
        i = 0;
      }
    }
    if (limpio.length > 1) { formato += '-' + dv; }

    this.el.nativeElement.value = formato;
    this.validState.emit(FieldsValidator.isRutValid(formato));
  }
}
