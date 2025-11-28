import {Routes} from '@angular/router';

const loadLoginComponent = () => import('../login/login.component').then(m => m.LoginComponent);
const loadRegistrationComponent = () => import('../registration/registration.component')
  .then(m => m.RegistrationComponent);

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: loadLoginComponent
  },
  {
    path: 'registration',
    loadComponent: loadRegistrationComponent
  }
];
