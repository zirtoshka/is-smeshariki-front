import {inject, Injectable} from '@angular/core';
import {CommentS} from '../model/comment';
import {BehaviorSubject, map, Observable, tap, withLatestFrom} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {getAuthToken} from '../auth-tools/auth-utils';
import {BaseService} from '../base/base.service';

@Injectable({
  providedIn: 'any'
})
export class CommentService {
  private commentsSubject = new BehaviorSubject<CommentS[]>([]);
  private hasMoreSubject = new BehaviorSubject<boolean>(true);
  private commentTreeSubject = new BehaviorSubject<Map<number, CommentS[]>>(new Map());

  private page = 0;
  private readonly pageSize = 2;
  private postId!: number;

  private baseService = inject(BaseService<CommentS>);


  private replyPages = new Map<number, number>(); // счетчик страниц для каждого комментария
  private hasMoreRepliesMap = new Set<number>();


  constructor(private http: HttpClient) {
  }

  get comments$(): Observable<CommentS[]> {
    return this.commentsSubject.asObservable();
  }

  get commentTree$(): Observable<Map<number, CommentS[]>> {
    return this.commentTreeSubject.asObservable();
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
    this.commentTreeSubject.next(new Map());
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

  loadReplies(parentId: number): void {
    console.log("loadreplie in service for "+ parentId)
    const currentPage = this.replyPages.get(parentId) ?? 0;

    if (this.hasMoreRepliesMap.has(parentId)) return; // Все ответы загружены

    this.baseService.getItems("comment", {size: this.pageSize, page: currentPage, comment: parentId}
    ).pipe(
      map(response => response.content),
      tap(replies => {
        if (replies.length < this.pageSize) {
          this.hasMoreRepliesMap.add(parentId);
        }
      }),
      map(response => response)
    ). subscribe({
      next: (newReplies) => {
      const currentTree = new Map(this.commentTreeSubject.value);
      const existingReplies = currentTree.get(parentId) || [];
      currentTree.set(parentId, [...existingReplies as CommentS[], ...newReplies as CommentS[]]);

      this.commentTreeSubject.next(currentTree);
      this.replyPages.set(parentId, currentPage + 1);
    },
      error: (err) => console.error(`Ошибка загрузки ответов для ${parentId}:`, err)
  });
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
