import {inject, Injectable} from '@angular/core';
import {BaseService} from '../base/base.service';
import {catchError, map, Observable, of} from 'rxjs';
import {HttpContext, HttpErrorResponse} from '@angular/common/http';
import {IGNORE_ERROR_NOTIFICATION_STATUSES} from '../error-handling.tokens';

@Injectable({
  providedIn: 'root'
})
export class CarrotDataService {
  private baseService = inject(BaseService);

  isLiked(params: { post?: number; comment?: number }): Observable<boolean> {
    const context = new HttpContext().set(IGNORE_ERROR_NOTIFICATION_STATUSES, [404]);
    return this.baseService.getMessageByParams(`carrot/check`, params, {context}).pipe(
      map((response) => response.message.includes('выставлен')),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(false);
        }
        return of(false);
      })
    );
  }

  setCarrot(params: { post?: number; comment?: number }) {
    return this.baseService.postWithParams(`carrot`, params).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  deleteCarrot(params: { post?: number; comment?: number }) {
    return this.baseService.deleteWithParams(`carrot`, params).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
