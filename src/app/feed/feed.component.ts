import {Component, HostListener, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {PostService} from '../services/post.service';
import {PostCardComponent} from '../post-card/post-card.component';
import {BanCardComponent} from '../ban/ban-card/ban-card.component';

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
  posts: any[] = [];
  loading = true;
  error = false;
  page = 0; // Текущая страница
  offset = 4; // Количество постов за раз
  allLoaded = false; // Флаг окончания подгрузки

  constructor(private postService: PostService) {
  }

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(): void {
    console.log("сейчас загружено постов: ", this.posts.length)
    console.log("сейчас идет запрос для подгрузки постов", this.page, this.offset)
    const newPosts = this.postService.getPosts(this.page * this.offset, this.offset);
    if (newPosts.length) {
      this.posts = [...this.posts, ...newPosts];
      this.page++;
    } else {
      this.allLoaded = true; // Больше постов нет
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
