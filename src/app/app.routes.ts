import { Routes } from '@angular/router';
import { Home } from './features/public/home/home';

export const routes: Routes = [
   { path: '', component: Home, title: 'Home' },
   {
      path: 'login',
      title: 'Login',
      loadComponent: () => import('./features/public/login/login').then(m => m.Login)
   },
   {
      path: 'register',
      title: 'Registration',
      loadComponent: () => import('./features/public/register/register').then(m => m.Register)
   },
   {
      path: 'administration',
      title: 'Manage Tenants',
      loadComponent: () => import('./features/admin/tenant-list/tenant-list').then(m => m.TenantList)
   }
];
