import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RadioOpciones } from '../../interfaces/proyecto.interfaces';

@Component({
  selector: 'app-radio-button',
  standalone: true,
  imports: [RadioButtonModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
})
export class RadioButtonComponent implements OnInit {
  @Input() firstOption: string = '';
  @Input() secondOption: string = '';
  @Input() label: string = '';
  @Input() disable: boolean = false;
  @Input() value: boolean = false;
  @Input() useFormControl: boolean = false;
  @Input() multiple: boolean = false;
  @Input() options: RadioOpciones[] = [];

  @Output() valueChange: EventEmitter<RadioOpciones | boolean> = new EventEmitter();

  formControl: FormControl = new FormControl();

  ngOnInit() {
    if (this.useFormControl) {
      this.formControl.setValue(this.value);
    }
  }

  seleccionarOpcion(valor: boolean) {
    this.value = valor;
    this.valueChange.emit(valor);
  }

  onSelectionChange(selectedOption: RadioOpciones | boolean) {
    if (this.multiple) {
      this.handleMultipleSelection(selectedOption as RadioOpciones);
    } else {
      this.handleSingleSelection(selectedOption as boolean);
    }
  }

  private handleMultipleSelection(selectedOption: RadioOpciones) {
    this.options.forEach(option => (option.respuesta = false));
    selectedOption.respuesta = true;

    if (this.useFormControl) {
      this.formControl.setValue(selectedOption);
    } else {
      this.valueChange.emit(selectedOption);
    }
  }

  private handleSingleSelection(selectedValue: boolean) {
    if (this.useFormControl) {
      this.formControl.setValue(selectedValue);
    } else {
      this.valueChange.emit(selectedValue);
    }
  }
}
