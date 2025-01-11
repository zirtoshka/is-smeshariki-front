import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {SmesharikPageComponent} from './smesharik-page/smesharik-page.component';
import {NotificationPageComponent} from './notification-page/notification-page.component';
import {DoctorPageComponent} from './doctor-page/doctor-page.component';

export const routes: Routes = [
  {path: '', component: DoctorPageComponent, pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'profile', component: SmesharikPageComponent},
  {path: 'notification', component: NotificationPageComponent},

];
