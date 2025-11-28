import {AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {PostCardComponent} from '../post-card/post-card.component';
import {Post} from '../model/post';
import {PostFacade} from '../facade/post.facade';
import {NzSkeletonComponent} from 'ng-zorro-antd/skeleton';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    AsyncPipe,
    PostCardComponent,
    NzSkeletonComponent
  ],
  providers: [PostFacade],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent implements OnInit, AfterViewInit {
  searchQuery: string = '';

  @ViewChild('scrollTrigger', {static: false}) scrollTrigger!: ElementRef;
  private observer!: IntersectionObserver;

  protected postFacade = inject(PostFacade);

  readonly posts$ = this.postFacade.posts$;
  readonly loading$ = this.postFacade.loading$;
  readonly error$ = this.postFacade.error$;
  readonly allLoaded$ = this.postFacade.allLoaded$;
  readonly skeletonPlaceholders = Array.from({length: 3}, (_, index) => index);


  ngOnInit(): void {
    this.postFacade.initFeed();
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.scrollTrigger) {
        this.observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            this.postFacade.loadNext();
          }
        }, {threshold: 1.0});

        this.observer.observe(this.scrollTrigger.nativeElement);
      }
    }, 0);

  }

  trackById(index: number, item: Post): number {
    return item.id;
  }

  trackSkeleton(index: number): number {
    return this.skeletonPlaceholders[index] ?? index;
  }

  handleSearchChange(searchData: { query: string }) {
    this.searchQuery = searchData.query;
    this.postFacade.updateFeedQuery(searchData.query);
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
