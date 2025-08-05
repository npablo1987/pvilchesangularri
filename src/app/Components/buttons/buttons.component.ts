import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.scss'
})
export class ButtonsComponent {
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() action!: () => void;
  @Input() disable: boolean = false;

  onClick() {
    if (!this.disable && this.action) {
      this.action();
    }
  }
}
