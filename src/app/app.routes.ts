import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./views/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./views/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./views/profile/profile.component').then((m) => m.ProfileComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'historial-citas',
        loadComponent: () => import('./components/historial-citas/historial-citas.component').then((m) => m.HistorialCitasComponent),
      },
      {
        path: 'historial-resenas',
        loadComponent: () => import('./components/historial-resenas/historial-resenas.component').then((m) => m.HistorialResenasComponent),
      },
      {
        path: 'perfilEmpresa',
        loadComponent: () => import('./components/perfil-empresa/perfil-empresa.component').then((m) => m.PerfilEmpresaComponent),
      },
      {
        path: 'horarios',
        loadComponent: () => import('./components/horarios/horarios.component').then(m => m.ScheduleConfigComponent),
      },
      {
        path: 'crearServicio',
        loadComponent: () => import('./components/create-service/create-service.component').then(m => m.CreateServiceComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'homeCliente',
    loadComponent: () => import('./components/home-cliente/home-cliente.component').then((m) => m.HomeClienteComponent),
  },
  {
    path: 'serviceDetail',
    loadComponent: () => import('./components/service-detail/service-detail.component').then((m) => m.ServiceDetailComponent),
  },
  {
    path: 'cita',
    loadComponent: () => import('./components/cita/cita.component').then((m) => m.CitaComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('./components/search-filters/search-filters.component').then((m) => m.SearchFiltersComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./views/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
