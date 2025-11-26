import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {NzI18nService} from 'ng-zorro-antd/i18n';
import {LocaleService} from './locale.service';
import {DatePipe} from '@angular/common';
import {credentialsInterceptor} from './auth-tools/credentials.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideHttpClient(withInterceptors([credentialsInterceptor])),
    provideAnimationsAsync(),
    provideRouter(routes),
    DatePipe,
    LocaleService,
    {provide: NzI18nService, useClass: NzI18nService}
  ]
};
