import {AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {PostMetaComponent} from '../post-meta/post-meta.component';
import {Post} from '../model/post';
import {PostFacade} from '../facade/post.facade';

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    AsyncPipe,
    PostMetaComponent
  ],
  providers: [PostFacade],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.css'
})
export class DiaryComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollTrigger', {static: false}) scrollTrigger!: ElementRef;
  private observer!: IntersectionObserver;

  protected postFacade = inject(PostFacade);

  readonly posts$ = this.postFacade.posts$;
  readonly loading$ = this.postFacade.loading$;
  readonly error$ = this.postFacade.error$;
  readonly allLoaded$ = this.postFacade.allLoaded$;

  ngOnInit(): void {
    this.postFacade.initDiary(4);
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
}
