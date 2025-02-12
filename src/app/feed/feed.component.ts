import {AfterViewInit, Component, ElementRef, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {PostService} from '../services/post.service';
import {PostCardComponent} from '../post-card/post-card.component';
import {BanCardComponent} from '../ban/ban-card/ban-card.component';
import {NotificationCustomService} from '../notification-custom.service';
import {Post} from '../model/post';
import {SearchFilterComponent} from '../search-filter/search-filter.component';
import {AuthorService} from '../author.service';
import {forkJoin, map} from 'rxjs';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    PostCardComponent,
    BanCardComponent,
    SearchFilterComponent
  ],
  providers: [PostService],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent implements OnInit, AfterViewInit {
  items: any[] = [];

  loading = false;
  error = false;

  searchQuery: string = '';

  page = 0; // Текущая страница
  allLoaded = false; // Флаг окончания подгрузки


  @ViewChild('scrollTrigger', {static: false}) scrollTrigger!: ElementRef;
  private observer!: IntersectionObserver;

  protected notificationCustomService = inject(NotificationCustomService);
  protected postService = inject(PostService);
  protected authorService = inject(AuthorService);


  ngOnInit(): void {
    this.fetchPosts();
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.scrollTrigger) {
        this.observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && !this.loading && !this.allLoaded) {
            this.fetchPosts();
          }
        }, { threshold: 1.0 });

        this.observer.observe(this.scrollTrigger.nativeElement);
      }
    }, 0);

  }

  fetchPosts(replacementIsNeeded: boolean = false): void {
    if (this.loading) return;

    this.loading = true;

    this.postService.getFeed({
      page: this.page,
      filter: this.searchQuery,
    }).subscribe({
      next: (response) => {
        const newItems = response.content.map(data => Post.fromBackend(data));
        this.fetchHelper(newItems, replacementIsNeeded);

        if (response.totalPages - response.currentPage === 1) {
          this.allLoaded = true;
        }
      },
      error: (err: any) => {
        console.error('Ошибка при загрузке:', err);
        this.notificationCustomService.handleErrorAsync(err, 'Держите меня, я падаю…');
        this.loading = false;
      }
    });
  }

  fetchHelper(newItems: Post[], replacementIsNeeded: boolean = false): void {
    if (replacementIsNeeded) {
      this.items = [];
      this.page = 0;
    }

    let uniqueNewItems = newItems.filter(
      newItem => !this.items.some(existingItem => existingItem.id === newItem.id)
    );

    if (uniqueNewItems.length) {

      const authorRequests = uniqueNewItems.map(item =>

        this.authorService.getSmesharikByLogin(item.author).pipe(
          map(author => ({...item, smesharikAuthor: null})
          )
        )

      );

      forkJoin(authorRequests).subscribe(updatedItems => {
        this.items.push(...updatedItems);
        this.page++;
        this.loading = false;
      });
    } else {
      this.allLoaded = true;
      this.loading = false;
    }
  }


  trackById(index: number, item: Post): number {
    return item.id;
  }


  handleSearchChange(searchData: { query: string }) {
    this.searchQuery = searchData.query
    this.page = 0;
    this.allLoaded = false
    this.fetchPosts(true);
  }

  //
  // @HostListener('window:scroll', [])
  // onScroll(): void {
  //   if (this.loading || this.allLoaded) return;
  //
  //   const scrollPosition = window.innerHeight + window.scrollY;
  //   const threshold = document.documentElement.scrollHeight - 200;
  //
  //   if (scrollPosition >= threshold) {
  //     this.loading = true;
  //     this.fetchPosts();
  //   }
  // }


}
