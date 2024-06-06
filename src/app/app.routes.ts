import { Routes } from '@angular/router';

export const routes: Routes = [

{
    path: 'login',
    loadComponent: () => import('./views/login/login.component').then((m) => m.LoginComponent),
  },
{
    path: 'homeCliente',
    loadComponent: () => import('./views/home-cliente/home-cliente.component').then((m) => m.HomeClienteComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./views/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'serviceDetail',
    loadComponent: () => import('./views/service-detail/service-detail.component').then((m) => m.ServiceDetailComponent),
  },

    {
    path: 'dashboard',
    loadComponent: () => import('./views/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },

 {
    path: 'PerfilEmpresa',
    loadComponent: () => import('./views/perfil-empresa/perfil-empresa.component').then((m) => m.PerfilEmpresaComponent),
  },

{
    path: 'search',
    loadComponent: () => import('./views/search-filters/search-filters.component').then((m) => m.SearchFiltersComponent),
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
