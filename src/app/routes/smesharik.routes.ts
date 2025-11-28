import {Routes} from '@angular/router';

const loadSmesharik = () => import('../smesharik/smesharik.component').then(m => m.SmesharikComponent);

export const SMESHARIK_ROUTES: Routes = [
  {
    path: 'smesharik/:id',
    loadComponent: loadSmesharik
  }
];
