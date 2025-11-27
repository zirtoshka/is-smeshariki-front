import {inject, Injectable} from '@angular/core';
import {CommentS} from '../model/comment';
import {BehaviorSubject, forkJoin, map, mergeMap, Observable, switchMap, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../base/base.service';
import {CarrotService} from './carrot.service';
import {AuthorService} from '../author.service';
import {NotificationService} from './notification.service';

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
  private notificationService = inject(NotificationService);

  private replyPages = new Map<number, number>(); // счетчик страниц для каждого комментария
  hasMoreRepliesMap = new Map<number, boolean>(); // для проверки, есть ли еще ответы для каждого комментария

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

  // getHasMoreReplies(id:number): boolean {
  //   return this.hasMoreRepliesMap.has(id);
  // }

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
        if (response.content.length < this.pageSize ||
          response.totalPages === (response.currentPage + 1)) {
          this.hasMoreSubject.next(false);
        }


      }),
      mergeMap(response => {
        const comments = response.content.map(data => new CommentS(data));
        const likedRequest = comments.map(comment =>
          this.carrotService.isLikeComment(comment.id).pipe(
            map(isLiked => {
                comment.isLiked = isLiked;
                return comment;
              }
            )
          ));
        return forkJoin(likedRequest);
      }),
      mergeMap(updatedComments => {
        const authorRequest = updatedComments.map(comment =>
          this.authorService.getSmesharikByLogin(comment.smesharik).pipe(
            map(author => {
                comment.smesharikAuthor = author;
                return comment;
              }
            )
          ));

        return forkJoin(authorRequest);
      }),
      map(updatedCommentsWithAuthors => {
        const currentComments = this.commentsSubject.value ?? [];
        const newComments = updatedCommentsWithAuthors.filter(
          newReply => !currentComments.some(existing => existing.id === newReply.id)
        ); //todo
        return [...currentComments, ...newComments];
      })
    )
      .subscribe({
        next: (updatedComments) => this.commentsSubject.next(updatedComments),
        error: () => this.notificationService.showError('Ошибка загрузки комментариев')
      });
  }

  loadMoreReplies(parentId: number): void {
    let currentPage: number = 0;
    if (this.replyPages.get(parentId) !== undefined) {
      currentPage = this.replyPages.get(parentId) ?? 0;
      currentPage++;
    }
    this.replyPages.set(parentId, currentPage);
    this.loadReplies(parentId);
  }

  loadReplies(parentId: number): void {
    if (this.hasMoreRepliesMap.has(parentId)) {
      return
    }

    const currPage = this.replyPages.get(parentId) ?? 0;

    this.baseService.getItems("comment", {size: this.pageSize, page: currPage, comment: parentId}
    ).pipe(
      map(response => response),
      tap(replies => {
        if (replies.content.length < this.pageSize) {
          this.hasMoreRepliesMap.set(parentId, false);
        }
        if (replies.totalPages === (replies.currentPage + 1)) {
          this.hasMoreRepliesMap.set(parentId, false);
        }
      }),
      mergeMap(response => {
        const replies = response.content.map(data => new CommentS(data));
        const likedRequest = replies.map(reply =>
          this.carrotService.isLikeComment(reply.id).pipe(
            map(isLiked => {
                reply.isLiked = isLiked;
                return reply;
              }
            )
          ));
        return forkJoin(likedRequest);
      }),
      mergeMap(updatedReplies => {
        const authorRequest = updatedReplies.map(comment =>
          this.authorService.getSmesharikByLogin(comment.smesharik).pipe(
            map(author => {
                comment.smesharikAuthor = author;
                return comment;
              }
            )
          ));
        return forkJoin(authorRequest);

      }),
      map(updatedRepliesWithAuthors => {
        const currentTree = new Map(this.commentTreeSubject.value);
        const existingReplies = currentTree.get(parentId) || [];
        const newReplies = updatedRepliesWithAuthors.filter(
          newReply => !existingReplies.some(existing => existing.id === newReply.id)
        );
        return currentTree.set(parentId, [...existingReplies, ...newReplies]);
      })).subscribe({
      next: (updatedTree) => this.commentTreeSubject.next(updatedTree),
      error: () => this.notificationService.showError(`Ошибка загрузки ответов для комментария ${parentId}`)
    });
  }

  createComment(comment: CommentS, parentId: number | null = null) {
    const data = comment.toBackendJson()
    this.baseService.createItem<CommentS>("comment", data).then(r => {
        if (parentId !== null) {
          // Добавляем новый комментарий в дерево под родительский комментарий
          this.addReplyToTree(parentId, r);
        } else {
          // Если это новый комментарий, добавляем его в общий список
          this.addCommentToTree(r);
        }
      }
    );
  }

  private addCommentToTree(newComment: CommentS): void {
    const currentComments = this.commentsSubject.value ?? [];

    this.carrotService.isLikeComment(newComment.id).pipe(
      switchMap(isLiked => {
        newComment.isLiked = isLiked;
        return this.authorService.getSmesharikByLogin(newComment.smesharik);
      })
    ).subscribe({
      next: author => {
        newComment.smesharikAuthor = author;
        if (!currentComments.some(comment => comment.id === newComment.id)) {
          this.commentsSubject.next([newComment,...currentComments]);
        }
      },
      error: () => this.notificationService.showError(`Ошибка загрузки данных для комментария ${newComment.id}`)
    });
  }

  private addReplyToTree(parentId: number, newComment: CommentS): void {
    const currentTree = new Map(this.commentTreeSubject.value);
    const existingReplies = currentTree.get(parentId) || [];

    this.carrotService.isLikeComment(newComment.id).pipe(
      switchMap(isLiked => {
        newComment.isLiked = isLiked;
        return this.authorService.getSmesharikByLogin(newComment.smesharik);
      })
    ).subscribe({
      next: author => {
        newComment.smesharikAuthor = author;
        existingReplies.push(newComment);
        currentTree.set(parentId, existingReplies);
        this.commentTreeSubject.next(currentTree);
      },
      error: () => this.notificationService.showError(`Ошибка загрузки данных для комментария ${newComment.id}`)
    });
  }

  getCommentsByPostId(postId: number | null) {
    if (postId == null) {
      return [];
    }
    return this.commentsSubject.asObservable()
    // return this.comments.filter((com) => com.postId === postId);
  }

  getCommentsById(id: number):Observable<CommentS> {
      return this.baseService.getItemById("comment", id);
      // return this.posts.filter(i=> i.id==id)[0];
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
