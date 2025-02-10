import {inject, Injectable} from '@angular/core';
import {CommentS} from '../model/comment';
import {BehaviorSubject, forkJoin, map, mergeMap, Observable, tap, withLatestFrom} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {getAuthToken} from '../auth-tools/auth-utils';
import {BaseService} from '../base/base.service';
import {CarrotService} from './carrot.service';
import {AuthorService} from '../author.service';

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
  protected carrotService = inject(CarrotService);
  protected authorService = inject(AuthorService);


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
      mergeMap(response => {
        const comments = response.content as CommentS[];
        const likedRequest = comments.map(comment =>
          this.carrotService.isLikeComment(comment.id).pipe(
            map(isLiked => ({...comment, isLiked}))
          ));
        return forkJoin(likedRequest);
      }),
      mergeMap(updatedComments => {
        const authorRequest = updatedComments.map(comment =>
        this.authorService.getSmesharikByLogin(comment.smesharik).pipe(
          map(author => ({...comment,smesharikAuthor: author}))
        ));

        return forkJoin(authorRequest);
      }),
      map(updatedCommentsWithAuthors => {
        const currentComments = this.commentsSubject.value ?? [];
        return [...currentComments, ...updatedCommentsWithAuthors];
      })
    )
      .subscribe({
        next: (updatedComments) => this.commentsSubject.next(updatedComments),
        error: (err) => console.error('Ошибка загрузки комментариев:', err)
      });
  }

  loadReplies(parentId: number): void {
    console.log("loadreplie in service for " + parentId)
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
      mergeMap(response => {
        const replies = response as CommentS[];
        const likedRequest = replies.map(reply =>
          this.carrotService.isLikeComment(reply.id).pipe(
            map(isLiked => ({...reply, isLiked}))
          ));
        return forkJoin(likedRequest);
      }),
      mergeMap(updatedReplies=>{
        const authorRequest = updatedReplies.map(comment =>
          this.authorService.getSmesharikByLogin(comment.smesharik).pipe(
            map(author=>({...comment, smesharikAuthor: author}))
          ));
        return forkJoin(authorRequest);

      }),
      map(updatedRepliesWithAuthors => {
        const currentTree = new Map(this.commentTreeSubject.value);
        const existingReplies = currentTree.get(parentId) || [];
        return currentTree.set(parentId, [...existingReplies, ...updatedRepliesWithAuthors]);
      })).subscribe({
      next: (updatedTree) => this.commentTreeSubject.next(updatedTree),
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
