import {DestroyRef, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {PostDataService} from '../data-access/post-data.service';
import {Post} from '../model/post';
import {NotificationService} from '../services/notification.service';
import {AuthorService} from '../author.service';
import {forkJoin, map, Observable, of, switchMap} from 'rxjs';
import {toObservable, takeUntilDestroyed} from '@angular/core/rxjs-interop';

type PostFacadeMode = 'feed' | 'diary';

@Injectable({
  providedIn: 'any'
})
export class PostFacade {
  private readonly postDataService = inject(PostDataService);
  private readonly notificationService = inject(NotificationService);
  private readonly authorService = inject(AuthorService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly postsSignal: WritableSignal<Post[]> = signal<Post[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal(false);
  private readonly allLoadedSignal = signal(false);

  readonly posts$ = toObservable(this.postsSignal.asReadonly());
  readonly loading$ = toObservable(this.loadingSignal.asReadonly());
  readonly error$ = toObservable(this.errorSignal.asReadonly());
  readonly allLoaded$ = toObservable(this.allLoadedSignal.asReadonly());

  private mode: PostFacadeMode | null = null;
  private page = 0;
  private size = 2;
  private filter = '';

  initFeed(query: string = ''): void {
    this.setupMode('feed', 2, query);
  }

  updateFeedQuery(query: string): void {
    if (this.mode !== 'feed') {
      this.setupMode('feed', this.size, query);
      return;
    }
    this.filter = query;
    this.resetState();
    this.fetchPosts();
  }

  initDiary(size: number = 4): void {
    this.setupMode('diary', size);
  }

  loadNext(): void {
    this.fetchPosts();
  }

  private setupMode(mode: PostFacadeMode, size: number, query: string = ''): void {
    this.mode = mode;
    this.size = size;
    this.filter = mode === 'feed' ? query : '';
    this.resetState();
    this.fetchPosts();
  }

  private resetState(): void {
    this.postsSignal.set([]);
    this.page = 0;
    this.allLoadedSignal.set(false);
    this.errorSignal.set(false);
  }

  private fetchPosts(): void {
    if (!this.mode || this.loadingSignal() || this.allLoadedSignal()) {
      return;
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(false);
    const request$ = this.mode === 'feed'
      ? this.postDataService.getFeed({page: this.page, size: this.size, filter: this.filter})
      : this.postDataService.getDiary({page: this.page, size: this.size});

    request$.pipe(
      switchMap(response =>
        this.attachAuthors(response.content).pipe(
          map(posts => ({response, posts}))
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: ({response, posts}) => {
        const updatedList = this.page === 0 ? posts : [...this.postsSignal()];
        if (this.page > 0) {
          posts.forEach(post => {
            if (!updatedList.some(existing => existing.id === post.id)) {
              updatedList.push(post);
            }
          });
        }
        if (this.page === 0) {
          this.postsSignal.set(posts);
        } else {
          this.postsSignal.set(updatedList);
        }

        this.page++;
        if (response.content.length < this.size ||
          response.totalPages === (response.currentPage + 1)) {
          this.allLoadedSignal.set(true);
        }
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.loadingSignal.set(false);
        this.errorSignal.set(true);
        this.notificationService.handleErrorAsync(err, 'Держите меня, я падаю…');
      }
    });
  }

  private attachAuthors(posts: Post[]): Observable<Post[]> {
    if (!posts.length) {
      return of([]);
    }
    return forkJoin(posts.map(post =>
      this.authorService.getSmesharikByLogin(post.author).pipe(
        map(author => {
          post.smesharikAuthor = author;
          return post;
        })
      )
    ));
  }
}
