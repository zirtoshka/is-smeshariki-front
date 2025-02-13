import {CanActivateFn, Router, Routes} from '@angular/router';
import {SmesharikPageComponent} from './my-smesharik-page/smesharik-page.component';
import {inject} from '@angular/core';
import {AuthService} from './auth-tools/auth.service';


const authGuard: CanActivateFn = (route, state) => {
  if (inject(AuthService).isLoggedIn) return true;
  inject(Router).navigate(['login']);
  return true;
}
const isDoctor: CanActivateFn = (route, state) => {
  if (inject(AuthService).isDoctor) return true;
  inject(Router).navigate(['profile']);
  return true;
}
const isAdmin: CanActivateFn = (route, state) => {
  if (inject(AuthService).isAdmin) return true;
  inject(Router).navigate(['profile']);
  return true;
}
export const routes: Routes = [
  {path: '', component: SmesharikPageComponent, pathMatch: 'full'},
  // {path: '', redirectTo: '/profile', pathMatch: 'full'},
  {path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)},
  {
    path: 'registration',
    loadComponent: () => import('./registration/registration.component').then(m => m.RegistrationComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./my-smesharik-page/smesharik-page.component').then(m => m.SmesharikPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'notification',
    loadComponent: () => import('./notification-page/notification-page.component').then(m => m.NotificationPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'doctor',
    loadComponent: () => import('./application/doctor-page/doctor-page.component').then(m => m.DoctorPageComponent),
    canActivate: [isDoctor]
  },
  {
    path: 'complaint',
    loadComponent: () => import('./complaint/complaint-page/complaint-page.component').then(m => m.ComplaintPageComponent),
    canActivate: [isAdmin]
  },

  {
    path: 'ban',
    loadComponent: () => import('./ban/ban-page/ban-page.component').then(m => m.BanPageComponent),
    canActivate: [isAdmin]
  },

  {
    path: 'word',
    loadComponent: () => import('./trigger-word/word-page/word-page.component').then(m => m.WordPageComponent),
    canActivate: [isAdmin]
  },

  {
    path: 'friends',
    loadComponent: () => import('./friend/friend-page/friend-page.component').then(m => m.FriendPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'friendrequests',
    loadComponent: () => import('./friend/friend-requests-page/friend-requests-page.component').then(m => m.FriendRequestsPageComponent),
    canActivate: [authGuard]

  },
  {
    path: 'propensity',
    loadComponent: () => import('./propensity/propensity-page/propensity-page.component').then(m => m.PropensityPageComponent),
    canActivate: [isAdmin]

  },
  {
    path: 'diary',
    loadComponent: () => import('./diary/diary.component').then(m => m.DiaryComponent),
    canActivate: [authGuard]

  },

  {
    path: 'feed',
    loadComponent: () => import('./feed/feed.component').then(m => m.FeedComponent),
    canActivate: [authGuard]

  },

  {
    path: 'post-card/:id',
    loadComponent: () => import('./post-card/post-card.component').then(m => m.PostCardComponent),
    canActivate: [authGuard]

  },

  {
    path: 'comment/:id',
    loadComponent: () => import('./comment-card2/comment-card2.component').then(m => m.CommentCard2Component),
    canActivate: [authGuard]

  },

  {
    path: 'post-form',
    loadComponent: () => import('./post-form/post-form.component').then(m => m.PostFormComponent),
    canActivate: [authGuard]

  },

  {
    path: 'smeshsearch',
    loadComponent: () => import('./friend/smeshariki-search-page/smeshariki-search-page.component').then(m => m.SmesharikiSearchPageComponent),
    canActivate: [authGuard]

  },

];
