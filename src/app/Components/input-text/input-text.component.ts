import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
})
export class InputTextComponent implements OnInit {
  @Input() placeholder: string = '';
  @Input() value: any = '';
  @Output() valueChange = new EventEmitter<any>();
  @Input() disable: boolean = false;
  @Input() label: string = '';
  @Input() inputId: string = '';
  @Input() useFormControl: boolean = false;
  @Input() tipo: string = '';

  formControlInstance: FormControl | undefined;
  rutInvalido: boolean = false;
  errorMessage: string = '';

  onInputChange(event: any) {
    let inputValue = event.target.value;
    if (this.tipo === 'rut') {
      inputValue = inputValue.replace(/[^\dkK]/g, '');
      this.value = this.formatearRut(inputValue);
      this.valueChange.emit(this.value);
    } else if (this.tipo === 'number') {
      inputValue = inputValue.replace(/[^\d]/g, ''); // Solo números
      this.value = inputValue;
    } else {
      this.value = inputValue;      
    }
    this.valueChange.emit(this.value);
  }

  onKeyDown(event: KeyboardEvent) {
    if (this.tipo === 'number') {
      const allowedKeys = [
        'Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab',
      ];

      const isNumber = /^[0-9]$/.test(event.key)

      if (!isNumber && !allowedKeys.includes(event.key)) {
        event.preventDefault()
      }
    }
  }

  ngOnInit() {
    if (this.useFormControl) {
    this.formControlInstance = new FormControl(this.value);
    this.formControlInstance.valueChanges.subscribe((val) => {
      if (this.tipo === 'rut') {
        const clearValue = val.replace(/[^\dkK]/g, '');
        this.value = this.formatearRut(clearValue);
      } else if (this.tipo === 'number') {
        const onlyNumbers = val.replace(/[^\d]/g, '');
        this.value = onlyNumbers;
      } else {
        this.value = val;
      }

      this.valueChange.emit(this.value);
    });
  }
  }

  ngOnChanges() {
    if (this.formControlInstance) {
      this.formControlInstance.setValue(this.value);
    }
  }

  formatearRut(rut: string): string {
    rut = rut.replace(/[^\dK]/g, '');

    if (rut.length > 1) {
      const rutNumber = rut.slice(0, -1);
      const dv = rut.slice(-1).toUpperCase();

      const formattedRutNumber = rutNumber.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        '.'
      );

      return `${formattedRutNumber}-${dv}`;
    }

    return rut;
  }

  validarRut(rut: string): void {
    const cleanRut = rut.replace(/[^\dkK]/g, '');
    if (cleanRut.length < 8 || cleanRut.length > 9) {
      this.rutInvalido = true;
      this.errorMessage = 'El RUT ingresado es inválido (longitud incorrecta)';
      return;
    }

    const isValidRut = this.validarRutLogico(cleanRut);
    if (!isValidRut) {
      this.rutInvalido = true;
      this.errorMessage = 'El RUT ingresado es inválido';
    } else {
      this.rutInvalido = false;
      this.errorMessage = '';
    }
  }

  validarRutLogico(rut: string): boolean {
    const cleanRut = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();

    if (cleanRut.length < 2) {
      return false;
    }

    const rutNumber = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);

    if (!/^\d+$/.test(rutNumber)) {
      return false;
    }

    let sum = 0;
    let multiplier = 2;
    for (let i = rutNumber.length - 1; i >= 0; i--) {
      sum += parseInt(rutNumber[i], 10) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    const expectedDv = 11 - (sum % 11);
    const calculatedDv =
      expectedDv === 11 ? '0' : expectedDv === 10 ? 'K' : expectedDv.toString();

    return calculatedDv === dv;
  }
  
}
