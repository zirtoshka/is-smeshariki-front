import {inject, Injectable} from '@angular/core';
import {Carrot} from '../model/carrot';
import {BaseService} from '../base/base.service';
import {catchError, map, Observable, of} from 'rxjs';
import {HttpContext, HttpErrorResponse} from '@angular/common/http';
import {IGNORE_ERROR_NOTIFICATION_STATUSES} from '../error-handling.tokens';

@Injectable({
  providedIn: 'root'
})
export class CarrotService {
  carrots: Carrot[] = Array.from({length: 100}, (_, i) => {
    const id = i + 1;
    const smesharikId = Math.floor(Math.random() * 50) + 1;
    const dataId = Math.floor(Math.random() * 50) + 1;
    const postOrComment = Math.random() < 0.5;
    const postId = postOrComment ? dataId : null;
    const commentId = postOrComment ? null : dataId;
    const creationDate = new Date(Date.now() - id * 10000000).toISOString();

    return new Carrot(id, smesharikId, postId, commentId, creationDate);
  });

  private baseService = inject(BaseService);

  getCarrotCountPost(postId: number | null) {
    if (postId == null) {
      return 0;
    }
    return this.carrots.filter((carrot) => carrot.postId === postId).length;
  }

  getCarrotCountComment(commentId: number | null) {
    if (commentId == null) {
      return 0;
    }
    return this.carrots.filter((carrot) => carrot.commentId === commentId).length;
  }


  isLikePost(id: number): Observable<boolean> {
    const params = {post: id};
    return this.isLiked(params)
  }

  isLikeComment(id: number): Observable<boolean> {
    const params = {comment: id};
    return this.isLiked(params);
  }

  isLiked(params: any): Observable<boolean> {
    const context = new HttpContext().set(IGNORE_ERROR_NOTIFICATION_STATUSES, [404]);
    return this.baseService.getMessageByParams(`carrot/check`, params, {context}).pipe(
      map((response) => response.message.includes("выставлен")),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(false);
        }
        return of(false);
      })
    );
  }

  setCarrotOnPost(id: number) {
    const params = {post: id};
    return this.baseService.postWithParams(`carrot`, params).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  deleteCarrotOnPost(id: number) {
    const params = {post: id};
    return this.baseService.deleteWithParams(`carrot`, params).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  setCarrotOnComment(id: number) {
    const params = {comment: id};
    return this.baseService.postWithParams(`carrot`, params).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  deleteCarrotOnComment(id: number) {
    const params = {comment: id};
    return this.baseService.deleteWithParams(`carrot`, params).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
