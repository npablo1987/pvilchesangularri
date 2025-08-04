import { HomeLlamadosComponent } from './pages/home-llamados/home-llamados.component';
import { FormularioLlamadosComponent } from './pages/formulario-llamados/formulario-llamados.component';
import { TodosLosLlamadosComponent } from './pages/todos-los-llamados/todos-los-llamados.component';
import { SimulacionLoginComponent } from './pages/simulacion-login/simulacion-login.component';
import { ConfirmacionGrabadoComponent } from './pages/confirmacion-grabado/confirmacion-grabado.component';
import { Routes } from '@angular/router';
import { DemandasFormularioComponent } from './pages/demandas/demandas-formulario/demandas-formulario.component';
import { DemandasHomeComponent } from './pages/demandas/demandas-home/demandas-home.component';
import { DemandasConfirmacionComponent } from './pages/demandas/demandas-confirmacion/demandas-confirmacion.component';
import { ProyectosHomeComponent } from './pages/proyectos/proyectos-home/proyectos-home.component';
import { FormularioProyectosComponent } from './pages/proyectos/formulario-proyectos/formulario-proyectos.component';
import { CrearProyectoComponent } from './pages/proyectos/crear-proyecto/crear-proyecto.component';
import { PostularProyectoComponent } from './pages/proyectos/postular-proyecto/postular-proyecto.component';
import { ConfirmacionProyectosComponent } from './pages/proyectos/confirmacion-proyectos/confirmacion-proyectos.component';
import { PriorizacionComponent } from './pages/priorizacion/priorizacion.component';
import { FormularioProyectoEstudioComponent } from './pages/proyectos/formulario-proyecto-estudio/formulario-proyecto-estudio.component';

export const routes: Routes = [
  { path: 'login', component: SimulacionLoginComponent },
  { path: 'riego-home', component: HomeLlamadosComponent },
  { path: 'formulario-llamados', component: FormularioLlamadosComponent },
  { path: 'formulario-llamados/:id', component: FormularioLlamadosComponent },
  { path: 'formulario-llamados/revision/:id', component: FormularioLlamadosComponent },
  { path: 'todos-los-llamados', component: TodosLosLlamadosComponent },
  { path: 'confirmacion', component: ConfirmacionGrabadoComponent },
  { path: 'confirmacion-demanda/:id', component: DemandasConfirmacionComponent },
  { path: 'demandas-home', component: DemandasHomeComponent },
  { path: 'formulario-demandas', component: DemandasFormularioComponent },
  { path: 'formulario-demandas/:id', component: DemandasFormularioComponent },
  { path: 'formulario-demandas/revision/:id', component: DemandasFormularioComponent },
  { path: 'formulario-llamados/revisionConcurso/:id', component: FormularioLlamadosComponent },
  { path: 'proyectos-home', component: ProyectosHomeComponent },
  { path: 'buscar-demanda', component: CrearProyectoComponent },
  { path: 'formulario-proyectos/:id', component: FormularioProyectosComponent },
  { path: 'formulario-proyectos/:id/asignado', component: FormularioProyectosComponent },
  { path: 'formulario-proyecto-estudio/:id', component: FormularioProyectoEstudioComponent },
  { path: 'formulario-proyecto-estudio/:id/asignado', component: FormularioProyectoEstudioComponent },
  { path: 'postular-proyecto/:id', component: PostularProyectoComponent},
  { path: 'confirmacion-proyecto/:id', component: ConfirmacionProyectosComponent },
  { path: 'proyectos-priorizacion/:id', component: PriorizacionComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
