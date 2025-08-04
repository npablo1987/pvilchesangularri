import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
})
export class InputNumberComponent implements OnInit, OnChanges {
  @Input() placeholder: string = '';
  @Input() value: any = '';
  @Output() valueChange = new EventEmitter<any>();
  @Input() disable: boolean | 'first' | 'second' = false;
  @Input() label: string = '';
  @Input() inputId: string = '';
  @Input() useFormControl: boolean = false;
  @Input() tipo: string = '';
  @Input() width: string = '100%';
  @Input() height: string = 'auto';

  formControlInstance: FormControl | undefined;
  numberInvalido: boolean = false;
  errorMessage: string = '';

  ngOnInit() {
    if (this.useFormControl) {
      this.formControlInstance = new FormControl(this.value);
      this.formControlInstance.valueChanges.subscribe((val) => {
        let cleanValue = val?.toString().replace(/[^0-9.]/g, '') || '';

        if (this.tipo === 'CLP') {
          this.value = this.formatearCLP(cleanValue);
        } else if (this.tipo === 'porcentaje') {
          this.value = this.limitarPorcentaje(cleanValue);
        } else {
          this.value = cleanValue;
        }

        this.valueChange.emit(this.value);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.useFormControl) {
      const val = this.value?.toString() || '';
      if (this.tipo === 'CLP') {
        this.value = this.formatearCLP(val);
      } else if (this.tipo === 'porcentaje') {
        this.value = this.limitarPorcentaje(val);
      } else {
        this.value = val.replace(/[^0-9.]/g, '');
      }
    }

    if (this.formControlInstance) {
      this.formControlInstance.setValue(this.value);
    }
  }

  onInputChange(event: any) {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/[^0-9.]/g, '');

    if (this.tipo === 'CLP') {
      const cleanValue = inputValue.replace(/\./g, '');
      this.value = this.formatearCLP(cleanValue);
    } else if (this.tipo === 'porcentaje') {
      this.value = this.limitarPorcentaje(inputValue);
    } else {
      this.value = inputValue;
    }

    event.target.value = this.value;
    this.valueChange.emit(this.value);
  }

  formatearCLP(value: string): string {
    const cleanValue = value.replace(/\./g, '');
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  limitarPorcentaje(value: string): string {
    const numberValue = parseFloat(value);

    if (isNaN(numberValue)) {
      this.numberInvalido = false;
      this.errorMessage = '';
      return '';
    }

    if (numberValue > 100) {
      this.errorMessage = 'El porcentaje no puede superar el 100%';
      this.numberInvalido = true;
      return '100';
    } else if (numberValue < 0) {
      this.errorMessage = 'El porcentaje no puede ser menor que 0%';
      this.numberInvalido = true;
      return '0';
    } else {
      this.errorMessage = '';
      this.numberInvalido = false;
      return value.includes('.')
        ? value.split('.')[0] + '.' + value.split('.')[1].slice(0, 2)
        : value;
    }
  }
}
