import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { profileGuard } from './core/guards/profile.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'contactos',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/contactos/list/contactos-list.component').then(
            (m) => m.ContactosListComponent
          ),
      },
      {
        path: 'nuevo',
        canActivate: [profileGuard([1, 2])],
        loadComponent: () =>
          import('./features/contactos/form/contacto-form.component').then(
            (m) => m.ContactoFormComponent
          ),
      },
      {
        path: ':id/editar',
        canActivate: [profileGuard([1, 2])],
        loadComponent: () =>
          import('./features/contactos/form/contacto-form.component').then(
            (m) => m.ContactoFormComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: '/login' },
];
