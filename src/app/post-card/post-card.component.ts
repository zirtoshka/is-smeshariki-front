import {Component, inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NzCardComponent, NzCardMetaComponent} from 'ng-zorro-antd/card';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {DatePipe, Location, NgForOf, NgIf} from '@angular/common';
import {NzTagComponent} from 'ng-zorro-antd/tag';
import {Post} from '../model/post';
import {PostService} from '../services/post.service';
import {ActivatedRoute} from '@angular/router';
import {carrotIcon, carrotTouchedIcon, IconService} from '../services/icon.service';
import {CarrotCountComponent} from '../carrot-count/carrot-count.component';
import {CommentS} from '../model/comment';
import {NestedCommComponent} from '../nested-comm/nested-comm.component';
import {CommentService} from '../services/comment.service';
import {Likeable} from '../base/likeable';
import {PostTagComponent} from '../post-tag/post-tag.component';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {BackButtonComponent} from '../back-button/back-button.component';
import {DataFormaterService} from '../data-formater.service';
import {NotificationCustomService} from '../notification-custom.service';
import {CarrotService} from '../services/carrot.service';
import {isLocalCompilationDiagnostics} from '@angular/compiler-cli';


@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [
    NzCardComponent,
    NzAvatarComponent,
    NzIconDirective,
    NgIf,
    NzTagComponent,
    CarrotCountComponent,
    NgForOf,
    NestedCommComponent,
    PostTagComponent,
    NzButtonComponent,
    BackButtonComponent,
    NzCardMetaComponent
  ],
  providers: [PostService, DatePipe],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent implements OnInit, OnChanges, Likeable {
  commentsList: CommentS[] = [];
  isCommentsVisible: boolean = false;
  isCommentExisted: boolean = false;
  isLiked: boolean = false;


  @Input() isFeed = false
  protected notificationCustomService = inject(NotificationCustomService);
  protected carrotService = inject(CarrotService);


  @Input() post!: Post;

  iconCarrot = carrotIcon;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private iconService: IconService,
    protected commentService: CommentService, private location: Location,
    protected dateFormatterService: DataFormaterService
  ) {
  }

  handleGoBack(): void {
    console.log('Go back clicked');
    this.location.back();
  }


  ngOnInit(): void {
    if (!this.post) {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.postService.getPostById(id).subscribe({
        next: (response) => {
          this.post = Post.fromBackend(response);
          this.commentsList = this.commentService.getCommentsByPostId(this.post.id);
          this.isCommentExisted = this.commentsList.length > 0;
        },
        error: (err: any) => {
          console.error('Ошибка при загрузке:', err);
          this.notificationCustomService.handleErrorAsync(err, 'Держите меня, я падаю…');
        }
      });
    } else {
      console.log(this.post)
    }
    this.carrotService.isLikePost(this.post.id).subscribe((result) => {
      this.isLiked = result;
      this.setCarrotIcon()
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['post']) {
      this.commentsList = this.commentService.getCommentsByPostId(this.post.id);
      this.isCommentExisted = this.commentsList.length > 0;
    }
  }


  toggleLike() {
    if (!this.isLiked) {
      this.carrotService.setCarrotOnPost(this.post.id)
        .subscribe((success) => {
          if (success) {
            this.isLiked = true
            this.post.countCarrots++;
            this.setCarrotIcon()
          }
        });
    } else {
      this.carrotService.deleteCarrotOnPost(this.post.id)
        .subscribe((success) => {
          if (success) {
            this.isLiked = false
            this.post.countCarrots--;
            this.setCarrotIcon()
          }
        });
    }
  }

  setCarrotIcon() {
    this.iconCarrot = this.isLiked ? carrotTouchedIcon : carrotIcon;
  }

  toggleComments() {
    this.isCommentsVisible = !this.isCommentsVisible;
  }


}
