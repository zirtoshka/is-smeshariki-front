import {Component, HostListener, inject, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {PostService} from '../services/post.service';
import {PostCardComponent} from '../post-card/post-card.component';
import {BanCardComponent} from '../ban/ban-card/ban-card.component';
import {NotificationCustomService} from '../notification-custom.service';
import {Post} from '../model/post';
import {SearchFilterComponent} from '../search-filter/search-filter.component';
import {DataFormaterService} from '../data-formater.service';
import {UserService} from '../services/user.service';
import {Smesharik} from '../auth-tools/smesharik';

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
export class FeedComponent implements OnInit {
  items: any[] = [];
  private authorsMap = new Map<string, Smesharik>();

  loading = true;
  error = false;

  searchQuery: string = '';

  page = 0; // Текущая страница
  allLoaded = false; // Флаг окончания подгрузки

  protected notificationCustomService = inject(NotificationCustomService);
  protected postService = inject(PostService);
  protected authorService = inject(UserService);


  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(replacementIsNeeded: boolean = false): void {
    const newPosts = this.postService.getFeed({
      page: this.page,
      filter: this.searchQuery,
    }).subscribe({
      next: (response) => {
        const newItems = response.content.map(data => Post.fromBackend(data));
        this.fetchHelper(newItems, replacementIsNeeded)
      },
      error: (err: any) => {
        console.error('Ошибка при загрузке:', err);
        this.notificationCustomService.handleErrorAsync(err, 'Держите меня, я падаю…');
      }
    });
  }


  fetchHelper(newItems: Post[], replacementIsNeeded: boolean = false) {
    if (replacementIsNeeded) {
      this.items = [];
    }

    let uniqueNewItems = newItems.filter(
      (newItem) => !this.items.some((existingItem) => existingItem.id === newItem.id)
    );

    if (uniqueNewItems.length) {
      uniqueNewItems = this.setAuthors(uniqueNewItems)
      this.items = [...this.items, ...uniqueNewItems];
      this.page++;
    } else {
      this.allLoaded = true;
    }
    this.loading = false;
  }


  setAuthors(uniqueNewItems: Post[]) {
    uniqueNewItems.forEach((item) => {
      const author = this.authorsMap.get(item.author);
      if (author) {
        item.smesharikAuthor = author;
      } else {
        this.authorService.getSmesharikByLogin(item.author).subscribe((fetchedAuthor) => {
          item.smesharikAuthor = fetchedAuthor;
          this.authorsMap.set(fetchedAuthor.login, fetchedAuthor);
        });
      }
    });
    return uniqueNewItems;
  }

  handleSearchChange(searchData: { query: string }) {
    this.searchQuery = searchData.query
    this.page = 0;
    this.allLoaded = false
    this.fetchPosts(true);
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
