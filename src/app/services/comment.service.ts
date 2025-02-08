import {inject, Injectable} from '@angular/core';
import {CommentS} from '../model/comment';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {getAuthToken} from '../auth-tools/auth-utils';
import {BaseService} from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private commentsSubject = new BehaviorSubject<CommentS[]>([]);
  private hasMoreSubject = new BehaviorSubject<boolean>(true);
  private page = 0;
  private readonly pageSize = 2;
  private postId!: number;

  private baseService = inject(BaseService<CommentS>);

  constructor(private http: HttpClient) {
  }

  get comments$(): Observable<CommentS[]> {
    return this.commentsSubject.asObservable();
  }

  /**  observabl, можно ли загружать ещё */
  get hasMore$(): Observable<boolean> {
    return this.hasMoreSubject.asObservable();
  }

  /**первая страница */
  loadComments(postId: number): void {
    this.postId = postId;
    this.page = 0;
    this.commentsSubject.next([]);
    this.hasMoreSubject.next(true);
    this.fetchComments();
  }

  loadMore(): void {
    if (!this.hasMoreSubject.value) return;
    this.page++;
    this.fetchComments();
  }

  private fetchComments(): void {
    this.baseService.getItems("comment", {size: this.pageSize, page: this.page, post: this.postId}
    ).pipe(
      tap(response => {
        if (response.content.length < this.pageSize) {
          this.hasMoreSubject.next(false);
        }
      }),
      map(response => {
        const currentComments = this.commentsSubject.value ?? [];
        return [...currentComments, ...response.content as CommentS[]];
      })
    )
      .subscribe({
        next: (updatedComments) => this.commentsSubject.next(updatedComments),
        error: (err) => console.error('Ошибка загрузки комментариев:', err)
      });

    console.log(this.commentsSubject.value);
  }


  getCommentsByPostId(postId: number | null) {

    if (postId == null) {
      return [];
    }
    return this.commentsSubject.asObservable()
    // return this.comments.filter((com) => com.postId === postId);
  }

  getCommentsById(id: number | null) {
    if (id != null) {
      // return this.comments.filter((comment) => comment.id != id)[0];
    }
    return;
  }

  groupComments(comments: CommentS[]) {
    const map: { [key: string]: CommentS[] } = {};
    comments.forEach((comment: CommentS) => {
      const parentId = 0
      // comment.commentId !== null ? comment.commentId?.toString() : 'null';
      if (!map[parentId]) {
        map[parentId] = [];
      }
      map[parentId].push(comment);
    });
    const buildCommentTree = (parentId: string): any[] => {
      return (map[parentId] || []).map((comment: CommentS) => {
        return {
          rootComment: comment,
          childComments: buildCommentTree(comment.id.toString()),
        };
      });
    };
    return buildCommentTree('null');
  }
}
