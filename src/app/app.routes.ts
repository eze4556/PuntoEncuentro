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
        path: 'perfilEmpresa',
        loadComponent: () => import('./components/perfil-empresa/perfil-empresa.component').then((m) => m.PerfilEmpresaComponent),
      },
      {
        path: 'horarios',
        loadComponent: () => import('./components/horarios/horarios.component').then(m => m.ScheduleConfigComponent)
      },
      // {
      //   path: 'account-info',
      //   loadComponent: () => import('./components/account-info/account-info.component').then((m) => m.AccountInfoComponent),
      // },
      // {
      //   path: 'my-appointments',
      //   loadComponent: () => import('./components/my-appointments/my-appointments.component').then((m) => m.MyAppointmentsComponent),
      // },
      {
        path: '',
        redirectTo: 'account-info',
        pathMatch: 'full',
      },
    ],
  },
  // Rutas Cliente
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
