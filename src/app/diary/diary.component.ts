import {Component, HostListener, inject, OnInit} from '@angular/core';
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
  providers:[PostService],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.css'
})
export class DiaryComponent implements OnInit{
  items: any[] = [];
  loading = true;
  error = false;

  page = 0; // Текущая страница
  allLoaded = false; // Флаг окончания подгрузки

  protected notificationCustomService = inject(NotificationCustomService);
  protected postService = inject(PostService);

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(replacementIsNeeded: boolean = false): void {
    const newPosts = this.postService.getDiary({
      page: this.page,
    }).subscribe({
      next: (response) => {
        const newItems = response.content.map(data => Post.fromBackend(data));
        this.fetchHelper(newItems, replacementIsNeeded)
      },
      error: (err: any) => {
        console.error('Ошибка при загрузке:', err);
        this.notificationCustomService.handleErrorAsync(err,'Держите меня, я падаю…');
      }
    });
  }

  fetchHelper(newItems: Post[], replacementIsNeeded: boolean = false) {
    if (replacementIsNeeded) {
      this.items = []
    }
    const uniqueNewItems = newItems.filter(
      (newItem) => !this.items.some((existingItem) => existingItem.id === newItem.id)
    );
    if (newItems.length) {
      this.items = [...this.items, ...uniqueNewItems];
      this.page++;
    } else {
      this.allLoaded = true;
    }
    this.loading = false;
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.loading || this.allLoaded) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 200;

    if (scrollPosition >= threshold) {
      this.loading = true;
      this.fetchPosts();
    }
  }
}
