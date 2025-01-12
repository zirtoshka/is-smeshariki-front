import {Component, HostListener, OnInit} from '@angular/core';
import {PostService} from './post.service';
import {NgForOf, NgIf} from '@angular/common';
import {PostMetaComponent} from '../post-meta/post-meta.component';
import {PostComponent} from '../post/post.component';

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    PostMetaComponent,
    PostComponent
  ],
  providers:[PostService],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.css'
})
export class DiaryComponent implements OnInit{
  posts: any[] = [];
  loading = true;
  error = false;
  page = 0; // Текущая страница
  offset = 4; // Количество постов за раз
  allLoaded = false; // Флаг окончания подгрузки

  constructor(private postService: PostService) {}

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



// this.newsService.getNews('us', 'technology').subscribe({
//   next: (response) => {
//     this.news = response.articles;
//     this.loading = false;
//   },
//   error: (err) => {
//     console.error('Error fetching news:', err);
//     this.error = true;
//     this.loading = false;
//   }
// });
