import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BreadMenuItem } from '../../interfaces/concursos.interfaces';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  @Input()
  public breadcrumb: BreadMenuItem[] = [];
  items: BreadMenuItem[] = [];
  url: string = '';

  constructor(private router: Router) {}

  fontClass: string = 'a11y-font-0';
  contrastClass: string = ''; 

  toggleFontSize(size: number): void {
    const body = document.body;
  
    body.classList.remove('a11y-font-0', 'a11y-font-1', 'a11y-font-2');
    
    if (size === 1) {
      body.classList.add('a11y-font-1');
    } else if (size === 2) {
      body.classList.add('a11y-font-2');
    } else {
      body.classList.add('a11y-font-0');
    }
  }

  toggleContrast(): void {
    const body = document.body;
    if (body.classList.contains('a11y-contrast')) {
      body.classList.remove('a11y-contrast');
    } else {
      body.classList.add('a11y-contrast');
    }
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.url = event.urlAfterRedirects;
        this.updateBreadcrumb(this.url);
        this.resetAccessibilityFeatures();
      }
    });
  }

  updateBreadcrumb(url: string) {
    const baseItems = [
      { label: 'Escritorio', route: '/riego-home', disabled: url !== '/riego-home' },
      { label: 'Llamados', route: '/todos-los-llamados', disabled: url !== '/todos-los-llamados' && url !== '/formulario-llamados' },
      { label: 'Crear llamado', route: '/formulario-llamados', disabled: url !== '/formulario-llamados' }
    ];
  }

  resetAccessibilityFeatures() {
    this.applyAccessibilityStyles();
  }

  applyAccessibilityStyles() {
    const body = document.body;

    body.classList.remove('a11y-font-0', 'a11y-font-1', 'a11y-font-2');
    if (this.fontClass) {
      body.classList.add(this.fontClass);
    }

    if (this.contrastClass) {
      body.classList.add(this.contrastClass);
    } else {
      body.classList.remove('a11y-contrast');
    }
  }
}
