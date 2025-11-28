import {Routes} from '@angular/router';

const loadComplaint = () => import('../complaint/complaint-page/complaint-page.component')
  .then(m => m.ComplaintPageComponent);
const loadBan = () => import('../ban/ban-page/ban-page.component').then(m => m.BanPageComponent);
const loadWord = () => import('../trigger-word/word-page/word-page.component').then(m => m.WordPageComponent);
const loadPropensity = () => import('../propensity/propensity-page/propensity-page.component')
  .then(m => m.PropensityPageComponent);

export const ADMIN_ROUTES: Routes = [
  {
    path: 'complaint',
    loadComponent: loadComplaint
  },
  {
    path: 'ban',
    loadComponent: loadBan
  },
  {
    path: 'word',
    loadComponent: loadWord
  },
  {
    path: 'propensity',
    loadComponent: loadPropensity
  }
];
