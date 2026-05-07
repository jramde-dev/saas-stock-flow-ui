import {Routes} from '@angular/router';
import {Home} from './features/public/home/home';

export const routes: Routes = [
  {path: '', component: Home, title: 'Home'},
  {
    path: 'login',
    loadComponent: () => import('./features/public/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/public/register/register').then(m => m.Register)
  }
];
