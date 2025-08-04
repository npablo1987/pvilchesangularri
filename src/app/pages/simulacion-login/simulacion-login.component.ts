import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { InputTextModule }   from 'primeng/inputtext';
import { ButtonModule }      from 'primeng/button';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';
import { AuthService }       from '../../services/auth.service';
import { Usuario }           from '../../interfaces/usuario.interfaces';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule, RouterOutlet,
    InputTextModule, ButtonModule,
    CommonModule, FormsModule
  ],
  templateUrl: './simulacion-login.component.html',
})
export class SimulacionLoginComponent implements OnInit {

  /** token capturado de la URL o introducido manualmente */
  token = '';

  /** usuario obtenido (si lo necesitas en el template) */
  usuario!: Usuario;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * ──────────────────────────────────────────────────────────────
   *  Al inicializar el componente:
   *   1) Busca el token en /login/:token  → paramMap
   *   2) Busca el token en /login?token=  → queryParamMap
   *   3) Si lo encuentra, llama directo a logConToken()
   * ──────────────────────────────────────────────────────────────
   */
  ngOnInit(): void {
    console.info("cargando Token....")
    const tokenPath  = this.route.snapshot.paramMap.get('token');        // /login/ABC
    const tokenQuery = this.route.snapshot.queryParamMap.get('token');   // /login?token=ABC

    this.token = tokenPath || tokenQuery || '';

    if (this.token) {
      this.logConToken();        // autenticación automática
    }
    /* Si no hubiese token queda habilitado el formulario manual
       (ver template comentado). */
  }

  /**
   *  Lógica central: valida y guarda el token, luego navega.
   *  La utiliza ngOnInit() cuando la URL trae token,
   *  o el botón Login cuando el desarrollador lo reactive.
   */
  logConToken(): void {
    if (!this.token) {
      console.error('No se ha generado un token.');
      return;
    }

    this.authService.getUsuario(this.token).subscribe({
      next: (data) => {
        this.usuario = data;
        this.authService.setToken(this.token);
        this.router.navigateByUrl('/riego-home');   // SPA
        // window.location.href = '/riego-home';    // ← descomenta si prefieres recarga dura
      },
      error: (err) => console.error('Token inválido:', err)
    });
  }
}
