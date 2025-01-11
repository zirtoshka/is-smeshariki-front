import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {SmesharikPageComponent} from './smesharik-page/smesharik-page.component';

export const routes: Routes = [
  {path: '', component: SmesharikPageComponent, pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'profile', component: SmesharikPageComponent},

];
