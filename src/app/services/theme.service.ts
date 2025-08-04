import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private fontClassSource = new BehaviorSubject<string>('a11y-font-0');
  private contrastClassSource = new BehaviorSubject<string>('');
  private darkModeClassSource = new BehaviorSubject<string>('');

  fontClass$ = this.fontClassSource.asObservable();
  contrastClass$ = this.contrastClassSource.asObservable();
  darkModeClass$ = this.darkModeClassSource.asObservable();

  setFontClass(className: string) {
    this.fontClassSource.next(className);
  }

  toggleContrast() {
    const current = this.contrastClassSource.value;
    this.contrastClassSource.next(current === '' ? 'a11y-contrast' : '');
  }

  toggleDarkMode() {
    const current = this.darkModeClassSource.value;
    this.darkModeClassSource.next(current === '' ? 'dark-mode' : '');
  }
}
 