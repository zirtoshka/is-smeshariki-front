import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {NotificationService} from './services/notification.service';
import {IGNORE_ERROR_NOTIFICATION_STATUSES, SKIP_ERROR_NOTIFICATION} from './error-handling.tokens';

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (req.context.get(SKIP_ERROR_NOTIFICATION)) {
        return throwError(() => error);
      }
      if (error instanceof HttpErrorResponse) {
        const ignoredStatuses = req.context.get(IGNORE_ERROR_NOTIFICATION_STATUSES);
        if (ignoredStatuses.includes(error.status)) {
          return throwError(() => error);
        }
        notificationService.handleHttpError(error);
      } else {
        notificationService.showError('что-то пошло не так, попробуйте позже.', 'Ошибка');
      }
      return throwError(() => error);
    })
  );
};
