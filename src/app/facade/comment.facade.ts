import {DestroyRef, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {CommentDataService} from '../data-access/comment-data.service';
import {CommentS} from '../model/comment';
import {CarrotService} from '../services/carrot.service';
import {AuthorService} from '../author.service';
import {NotificationService} from '../services/notification.service';
import {forkJoin, map, Observable, of, switchMap, tap} from 'rxjs';
import {PaginatedResponse} from '../paginated-response';
import {toObservable, takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'any'
})
export class CommentFacade {
  private readonly commentDataService = inject(CommentDataService);
  private readonly carrotService = inject(CarrotService);
  private readonly authorService = inject(AuthorService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly commentsSignal: WritableSignal<CommentS[]> = signal<CommentS[]>([]);
  private readonly commentTreeSignal: WritableSignal<Map<number, CommentS[]>> =
    signal<Map<number, CommentS[]>>(new Map<number, CommentS[]>());
  private readonly hasMoreSignal = signal(true);

  readonly comments$ = toObservable(this.commentsSignal.asReadonly());
  readonly commentTree$ = toObservable(this.commentTreeSignal.asReadonly());
  readonly hasMore$ = toObservable(this.hasMoreSignal.asReadonly());

  private readonly pageSize = 2;
  private currentPage = 0;
  private postId?: number;

  private readonly replyPages = new Map<number, number>();
  readonly hasMoreRepliesMap = new Map<number, boolean>();

  loadComments(postId: number): void {
    this.postId = postId;
    this.currentPage = 0;
    this.replyPages.clear();
    this.hasMoreRepliesMap.clear();
    this.commentsSignal.set([]);
    this.commentTreeSignal.set(new Map());
    this.hasMoreSignal.set(true);
    this.fetchComments(0, true);
  }

  loadMore(): void {
    if (!this.hasMoreSignal()) {
      return;
    }
    this.currentPage++;
    this.fetchComments(this.currentPage);
  }

  private fetchComments(page: number, replace = false): void {
    if (this.postId == null) {
      return;
    }

    this.commentDataService.getComments(this.postId, page, this.pageSize).pipe(
      tap(response => this.updateHasMore(response)),
      map(response => response.content),
      switchMap(comments => this.enrichComments(comments)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: updatedComments => {
        if (replace) {
          this.commentsSignal.set(updatedComments);
          return;
        }
        const current = [...this.commentsSignal()];
        updatedComments.forEach(newComment => {
          if (!current.some(existing => existing.id === newComment.id)) {
            current.push(newComment);
          }
        });
        this.commentsSignal.set(current);
      },
      error: () => this.notificationService.showError('Ошибка загрузки комментариев')
    });
  }

  private updateHasMore(response: PaginatedResponse<CommentS>): void {
    const noMore = response.content.length < this.pageSize ||
      response.totalPages === (response.currentPage + 1);
    this.hasMoreSignal.set(!noMore);
  }

  loadMoreReplies(parentId: number): void {
    let currentPage = 0;
    if (this.replyPages.has(parentId)) {
      currentPage = (this.replyPages.get(parentId) ?? 0) + 1;
    }
    this.replyPages.set(parentId, currentPage);
    this.loadReplies(parentId);
  }

  loadReplies(parentId: number): void {
    if (this.hasMoreRepliesMap.has(parentId)) {
      return;
    }
    const currentPage = this.replyPages.get(parentId) ?? 0;

    this.commentDataService.getReplies(parentId, currentPage, this.pageSize).pipe(
      tap(response => {
        const isLastPage = response.content.length < this.pageSize ||
          response.totalPages === (response.currentPage + 1);
        if (isLastPage) {
          this.hasMoreRepliesMap.set(parentId, false);
        }
      }),
      map(response => response.content),
      switchMap(replies => this.enrichComments(replies)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: replies => {
        const tree = new Map(this.commentTreeSignal());
        const existingReplies = tree.get(parentId) ?? [];
        const mergedReplies = [...existingReplies];
        replies.forEach(reply => {
          if (!mergedReplies.some(existing => existing.id === reply.id)) {
            mergedReplies.push(reply);
          }
        });
        tree.set(parentId, mergedReplies);
        this.commentTreeSignal.set(tree);
      },
      error: () => this.notificationService.showError(`Ошибка загрузки ответов для комментария ${parentId}`)
    });
  }

  createComment(comment: CommentS, parentId: number | null = null): void {
    this.commentDataService.createComment(comment).pipe(
      switchMap(createdComment => this.enrichComments([createdComment])),
      map(enriched => enriched[0]),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: enrichedComment => {
        if (parentId !== null) {
          this.addReplyToTree(parentId, enrichedComment);
        } else {
          this.prependComment(enrichedComment);
        }
      },
      error: () => this.notificationService.showError('Ошибка при создании комментария')
    });
  }

  getCommentsByPostId(postId: number | null): Observable<CommentS[]> {
    if (postId == null) {
      return of([]);
    }
    return this.comments$;
  }

  getCommentsById(id: number): Observable<CommentS> {
    return this.commentDataService.getCommentById(id);
  }

  groupComments(comments: CommentS[]) {
    const map: { [key: string]: CommentS[] } = {};
    comments.forEach((comment: CommentS) => {
      const parentId = 0;
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

  private enrichComments(comments: CommentS[]): Observable<CommentS[]> {
    if (!comments.length) {
      return of([]);
    }
    return forkJoin(comments.map(comment => this.decorateComment(comment)));
  }

  private decorateComment(comment: CommentS): Observable<CommentS> {
    return forkJoin({
      isLiked: this.carrotService.isLikeComment(comment.id),
      author: this.authorService.getSmesharikByLogin(comment.smesharik)
    }).pipe(
      map(({isLiked, author}) => {
        comment.isLiked = isLiked;
        comment.smesharikAuthor = author;
        return comment;
      })
    );
  }

  private prependComment(newComment: CommentS): void {
    const currentComments = this.commentsSignal();
    if (currentComments.some(comment => comment.id === newComment.id)) {
      return;
    }
    this.commentsSignal.set([newComment, ...currentComments]);
  }

  private addReplyToTree(parentId: number, newComment: CommentS): void {
    const tree = new Map(this.commentTreeSignal());
    const replies = tree.get(parentId) ?? [];
    replies.push(newComment);
    tree.set(parentId, replies);
    this.commentTreeSignal.set(tree);
  }
}
