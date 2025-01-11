import {Routes} from '@angular/router';
import {PostComponent} from './post/post.component';
import {SmesharikPageComponent} from './smesharik-page/smesharik-page.component';

export const routes: Routes = [
  {path:'', component: SmesharikPageComponent,  pathMatch: 'full'},
  // {path: '', redirectTo: '/profile', pathMatch: 'full'},
  {path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)},
  {
    path: 'registration',
    loadComponent: () => import('./registration/registration.component').then(m => m.RegistrationComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./smesharik-page/smesharik-page.component').then(m => m.SmesharikPageComponent)
  },
  {
    path: 'notification',
    loadComponent: () => import('./notification-page/notification-page.component').then(m => m.NotificationPageComponent)
  },
  {path: 'doctor', loadComponent: () => import('./doctor-page/doctor-page.component').then(m => m.DoctorPageComponent)},
  {
    path: 'complaint',
    loadComponent: () => import('./complaint-page/complaint-page.component').then(m => m.ComplaintPageComponent)
  },

  {
    path: 'ban',
    loadComponent: () => import('./ban-page/ban-page.component').then(m => m.BanPageComponent)
  },

  // {path: 'registration', component: RegistrationComponent},
  // {path: 'profile', component: SmesharikPageComponent},
  // {path: 'notification', component: NotificationPageComponent},
  // {path: 'doctor', component: DoctorPageComponent},
  // {path: 'complaint', component: ComplaintPageComponent},

];
