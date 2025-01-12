import {Routes} from '@angular/router';
import {PostComponent} from './post/post.component';
import {SmesharikPageComponent} from './my-smesharik-page/smesharik-page.component';

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
    loadComponent: () => import('./my-smesharik-page/smesharik-page.component').then(m => m.SmesharikPageComponent)
  },
  {
    path: 'notification',
    loadComponent: () => import('./notification-page/notification-page.component').then(m => m.NotificationPageComponent)
  },
  {path: 'doctor', loadComponent: () => import('./application/doctor-page/doctor-page.component').then(m => m.DoctorPageComponent)},
  {
    path: 'complaint',
    loadComponent: () => import('./complaint/complaint-page/complaint-page.component').then(m => m.ComplaintPageComponent)
  },

  {
    path: 'ban',
    loadComponent: () => import('./ban/ban-page/ban-page.component').then(m => m.BanPageComponent)
  },

  {
    path: 'friends',
    loadComponent: () => import('./friend/friend-page/friend-page.component').then(m => m.FriendPageComponent)
  },
  {
    path: 'friendrequests',
    loadComponent: () => import('./friend/friend-requests-page/friend-requests-page.component').then(m => m.FriendRequestsPageComponent)
  },
  {
    path: 'propensity',
    loadComponent: () => import('./propensity/propensity-page/propensity-page.component').then(m => m.PropensityPageComponent)
  },
  {
    path: 'diary',
    loadComponent: () => import('./diary/diary.component').then(m => m.DiaryComponent)
  },

  {
    path: 'feed',
    loadComponent: () => import('./feed/feed.component').then(m => m.FeedComponent)
  },

  {
    path: 'post/:id',
    loadComponent: () => import('./post/post.component').then(m => m.PostComponent),
  },
  // {path: 'registration', component: RegistrationComponent},
  // {path: 'profile', component: SmesharikPageComponent},
  // {path: 'notification', component: NotificationPageComponent},
  // {path: 'doctor', component: DoctorPageComponent},
  // {path: 'complaint-card', component: ComplaintPageComponent},

];
