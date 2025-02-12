import {AfterViewInit, Component, ElementRef, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import {PostService} from '../services/post.service';
import {NgForOf, NgIf} from '@angular/common';
import {PostMetaComponent} from '../post-meta/post-meta.component';
import {PostCardComponent} from '../post-card/post-card.component';
import {NotificationCustomService} from '../notification-custom.service';
import {Post} from '../model/post';

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    PostMetaComponent,
    PostCardComponent
  ],
  providers: [PostService],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.css'
})
export class DiaryComponent implements OnInit, AfterViewInit {
  items: any[] = [];
  loading = false;
  error = false;

  page = 0; // Текущая страница
  allLoaded = false; // Флаг окончания подгрузки

  @ViewChild('scrollTrigger', {static: false}) scrollTrigger!: ElementRef;
  private observer!: IntersectionObserver;

  protected notificationCustomService = inject(NotificationCustomService);
  protected postService = inject(PostService);

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
        }, {threshold: 1.0});

        this.observer.observe(this.scrollTrigger.nativeElement);
      }
    }, 0);

  }

  fetchPosts(replacementIsNeeded: boolean = false): void {
    if (this.loading) return;

    this.loading = true;

    this.postService.getDiary({
      page: this.page,
      size: 4
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

  fetchHelper(newItems: Post[], replacementIsNeeded: boolean = false) {
    if (replacementIsNeeded) {
      this.items = []
      this.page = 0;
    }
    const uniqueNewItems = newItems.filter(
      (newItem) => !this.items.some((existingItem) => existingItem.id === newItem.id)
    );
    if (uniqueNewItems.length) {
      this.items = [...this.items, ...uniqueNewItems];
      this.page++;
      this.loading = false;
    } else {
      this.allLoaded = true;
      this.loading = false;
    }
  }

  trackById(index: number, item: Post): number {
    return item.id;
  }


}
