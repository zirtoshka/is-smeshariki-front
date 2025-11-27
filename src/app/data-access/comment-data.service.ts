import {inject, Injectable} from '@angular/core';
import {BaseService} from '../base/base.service';
import {CommentS} from '../model/comment';
import {from, map, Observable} from 'rxjs';
import {PaginatedResponse} from '../paginated-response';

@Injectable({
  providedIn: 'root'
})
export class CommentDataService {
  private readonly baseService = inject(BaseService<CommentS>);

  getComments(postId: number, page: number, pageSize: number): Observable<PaginatedResponse<CommentS>> {
    return this.baseService.getItems<CommentS>('comment', {size: pageSize, page, post: postId}).pipe(
      map(response => ({
        ...response,
        content: response.content.map(data => new CommentS(data))
      }))
    );
  }

  getReplies(parentCommentId: number, page: number, pageSize: number): Observable<PaginatedResponse<CommentS>> {
    return this.baseService.getItems<CommentS>('comment', {
      size: pageSize,
      page,
      comment: parentCommentId
    }).pipe(
      map(response => ({
        ...response,
        content: response.content.map(data => new CommentS(data))
      }))
    );
  }

  getCommentById(id: number): Observable<CommentS> {
    return this.baseService.getItemById<CommentS>('comment', id).pipe(
      map(response => new CommentS(response))
    );
  }

  createComment(comment: CommentS): Observable<CommentS> {
    return from(this.baseService.createItem<CommentS>('comment', comment.toBackendJson())).pipe(
      map(response => new CommentS(response))
    );
  }
}
