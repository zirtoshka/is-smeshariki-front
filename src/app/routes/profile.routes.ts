import {Routes} from '@angular/router';

const loadSmesharikPage = () => import('../my-smesharik-page/smesharik-page.component')
  .then(m => m.SmesharikPageComponent);

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: loadSmesharikPage
  },
  {
    path: 'profile',
    loadComponent: loadSmesharikPage
  }
];
