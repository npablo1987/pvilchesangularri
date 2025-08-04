import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeLlamadosComponent } from './pages/home-llamados/home-llamados.component';
import { FormularioLlamadosComponent } from './pages/formulario-llamados/formulario-llamados.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeLlamadosComponent, FormularioLlamadosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
  
}
