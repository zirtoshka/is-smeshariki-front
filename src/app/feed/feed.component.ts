import {Component, HostListener, inject, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {PostService} from '../services/post.service';
import {PostCardComponent} from '../post-card/post-card.component';
import {BanCardComponent} from '../ban/ban-card/ban-card.component';
import {Ban} from '../model/ban';
import {NotificationCustomService} from '../notification-custom.service';
import {Post} from '../model/post';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    PostCardComponent,
    BanCardComponent
  ],
  providers: [PostService],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent implements OnInit {
  items: any[] = [];
  loading = true;
  error = false;

  searchQuery: string = '';

  page = 0; // Текущая страница
  allLoaded = false; // Флаг окончания подгрузки

  protected notificationCustomService = inject(NotificationCustomService);
  protected postService = inject(PostService);


  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(): void {
    console.log("сейчас загружено постов: ", this.items.length)
    // console.log("сейчас идет запрос для подгрузки постов", this.page, this.offset)
    const newPosts = this.postService.getPosts({
      page: this.page,
      filter: this.searchQuery,
    }).subscribe({
      next: (response) => {
        const newItems = response.content.map(data => Post.fromBackend(data));
        this.fetchHelper(newItems)
      },
      error: (err: any) => {
        console.error('Ошибка при загрузке:', err);
        this.notificationCustomService.handleErrorAsync(err,'Держите меня, я падаю…');
      }
    });

    // if (newPosts.length) {
    //   this.posts = [...this.posts, ...newPosts];
    //   this.page++;
    // } else {
    //   this.allLoaded = true; // Больше постов нет
    // }
    // this.loading = false;
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
    console.log(this.items)
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
