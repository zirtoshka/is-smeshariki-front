import {CanActivateFn, CanMatchFn, Router, Routes, UrlSegment} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './auth-tools/auth.service';


const authGuard: CanActivateFn = (route, state) => {
  if (inject(AuthService).isLoggedIn) return true;
  inject(Router).navigate(['login']);
  return true;
}
const notAuth: CanActivateFn = (route, state) => {
  if (!inject(AuthService).isLoggedIn) return true;
  inject(Router).navigate(['profile']);
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

const matchFirstSegment = (paths: string[]): CanMatchFn => {
  const allowed = new Set(paths);
  return (_, segments: UrlSegment[]) => {
    const first = segments[0]?.path ?? '';
    return allowed.has(first);
  };
};

const profileMatcher = matchFirstSegment(['', 'profile']);
const authPagesMatcher = matchFirstSegment(['login', 'registration']);
const friendMatcher = matchFirstSegment(['friends', 'friendrequests', 'friendfromme', 'smeshsearch']);
const timelineMatcher = matchFirstSegment(['diary', 'feed', 'post-card', 'comment', 'post-form']);
const smesharikMatcher = matchFirstSegment(['smesharik']);
const adminMatcher = matchFirstSegment(['complaint', 'ban', 'word', 'propensity']);

export const routes: Routes = [
  {
    path: '',
    canMatch: [profileMatcher],
    canActivate: [authGuard],
    loadChildren: () => import('./routes/profile.routes').then(m => m.PROFILE_ROUTES)
  },
  {
    path: '',
    canMatch: [authPagesMatcher],
    canActivate: [notAuth],
    loadChildren: () => import('./routes/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    canMatch: [friendMatcher],
    canActivate: [authGuard],
    loadChildren: () => import('./routes/friends.routes').then(m => m.FRIEND_ROUTES)
  },
  {
    path: '',
    canMatch: [timelineMatcher],
    canActivate: [authGuard],
    loadChildren: () => import('./routes/timeline.routes').then(m => m.TIMELINE_ROUTES)
  },
  {
    path: '',
    canMatch: [smesharikMatcher],
    canActivate: [authGuard],
    loadChildren: () => import('./routes/smesharik.routes').then(m => m.SMESHARIK_ROUTES)
  },
  {
    path: '',
    canMatch: [adminMatcher],
    canActivate: [isAdmin],
    loadChildren: () => import('./routes/admin.routes').then(m => m.ADMIN_ROUTES)
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
  }
];
