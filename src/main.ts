import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/ru';

registerLocaleData(en);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

